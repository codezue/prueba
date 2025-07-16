import { useQuery } from '@tanstack/react-query';
import {
  fetchPokemons,
  searchPokemons,
  fetchPokemonDetails,
  fetchPokemonTypes,
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
  typeFilter: string,
  limit: number = 20,
  offset: number = 0,
) => {
  return useQuery<PaginatedPokemon, Error>({
    queryKey: ['searchPokemons', query, typeFilter, limit, offset],
    queryFn: () => {
      if ((query.length > 0 && query.length < 3) && !typeFilter) {
        return Promise.resolve({
          data: [],
          total: 0,
          limit,
          offset,
        });
      }
      return searchPokemons(query, typeFilter, limit, offset);
    },
    enabled: query.length >= 3 || !!typeFilter,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePokemonDetails = (idOrName: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemonDetails', idOrName],
    queryFn: () => fetchPokemonDetails(idOrName),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};

export const usePokemonTypes = () => {
  return useQuery<string[], Error>({
    queryKey: ['pokemonTypes'],
    queryFn: fetchPokemonTypes,
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};