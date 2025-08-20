// frontend/src/App.js - VERSÃO FINAL COM TEMA E MODO ESCURO

import React, { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box, IconButton } from '@mui/material';
import { lightTheme, darkTheme } from './theme'; // 1. Importamos nossos temas
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Ícone da lua (modo escuro)
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Ícone do sol (modo claro)

// Importação das suas páginas e componentes
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import MaquinarioPage from './pages/MaquinarioPage';
import DashboardPage from './pages/DashboardPage';
import FuncionariosPage from './pages/FuncionariosPage';
import RotaProtegida from './components/RotaProtegida';
import Layout from './components/Layout';
import EstoquePage from './pages/EstoquePage';
import FinanceiroPage from './pages/FinanceiroPage';

// Removi uma chamada 'fetch' que estava solta aqui, 
// pois chamadas de API devem ser feitas dentro dos componentes.

function App() {
  // 2. Criamos um estado para controlar se o modo escuro está ativo
  const [darkMode, setDarkMode] = useState(false);

  // 3. Criamos o tema atual com base no estado (claro ou escuro)
  // useMemo garante que o tema só seja recalculado quando o darkMode mudar.
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

  return (
    // 4. O ThemeProvider aplica o tema a toda a aplicação abaixo dele
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Garante um estilo base consistente */}
      
      {/* 5. Este Box principal permite que o fundo da página mude de cor */}
      <Box sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        width: '100%'
      }}>
        <BrowserRouter>
          {/* 6. BOTÃO PARA TROCAR O TEMA 
            Idealmente, este botão ficaria dentro do seu componente `Layout.js` (ex: no cabeçalho).
            Coloquei ele aqui por enquanto para você ver a funcionalidade.
          */}
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <IconButton onClick={() => setDarkMode(!darkMode)} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />
            
            {/* Suas rotas protegidas que usam o Layout principal */}
            <Route path="/" element={<RotaProtegida><Layout /></RotaProtegida>}>
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