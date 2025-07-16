import React, { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  delay?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch, delay = 300 }) => {
  const [query, setQuery] = useState('');

  const debouncedSearch = React.useMemo(
    () => debounce((searchQuery: string) => onSearch(searchQuery), delay),
    [onSearch, delay],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search Pokémon by name or type..."
      value={query}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInput;