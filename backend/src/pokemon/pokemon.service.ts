import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { PaginatedPokemonDto } from './dto/paginated-pokemon.dto';
import { firstValueFrom } from 'rxjs';
import { Pokemon } from './entities/pokemon.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PokemonService {
  private readonly BASE_URL = 'pokemon';

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(limit: number = 20, offset: number = 0): Promise<PaginatedPokemonDto> {
    const cacheKey = `pokemon_all_${limit}_${offset}`;
    const cachedData = await this.cacheManager.get<PaginatedPokemonDto>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await firstValueFrom(
      this.httpService.get(`${this.BASE_URL}?limit=${limit}&offset=${offset}`),
    );

    const pokemonList = await Promise.all(
      response.data.results.map(async (pokemon: any) => {
        return this.getPokemonDetails(pokemon.name);
      }),
    );

    const result = {
      data: pokemonList,
      total: response.data.count,
      limit,
      offset,
    };

    await this.cacheManager.set(cacheKey, result);
    return result;
  }

  async findOne(idOrName: string): Promise<Pokemon> {
    const cacheKey = `pokemon_${idOrName}`;
    const cachedData = await this.cacheManager.get<Pokemon>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const pokemon = await this.getPokemonDetails(idOrName);
    await this.cacheManager.set(cacheKey, pokemon);
    return pokemon;
  }

  async search(
    query?: string,
    typeFilter?: string,
    limit = 20,
    offset = 0
  ): Promise<PaginatedPokemonDto> {
    const normalizedType = typeFilter?.toLowerCase();
    const normalizedQuery = query?.toLowerCase();
    const cacheKey = `pokemon_search_${normalizedQuery || 'none'}_${normalizedType || 'none'}_${limit}_${offset}`;

    const cachedData = await this.cacheManager.get<PaginatedPokemonDto>(cacheKey);
    if (cachedData) return cachedData;

    try {
      let candidateNames: string[] = [];

      if (normalizedType) {
        try {
          const typeResponse = await firstValueFrom(
            this.httpService.get(`/type/${normalizedType}`)
          );

          candidateNames = typeResponse.data.pokemon.map(
            (p: any) => p.pokemon.name
          );
        } catch {
          throw new NotFoundException(`Pokemones con del tipo "${typeFilter}" no encontrados`);
        }
      } else {
        const allResponse = await firstValueFrom(
          this.httpService.get(`/pokemon?limit=10000&offset=0`)
        );

        candidateNames = allResponse.data.results.map((p: any) => p.name);
      }

      const filteredNames = candidateNames.filter(name =>
        normalizedQuery ? name.includes(normalizedQuery) : true
      );

      if (filteredNames.length === 0) {
        throw new NotFoundException(`Pokemones no encontrados con el filtro "${query || 'any'}"`);
      }

      const detailed = await Promise.all(
        filteredNames.map(name => this.getPokemonDetails(name))
      );

      const paginated = detailed.slice(offset, offset + limit);

      const result: PaginatedPokemonDto = {
        data: paginated,
        total: detailed.length,
        limit,
        offset,
      };

      await this.cacheManager.set(cacheKey, result, 60 * 60 * 1000);
      return result;
    } catch (error) {
      throw new NotFoundException(
        `Pokemones no encontrados con el filtro de"${query || 'todos'}" o tipo "${typeFilter || 'todos'}"`
      );
    }
  }

  async getAllTypes(): Promise<string[]> {
    const cacheKey = 'pokemon_types';
    const cached = await this.cacheManager.get<string[]>(cacheKey);

    if (cached) {
      return cached;
    }

    const response = await firstValueFrom(
      this.httpService.get('/type')
    );

    const types = response.data.results
      .map((type: any) => type.name)

    await this.cacheManager.set(cacheKey, types, 60 * 60 * 1000);
    return types;
  }

  private async getPokemonDetails(idOrName: string): Promise<Pokemon> {
    const response = await firstValueFrom(
      this.httpService.get(`${this.BASE_URL}/${idOrName}`),
    );

    const pokemonData = response.data;

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      imageUrl: pokemonData.sprites.other['official-artwork'].front_default,
      types: pokemonData.types.map((t: any) => t.type.name),
      stats: {
        hp: pokemonData.stats[0].base_stat,
        attack: pokemonData.stats[1].base_stat,
        defense: pokemonData.stats[2].base_stat,
        specialAttack: pokemonData.stats[3].base_stat,
        specialDefense: pokemonData.stats[4].base_stat,
        speed: pokemonData.stats[5].base_stat,
      },
    };
  }
}
