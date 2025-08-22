// frontend/src/App.js - VERSÃO SIMPLIFICADA

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Apenas o AuthProvider é necessário

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
  return (
    // Envolvemos toda a aplicação com o BrowserRouter primeiro
    <BrowserRouter>
      {/* O AuthProvider agora gerencia o tema e os dados do usuário */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;