import React from 'react';
import { Box, Typography, Chip, Stack, Paper, Divider } from '@mui/material';
import type { Pokemon } from '../models/pokemon';

interface PokemonDetailProps {
  pokemon: Pokemon;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  return (
    <Box>
      <Box 
        sx={{ 
          height: 200,
          backgroundColor: 'primary.main',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={pokemon.imageUrl}
          alt={pokemon.name}
          sx={{
            height: '90%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
          }}
        />
      </Box>
      
      <Box sx={{ p: 4 }}>
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

        <Divider sx={{ my: 3 }} />

        <Typography variant="h5" sx={{ mb: 2 }}>
          Stats
        </Typography>
        
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2,
            mb: 3
          }}
        >
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>HP: {pokemon.stats.hp}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>Attack: {pokemon.stats.attack}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>Defense: {pokemon.stats.defense}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>Special Attack: {pokemon.stats.specialAttack}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>Special Defense: {pokemon.stats.specialDefense}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography>Speed: {pokemon.stats.speed}</Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default PokemonDetail;