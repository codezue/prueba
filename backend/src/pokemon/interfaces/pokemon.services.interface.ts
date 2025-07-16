import { PaginatedPokemonDto } from '../dto/paginated-pokemon.dto';
import { Pokemon } from '../entities/pokemon.entity';

export interface IPokemonService {
  findAll(limit: number, offset: number): Promise<PaginatedPokemonDto>;
  findOne(idOrName: string): Promise<Pokemon>;
  search(query: string, limit: number, offset: number): Promise<PaginatedPokemonDto>;
  getAllTypes(): Promise<string[]>
}