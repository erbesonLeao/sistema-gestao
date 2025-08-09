// frontend/src/pages/DashboardPage.js - VERSÃO FINAL COM TODOS OS AJUSTES

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Typography, Container, Paper, Grid, Box, CircularProgress,
  List, ListItem, ListItemIcon, ListItemText, Divider // Importamos o Divider
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventIcon from '@mui/icons-material/Event';

const API_DASHBOARD_URL = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8001'}/api/dashboard/summary/`;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const getToken = () => localStorage.getItem('accessToken');

  const buscarDadosDashboard = useCallback(async () => {
    setCarregando(true);
    try {
      const token = getToken();
      if (!token) return;
      const resposta = await axios.get(API_DASHBOARD_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      setDashboardData(resposta.data);
    } catch (erro) { console.error("Erro ao buscar dados do dashboard:", erro); }
    finally { setCarregando(false); }
  }, []);

  useEffect(() => {
    buscarDadosDashboard();
  }, [buscarDadosDashboard]);

  // Componente para os cartões com bordas arredondadas
  const SummaryCard = ({ title, value, color = 'text.primary' }) => (
    <Paper elevation={3} sx={{ p: 2, textAlign: 'center', height: '100%', borderRadius: '16px' }}>
      <Typography variant="h6" color="text.secondary">{title}</Typography>
      <Typography variant="h4" color={color} sx={{ fontWeight: 'bold' }}>{value}</Typography>
    </Paper>
  );

  const getAvisoIcon = (aviso) => {
    if (aviso.includes('Aniversário de')) return <CakeIcon color="primary" />;
    if (aviso.includes('anos de empresa')) return <CelebrationIcon color="secondary" />;
    return <EventIcon color="action" />;
  };

  if (carregando) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  }
  if (!dashboardData) {
    return <Typography>Não foi possível carregar os dados do dashboard.</Typography>;
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 4 }}>Painel de Controlo</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Funcionários Ativos" value={dashboardData.summary_cards.total_funcionarios_ativos} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total de Máquinas" value={dashboardData.summary_cards.total_maquinas} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Produtos em Estoque" value={dashboardData.summary_cards.total_produtos_estoque} /></Grid>
        <Grid item xs={12} sm={6} md={3}><SummaryCard title="Saldo (Pago)" value={`R$ ${dashboardData.summary_cards.saldo_financeiro.toFixed(2)}`} color={dashboardData.summary_cards.saldo_financeiro >= 0 ? 'success.main' : 'error.main'} /></Grid>
      </Grid>
      
      {/* SOLUÇÃO PARA O ESPAÇAMENTO VERTICAL  */}
      <Divider sx={{ my: 4, border: 'none' }} /> 

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px' }}>
                <Typography variant="h6" gutterBottom>Funcionários por Status</Typography>
                {dashboardData.funcionarios_chart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                          <Pie data={dashboardData.funcionarios_chart} dataKey="total" nameKey="status" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}>
                          {dashboardData.funcionarios_chart.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                      </PieChart>
                  </ResponsiveContainer>
                ) : ( <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography>Sem dados para exibir</Typography></Box> )}
            </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={3} sx={{ p: 2, height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: '16px' }}>
                <Typography variant="h6" gutterBottom>Top 5 Despesas por Categoria</Typography>
                {dashboardData.despesas_chart.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dashboardData.despesas_chart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="categoria__nome" />
                          <YAxis />
                          <Tooltip formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`} />
                          <Legend />
                          <Bar dataKey="total" fill="#82ca9d" name="Total Gasto" />
                      </BarChart>
                  </ResponsiveContainer>
                ) : ( <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Typography>Sem despesas registadas</Typography></Box> )}
            </Paper>
        </Grid>
        <Grid item xs={12} lg={4}>
            <Paper elevation={3} sx={{ p: 2, height: '400px', overflow: 'auto', borderRadius: '16px' }}>
                <Typography variant="h6" gutterBottom>Mural de Avisos</Typography>
                <List>
                    {dashboardData.mural_de_avisos.map((aviso, index) => (
                        <ListItem key={index}>
                            <ListItemIcon>{getAvisoIcon(aviso)}</ListItemIcon>
                            <ListItemText primary={aviso} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;