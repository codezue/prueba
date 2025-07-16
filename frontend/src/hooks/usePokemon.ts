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
    queryFn: () => {
      // No hacer la búsqueda si la query es muy corta
      if (query.length > 0 && query.length < 3) {
        return Promise.resolve({
          data: [],
          total: 0,
          limit,
          offset,
        });
      }
      return searchPokemons(query, limit, offset);
    },
    enabled: query.length >= 3, // Solo habilitar si tiene al menos 3 caracteres
    staleTime: 1000 * 60 * 5, // 5 minutos de stale time
  });
};

export const usePokemonDetails = (idOrName: string) => {
  return useQuery<Pokemon, Error>({
    queryKey: ['pokemonDetails', idOrName],
    queryFn: () => fetchPokemonDetails(idOrName),
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};