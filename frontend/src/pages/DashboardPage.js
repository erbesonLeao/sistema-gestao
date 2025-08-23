// frontend/src/pages/DashboardPage.js - VERSÃO FINAL COM FILTROS INTERATIVOS

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import {
    Typography, Container, Paper, Grid, Box, CircularProgress,
    List, ListItem, ListItemIcon, ListItemText, Divider, useTheme,
    TextField, Button // 1. Importamos componentes para o formulário de filtro
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import EventIcon from '@mui/icons-material/Event';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';


function DashboardPage() {
    const [dashboardData, setDashboardData] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [visible, setVisible] = useState(false);
    const theme = useTheme();

    // 2. Criamos estados para armazenar as datas do filtro
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');


    const COLORS = [
        theme.palette.primary.main, theme.palette.secondary.main, '#FFBB28', '#FF8042',
        theme.palette.primary.light, theme.palette.secondary.light
    ];

    // 3. A função de busca agora aceita as datas como parâmetros
    const buscarDadosDashboard = useCallback(async (inicio, fim) => {
        setCarregando(true);
        setVisible(false); // Esconde os dados para a animação de entrada
        try {
            // Montamos a URL com os parâmetros de data, se eles existirem
            let url = '/api/dashboard/summary/';
            if (inicio && fim) {
                url += `?data_inicio=${inicio}&data_fim=${fim}`;
            }
            
            const resposta = await api.get(url);
            setDashboardData(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar dados do dashboard:", erro);
        } finally {
            setCarregando(false);
        }
    }, []);

    // Busca os dados iniciais quando a página carrega
    useEffect(() => {
        buscarDadosDashboard();
    }, [buscarDadosDashboard]);

    useEffect(() => {
        if (!carregando) {
            const timer = setTimeout(() => setVisible(true), 100);
            return () => clearTimeout(timer);
        }
    }, [carregando]);

    // 4. Função que será chamada ao clicar no botão "Filtrar"
    const handleFiltrarClick = () => {
        buscarDadosDashboard(dataInicio, dataFim);
    };

    const SummaryCard = ({ title, value, color = 'text.primary' }) => ( /* ...código sem alteração... */
        <Paper 
            elevation={4}
            sx={{
                p: 2, textAlign: 'center', height: '100%', borderRadius: '16px',
                backdropFilter: 'blur(10px)',
                backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: theme.shadows[6],
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.05)', boxShadow: theme.shadows[12] }
            }}
        >
            <Typography variant="h6" color="text.secondary">{title}</Typography>
            <Typography variant="h4" color={color} sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Paper>
    );
    
    const EmptyState = ({ message, icon }) => ( /* ...código sem alteração... */
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'text.secondary' }}>
            {icon}
            <Typography sx={{ mt: 1 }}>{message}</Typography>
        </Box>
    );

    const getAvisoIcon = (aviso) => { /* ...código sem alteração... */
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

    const animationStyles = {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{...animationStyles, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4">Painel de Controle</Typography>
                {/* 5. AQUI ESTÃO OS CAMPOS DO FILTRO */}
                <Paper sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, backgroundColor: 'transparent' }} elevation={0}>
                    <TextField
                        label="Data de Início"
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <TextField
                        label="Data de Fim"
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        size="small"
                    />
                    <Button variant="contained" onClick={handleFiltrarClick}>
                        Filtrar
                    </Button>
                </Paper>
            </Box>

            {/* O Container principal agora tem a animação */}
            <Box sx={animationStyles}>
                <Grid container spacing={3}>
                    {/* ...o resto do seu JSX para os cards e gráficos permanece o mesmo... */}
                    <Grid item xs={12} sm={6} md={3}><SummaryCard title="Funcionários Ativos" value={dashboardData.summary_cards.total_funcionarios_ativos} /></Grid>
                    <Grid item xs={12} sm={6} md={3}><SummaryCard title="Total de Máquinas" value={dashboardData.summary_cards.total_maquinas} /></Grid>
                    <Grid item xs={12} sm={6} md={3}><SummaryCard title="Produtos em Estoque" value={dashboardData.summary_cards.total_produtos_estoque} /></Grid>
                    <Grid item xs={12} sm={6} md={3}><SummaryCard title="Saldo (Pago)" value={`R$ ${dashboardData.summary_cards.saldo_financeiro.toFixed(2)}`} color={dashboardData.summary_cards.saldo_financeiro >= 0 ? 'success.main' : 'error.main'} /></Grid>
                </Grid>
                
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
                            ) : ( <EmptyState message="Sem dados para exibir" icon={<PieChartIcon sx={{ fontSize: 40 }} />} /> )}
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
                                        <Bar dataKey="total" fill={theme.palette.secondary.main} name="Total Gasto" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : ( <EmptyState message="Sem despesas registadas" icon={<BarChartIcon sx={{ fontSize: 40 }} />} /> )}
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
            </Box>
        </Container>
    );
}

export default DashboardPage;