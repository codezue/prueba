import { ApiProperty } from '@nestjs/swagger';
import { Pokemon } from '../entities/pokemon.entity';

export class PaginatedPokemonDto {
  @ApiProperty({ description: 'Lista de Pokémon', type: [Pokemon] })
  data: Pokemon[];

  @ApiProperty({ description: 'Total de Pokémon disponibles' })
  total: number;

  @ApiProperty({ description: 'Límite de resultados por página' })
  limit: number;

  @ApiProperty({ description: 'Offset actual' })
  offset: number;
}