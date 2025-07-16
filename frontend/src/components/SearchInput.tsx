import React, { useEffect, useState, useCallback } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import debounce from 'lodash.debounce';

interface SearchInputProps {
  onSearch: (query: string) => void;
  delay?: number;
  minLength?: number;
}

const SearchInput: React.FC<SearchInputProps> = ({ 
  onSearch, 
  delay = 300,
  minLength = 3
}) => {
  const [query, setQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      setIsTyping(false);
      if (searchQuery.length >= minLength || searchQuery.length === 0) {
        onSearch(searchQuery);
      }
    }, delay),
    [onSearch, delay, minLength]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsTyping(true);
    
    if (newQuery.length >= minLength || newQuery.length === 0) {
      debouncedSearch(newQuery);
    }
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={`Buscar por nombre (min ${minLength} caracteres)...`}
      value={query}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: isTyping && query.length >= minLength ? (
          <InputAdornment position="end">
            <div style={{ fontSize: '0.75rem', color: '#666' }}>Typing...</div>
          </InputAdornment>
        ) : null,
      }}
    />
  );
};

export default SearchInput;