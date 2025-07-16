import React, { useEffect, useState } from 'react';

import { Container, CircularProgress, Alert, Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { usePokemons, useSearchPokemons } from '../hooks/usePokemon';
import PokemonCard from '../components/PokemonCard';
import SearchInput from '../components/SearchInput';
import PaginationControls from '../components/PaginationControls';
import { Notification } from '../components/Notification';

const LIMIT = 20;

const PokemonListPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  } | null>(null);
  
  const offset = (page - 1) * LIMIT;

  // Usamos un efecto para manejar la notificación de búsqueda muy corta
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
  } = useSearchPokemons(searchQuery, LIMIT, offset);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset a la primera página en cada nueva búsqueda
  };

  const isLoading = isPokemonsLoading || isSearchLoading;
  const error = pokemonsError || searchError;
  const data = searchQuery.length > 0 ? searchData : pokemonsData;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Notification
          message={`Error loading Pokémon: ${error.message}`}
          severity="error"
          onClose={() => setNotification(null)}
        />
      </Container>
    );
  }

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

      <Box sx={{ mb: 4 }}>
        <SearchInput 
          onSearch={handleSearch} 
          delay={500} 
          minLength={3}
        />
      </Box>

      {isLoading ? (
        <Box display="flex" flexDirection="column" alignItems="center" my={4}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Loading Pokémon...
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {data?.data.map((pokemon) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.id}>
                <PokemonCard pokemon={pokemon} />
              </Grid>
            ))}
          </Grid>

          {data && (
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
    </Container>
  );
};

export default PokemonListPage;