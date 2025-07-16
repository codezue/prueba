import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container, CircularProgress, Alert, Typography, Chip, Stack, Paper, Button } from '@mui/material';
import { usePokemonDetails } from '../hooks/usePokemon';
import { Notification } from '../components/Notification';

const PokemonDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<{
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  } | null>(null);
  
  const { idOrName } = useParams<{ idOrName: string }>();
  const { data: pokemon, isLoading, error } = usePokemonDetails(idOrName || '');

  useEffect(() => {
    if (error) {
      setNotification({
        message: `Error cargando Pokémon: ${error.message}`,
        severity: 'error',
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!pokemon) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="warning">Pokémon no encontrado</Alert>
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
        Pokémon Detail
      </Typography>
      <Button 
        variant="outlined" 
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        ← Volver a la lista
      </Button>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
          <Box flex={1} display="flex" justifyContent="center">
            <img
              src={pokemon.imageUrl}
              alt={pokemon.name}
              style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
            />
          </Box>
          <Box flex={1}>
            <Typography variant="h3" sx={{ textTransform: 'capitalize', mb: 2 }}>
              {pokemon.name}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {pokemon.types.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  color="primary"
                  sx={{ textTransform: 'capitalize' }}
                />
              ))}
            </Stack>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Stats
            </Typography>
            <Stack spacing={1}>
              <Typography>HP: {pokemon.stats.hp}</Typography>
              <Typography>Attack: {pokemon.stats.attack}</Typography>
              <Typography>Defense: {pokemon.stats.defense}</Typography>
              <Typography>Special Attack: {pokemon.stats.specialAttack}</Typography>
              <Typography>Special Defense: {pokemon.stats.specialDefense}</Typography>
              <Typography>Speed: {pokemon.stats.speed}</Typography>
            </Stack>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default PokemonDetailPage;