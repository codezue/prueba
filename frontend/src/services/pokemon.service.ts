import { apiClient } from '../api/apiClient';
import type { PaginatedPokemon, Pokemon } from '../models/pokemon';

export const fetchPokemons = async (
  limit: number = 20,
  offset: number = 0,
): Promise<PaginatedPokemon> => {
  const response = await apiClient.get('/pokemon', {
    params: { limit, offset },
  });
  return response.data;
};

export const searchPokemons = async (
  query: string,
  limit: number = 20,
  offset: number = 0,
): Promise<PaginatedPokemon> => {
  const response = await apiClient.get('/pokemon/search', {
    params: { query, limit, offset },
  });
  return response.data;
};

export const fetchPokemonDetails = async (idOrName: string): Promise<Pokemon> => {
  const response = await apiClient.get(`/pokemon/${idOrName}`);
  return response.data;
};