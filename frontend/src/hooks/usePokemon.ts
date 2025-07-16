import { useQuery } from '@tanstack/react-query';
import {
  fetchPokemons,
  searchPokemons,
  fetchPokemonDetails,
} from '../services/pokemon.service';
import type { PaginatedPokemon, Pokemon } from '../models/pokemon';

export const usePokemons = (limit: number = 20, offset: number = 0) => {
  return useQuery<PaginatedPokemon, Error>({
    queryKey: ['pokemons', limit, offset],
    queryFn: () => fetchPokemons(limit, offset),
  });
};

export const useSearchPokemons = (
  query: string,
  limit: number = 20,
  offset: number = 0,
) => {
  return useQuery<PaginatedPokemon, Error>({
    queryKey: ['searchPokemons', query, limit, offset],
    queryFn: () => searchPokemons(query, limit, offset),
    enabled: query.length > 0
  });
};

export const usePokemonDetails = (idOrName: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemonDetails', idOrName],
    queryFn: () => fetchPokemonDetails(idOrName),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};