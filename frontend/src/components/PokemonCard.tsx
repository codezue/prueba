import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Stack } from '@mui/material';
import type { Pokemon } from '../models/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={pokemon.imageUrl}
        alt={pokemon.name}
        sx={{ objectFit: 'contain', backgroundColor: '#f5f5f5' }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
          {pokemon.name}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          {pokemon.types.map((type) => (
            <Chip
              key={type}
              label={type}
              size="small"
              sx={{ textTransform: 'capitalize' }}
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          HP: {pokemon.stats.hp} | ATK: {pokemon.stats.attack}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PokemonCard;