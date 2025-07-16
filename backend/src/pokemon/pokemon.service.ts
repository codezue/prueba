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
    console.log(`Checking cache for key: ${cacheKey}`);
    const cachedData = await this.cacheManager.get<PaginatedPokemonDto>(cacheKey);

    if (cachedData) {
      console.log('Cache HIT for key:', cacheKey);
      return cachedData;
    }
    console.log('Cache MISS for key:', cacheKey);

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

    console.log('Setting cache for key:', cacheKey);
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

  async search(query: string, limit: number = 20, offset: number = 0): Promise<PaginatedPokemonDto> {
    const cacheKey = `pokemon_search_${query}_${limit}_${offset}`;
    const cachedData = await this.cacheManager.get<PaginatedPokemonDto>(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        // Primero intentamos buscar directamente por nombre (puede ser un pokemon específico)
        try {
            const pokemon = await this.getPokemonDetails(query);
            return {
                data: [pokemon],
                total: 1,
                limit,
                offset: 0,
            };
        } catch {
            // Si no encuentra por nombre exacto, buscamos en la lista completa
            const allPokemon = await this.findAll(10000, 0);
            
            const filtered = allPokemon.data.filter(p => 
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.types.some(t => t.toLowerCase().includes(query.toLowerCase()))
            );

            const paginated = filtered.slice(offset, offset + limit);

            const result = {
                data: paginated,
                total: filtered.length,
                limit,
                offset,
            };

            await this.cacheManager.set(cacheKey, result, 60 * 60 * 1000); // Cache por 1 hora
            return result;
        }
    } catch (error) {
        throw new NotFoundException(`No Pokémon found matching "${query}"`);
    }
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
