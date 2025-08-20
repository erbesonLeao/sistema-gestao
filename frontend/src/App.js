// frontend/src/App.js - ATUALIZADO COM AUTHPROVIDER

import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AuthProvider } from './context/AuthContext'; // << IMPORTAMOS NOSSO PROVEDOR

import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import MaquinarioPage from './pages/MaquinarioPage';
import DashboardPage from './pages/DashboardPage';
import FuncionariosPage from './pages/FuncionariosPage';
import RotaProtegida from './components/RotaProtegida';
import Layout from './components/Layout';
import EstoquePage from './pages/EstoquePage';
import FinanceiroPage from './pages/FinanceiroPage';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh', width: '100%' }}>
        <BrowserRouter>
          {/* O botão de tema idealmente ficaria dentro do Layout, mas deixamos aqui por simplicidade */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1301 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            
            {/* ENVELOPAMOS AS ROTAS PROTEGIDAS COM O AUTHPROVIDER */}
            <Route path="/" element={<RotaProtegida><AuthProvider><Layout /></AuthProvider></RotaProtegida>}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="maquinario" element={<MaquinarioPage />} />
              <Route path="funcionarios" element={<FuncionariosPage />} />
              <Route path="estoque" element={<EstoquePage />} />
              <Route path='financeiro' element={<FinanceiroPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;