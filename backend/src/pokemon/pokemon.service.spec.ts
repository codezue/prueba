import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Observable, of, Subscriber } from 'rxjs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpService: HttpService;
  let cacheManager: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PokemonService>(PokemonService);
    httpService = module.get<HttpService>(HttpService);
    cacheManager = module.get(CACHE_MANAGER);
  });

  it('should return types from cache if available', async () => {
    const cachedTypes = ['fire', 'water'];
    cacheManager.get.mockResolvedValue(cachedTypes);

    const result = await service.getAllTypes();

    expect(result).toEqual(cachedTypes);
    expect(cacheManager.get).toHaveBeenCalledWith('pokemon_types');
  });

  it('should fetch types from API if not cached', async () => {
    cacheManager.get.mockResolvedValue(null);

    const types = ['fire', 'water'];
    (httpService.get as jest.Mock).mockReturnValue(
      of({ data: { results: types.map((name) => ({ name })) } })
    );

    const result = await service.getAllTypes();

    expect(result).toEqual(types);
    expect(httpService.get).toHaveBeenCalledWith('/type');
    expect(cacheManager.set).toHaveBeenCalledWith('pokemon_types', types, expect.any(Number));
  });

  it('should return an empty result if no Pokémon match filters', async () => {
    (httpService.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/pokemon?limit=')) {
        return of({ data: { results: [] } });
      }
      return of({ data: {} });
    });

    (cacheManager.get as jest.Mock).mockResolvedValue(null);

    const result = await service.search('zzzzz', '', 20, 0);

    expect(result).toEqual({
      data: [],
      limit: 20,
      offset: 0,
      total: 0,
    });
    await expect(service.search('zzzzz', '', 20, 0)).resolves.not.toThrow();
  });

  it('should return an empty result if a non-existent type is filtered', async () => {
    (httpService.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/type/nonexistenttype')) {
        return new (class extends Observable<any> {
          _subscribe(subscriber: Subscriber<any>) {
            subscriber.error(new Error('Request failed with status code 404'));
          }
        })();
      }
      return of({ data: { results: [] } });
    });

    (cacheManager.get as jest.Mock).mockResolvedValue(null);

    const result = await service.search('', 'nonexistenttype', 20, 0);

    expect(result).toEqual({
      data: [],
      limit: 20,
      offset: 0,
      total: 0,
    });
    await expect(service.search('', 'nonexistenttype', 20, 0)).resolves.not.toThrow();
  });
});