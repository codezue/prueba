import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  IconButton, 
  Typography, 
  Chip, 
  Stack, 
  Paper, 
  Box 
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Notification } from './Notification';
import type { Pokemon } from '../models/pokemon';

interface PokemonDetailModalProps {
  pokemon: Pokemon | null;
  onClose: () => void;
  notification: {
    message: string;
    severity: 'error' | 'warning' | 'info' | 'success';
  } | null;
  onNotificationClose: () => void;
}

const PokemonDetailModal: React.FC<PokemonDetailModalProps> = ({ 
  pokemon, 
  onClose,
  notification,
  onNotificationClose
}) => {
  if (!pokemon) return null;

  return (
    <Dialog
      open={!!pokemon}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          overflow: 'hidden',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0,0,0,0.7)',
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          zIndex: 1,
          color: 'text.primary',
          backgroundColor: 'rgba(255,255,255,0.7)',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.9)',
          }
        }}
      >
        <Close />
      </IconButton>
      
      <DialogContent sx={{ p: 0 }}>
        {notification && (
          <Box sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1 }}>
            <Notification
              message={notification.message}
              severity={notification.severity}
              onClose={onNotificationClose}
            />
          </Box>
        )}
        
        <Paper sx={{ p: 4, borderRadius: 0 }}>
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
      </DialogContent>
    </Dialog>
  );
};

export default PokemonDetailModal;