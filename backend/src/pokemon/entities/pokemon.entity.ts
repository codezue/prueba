import { ApiProperty } from "@nestjs/swagger";

export class Pokemon {
  @ApiProperty({ description: 'ID del Pokémon' })
  id: number;

  @ApiProperty({ description: 'Nombre del Pokémon' })
  name: string;

  @ApiProperty({ description: 'URL de la imagen del Pokémon' })
  imageUrl: string;

  @ApiProperty({ description: 'Tipos del Pokémon', isArray: true })
  types: string[];

  @ApiProperty({ description: 'Estadísticas del Pokémon' })
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}
