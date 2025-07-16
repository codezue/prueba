import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedPokemonDto } from './dto/paginated-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@ApiTags('pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista paginada de Pokémon' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedPokemonDto })
  async findAll(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<PaginatedPokemonDto> {
    return this.pokemonService.findAll(limit, offset);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar Pokémon por nombre o tipo' })
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, type: PaginatedPokemonDto })
  async search(
    @Query('query') query: string,
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0,
  ): Promise<PaginatedPokemonDto> {
    return this.pokemonService.search(query, limit, offset);
  }

  @Get(':idOrName')
  @ApiOperation({ summary: 'Obtener detalles de un Pokémon por ID o nombre' })
  @ApiResponse({ status: 200, type: Pokemon })
  async findOne(@Param('idOrName') idOrName: string): Promise<Pokemon> {
    return this.pokemonService.findOne(idOrName);
  }
}
