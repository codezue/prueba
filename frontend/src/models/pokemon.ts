export interface Pokemon {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}

export interface PaginatedPokemon {
  data: Pokemon[];
  total: number;
  limit: number;
  offset: number;
}