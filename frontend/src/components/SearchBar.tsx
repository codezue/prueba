import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import SearchInput from './SearchInput';

interface Props {
  types: string[];
  selectedType: string;
  onTypeChange: (value: string) => void;
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<Props> = ({
  types,
  selectedType,
  onTypeChange,
  onSearch
}) => {
  return (
    <Box
      sx={{
        mb: 4,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        alignItems: 'center',
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <SearchInput onSearch={onSearch} delay={500} minLength={3} />
      </Box>

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Filter by type</InputLabel>
        <Select
          value={selectedType}
          label="Filter by type"
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <MenuItem value="">All Types</MenuItem>
          {types.map((type) => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};