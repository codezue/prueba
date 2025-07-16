import React, { useEffect, useState } from 'react';
import { Container, CircularProgress, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { usePokemons, usePokemonTypes, useSearchPokemons } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import PaginationControls from '../components/PaginationControls';
import { Notification } from '../components/Notification';
import type { Pokemon } from '../models/pokemon';
import PokemonDetailModal from '../components/PokemonDetailModal';
import { SearchBar } from '../components/SearchBar';

const LIMIT = 20;

const PokemonListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  } | null>(null);
  
  const offset = (page - 1) * LIMIT;

  
  
  const {
    data: pokemonsData,
    isLoading: isPokemonsLoading,
    error: pokemonsError,
  } = usePokemons(LIMIT, offset);
  
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    isFetching: isSearchFetching,
  } = useSearchPokemons(searchQuery, selectedType, LIMIT, offset);

  const { 
    data: types, 
    isLoading: loadingTypes 
  } = usePokemonTypes();


  const isLoading = isPokemonsLoading || isSearchLoading;
  const error = pokemonsError || searchError;
  const isFiltered = searchQuery.length >= 3 || selectedType !== '';
  const data = isFiltered ? searchData : pokemonsData; 

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handlePokemonClick = (pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleCloseModal = () => {
    setSelectedPokemon(null);
  };

  const handleNotificationClose = () => {
    setNotification(null);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    if (searchQuery.length > 0 && searchQuery.length < 3) {
      setNotification({
        message: 'Please enter at least 3 characters to search',
        severity: 'info',
      });
    } else {
      setNotification(null);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (error) {
      setNotification({
        message: `Error loading Pokémon: ${error.message}`,
        severity: 'error',
      });
    }
  }, [error]);

  return (
    <Container sx={{ py: 4 }}>
      {notification && (
        <Notification
          message={notification.message}
          severity={notification.severity}
          onClose={() => setNotification(null)}
        />
      )}
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Pokédex Explorer
      </Typography>

      <SearchBar 
        types={types || []}
        selectedType={selectedType}
        onTypeChange={(value) => {
          setSelectedType(value);
          setPage(1);
        }}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <Box display="flex" flexDirection="column" alignItems="center" my={4}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Cargando Pokemones...
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {data?.data && data.data.length > 0 ? (
                data.data.map((pokemon) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.id}>
                    <PokemonCard 
                      pokemon={pokemon} 
                      onClick={() => handlePokemonClick(pokemon)}
                    />
                  </Grid>
                ))
              ) : (
                <Grid size={{ xs:12}}>
                  <Typography variant="body1" align="center">
                    No existen Pokémones que coincidan con tu búsqueda.
                  </Typography>
                </Grid>
              )}
          </Grid>

          {data && data.total > LIMIT && (
            <PaginationControls
              count={data.total}
              page={page}
              limit={LIMIT}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {isSearchFetching && !isLoading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress size={24} />
        </Box>
      )}

      <PokemonDetailModal 
        pokemon={selectedPokemon} 
        onClose={handleCloseModal}
        notification={notification}
        onNotificationClose={handleNotificationClose}
      />
    </Container>
  );
};

export default PokemonListPage;