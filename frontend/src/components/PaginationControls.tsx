import React from 'react';
import { Pagination, Stack, Typography } from '@mui/material';

interface PaginationControlsProps {
  count: number;
  page: number;
  limit: number;
  onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  count,
  page,
  limit,
  onPageChange,
}) => {
  const pageCount = Math.ceil(count / limit);

  return (
    <Stack spacing={2} alignItems="center" sx={{ my: 4 }}>
      <Typography variant="body2" color="text.secondary">
        Mostrando {(page - 1) * limit + 1}-
        {Math.min(page * limit, count)} de {count} Pokemones
      </Typography>
      <Pagination
        count={pageCount}
        page={page}
        onChange={(_, newPage) => onPageChange(newPage)}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default PaginationControls;