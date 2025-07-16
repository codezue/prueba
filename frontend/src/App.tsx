import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProviderWrapper } from './providers/QueryClientProvider';
import PokemonListPage from './pages/PokemonListPage';
import PokemonDetailPage from './pages/PokemonDetailPage';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProviderWrapper>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<PokemonListPage />} />
            <Route path="/pokemon/:idOrName" element={<PokemonDetailPage />} />
          </Routes>
        </Router>
      </QueryClientProviderWrapper>
    </ThemeProvider>
  );
};

export default App;
