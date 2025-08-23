// frontend/src/pages/FinanceiroPage.js - VERSÃO FINALÍSSIMA COM URL DE EXPORTAÇÃO CORRIGIDA

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
// ... todas as suas outras importações ...
import {
    Typography, Container, Paper, Box, Button, Tabs, Tab,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    IconButton, Select, MenuItem, FormControl, InputLabel, CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

function FinanceiroPage() {
    // ... todo o seu código de state e outras funções permanece o mesmo ...
    const [abaAtual, setAbaAtual] = useState(0);
    const [categorias, setCategorias] = useState([]);
    const [carregandoCategorias, setCarregandoCategorias] = useState(true);
    const [dialogCategoriaAberto, setDialogCategoriaAberto] = useState(false);
    const [modoEdicaoCategoria, setModoEdicaoCategoria] = useState(false);
    const [categoriaForm, setCategoriaForm] = useState({ nome: '', descricao: '', tipo: 'Despesa' });
    const [idCategoriaEdit, setIdCategoriaEdit] = useState(null);
    const [centrosDeCusto, setCentrosDeCusto] = useState([]);
    const [carregandoCentros, setCarregandoCentros] = useState(true);
    const [dialogCentroAberto, setDialogCentroAberto] = useState(false);
    const [modoEdicaoCentro, setModoEdicaoCentro] = useState(false);
    const [centroForm, setCentroForm] = useState({ nome: '', descricao: '' });
    const [idCentroEdit, setIdCentroEdit] = useState(null);
    const [lancamentos, setLancamentos] = useState([]);
    const [carregandoLancamentos, setCarregandoLancamentos] = useState(true);
    const [dialogLancamentoAberto, setDialogLancamentoAberto] = useState(false);
    const [modoEdicaoLancamento, setModoEdicaoLancamento] = useState(false);
    const [lancamentoForm, setLancamentoForm] = useState({
        descricao: '', valor: '', tipo: 'Despesa', status_pagamento: 'Pendente',
        data_lancamento: '', data_competencia: '', categoria: '', centro_de_custo: ''
    });
    const [idLancamentoEdit, setIdLancamentoEdit] = useState(null);

    const handleTabChange = (event, newValue) => { setAbaAtual(newValue); };
    const buscarCategorias = useCallback(async () => { /* ...código sem alteração... */ 
        setCarregandoCategorias(true);
        try { const resposta = await api.get('/api/categorias/'); setCategorias(resposta.data); } catch (erro) { console.error("Erro ao buscar categorias:", erro); } finally { setCarregandoCategorias(false); }
    }, []);
    const buscarCentrosDeCusto = useCallback(async () => { /* ...código sem alteração... */ 
        setCarregandoCentros(true);
        try { const resposta = await api.get('/api/centros-de-custo/'); setCentrosDeCusto(resposta.data); } catch (erro) { console.error("Erro ao buscar centros de custo:", erro); } finally { setCarregandoCentros(false); }
    }, []);
    const buscarLancamentos = useCallback(async () => { /* ...código sem alteração... */ 
        setCarregandoLancamentos(true);
        try { const resposta = await api.get('/api/lancamentos/'); setLancamentos(resposta.data); } catch (erro) { console.error("Erro ao buscar lançamentos:", erro); } finally { setCarregandoLancamentos(false); }
    }, []);
    useEffect(() => { /* ...código sem alteração... */ 
        if (abaAtual === 0) { buscarLancamentos(); }
        if (abaAtual === 1) { buscarCategorias(); }
        if (abaAtual === 2) { buscarCentrosDeCusto(); }
    }, [abaAtual, buscarLancamentos, buscarCategorias, buscarCentrosDeCusto]);
    const handleAbrirDialogCategoria = (categoria = null) => { /* ...código sem alteração... */ 
        if (categoria) { setModoEdicaoCategoria(true); setIdCategoriaEdit(categoria.id); setCategoriaForm({ nome: categoria.nome, descricao: categoria.descricao, tipo: categoria.tipo }); } else { setModoEdicaoCategoria(false); setCategoriaForm({ nome: '', descricao: '', tipo: 'Despesa' }); }
        setDialogCategoriaAberto(true);
    };
    const handleFecharDialogCategoria = () => setDialogCategoriaAberto(false);
    const handleInputChangeCategoria = (e) => setCategoriaForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    const handleSalvarCategoria = async () => { /* ...código sem alteração... */ 
        try { if (modoEdicaoCategoria) { await api.put(`/api/categorias/${idCategoriaEdit}/`, categoriaForm); } else { await api.post('/api/categorias/', categoriaForm); } handleFecharDialogCategoria(); buscarCategorias(); } catch (erro) { console.error("Erro ao salvar categoria:", erro.response?.data || erro); alert("Erro ao salvar categoria."); }
    };
    const handleAbrirDialogCentro = (centro = null) => { /* ...código sem alteração... */ 
        if (centro) { setModoEdicaoCentro(true); setIdCentroEdit(centro.id); setCentroForm({ nome: centro.nome, descricao: centro.descricao }); } else { setModoEdicaoCentro(false); setCentroForm({ nome: '', descricao: '' }); }
        setDialogCentroAberto(true);
    };
    const handleFecharDialogCentro = () => setDialogCentroAberto(false);
    const handleInputChangeCentro = (e) => setCentroForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    const handleSalvarCentro = async () => { /* ...código sem alteração... */ 
        try { if (modoEdicaoCentro) { await api.put(`/api/centros-de-custo/${idCentroEdit}/`, centroForm); } else { await api.post('/api/centros-de-custo/', centroForm); } handleFecharDialogCentro(); buscarCentrosDeCusto(); } catch (erro) { console.error("Erro ao salvar centro de custo:", erro.response?.data || erro); alert("Erro ao salvar centro de custo."); }
    };
    const handleAbrirDialogLancamento = async (lancamento = null) => { /* ...código sem alteração... */ 
        await Promise.all([buscarCategorias(), buscarCentrosDeCusto()]);
        if (lancamento) { setModoEdicaoLancamento(true); setIdLancamentoEdit(lancamento.id); setLancamentoForm({ descricao: lancamento.descricao, valor: lancamento.valor, tipo: lancamento.tipo, status_pagamento: lancamento.status_pagamento, data_lancamento: lancamento.data_lancamento, data_competencia: lancamento.data_competencia, categoria: lancamento.categoria || '', centro_de_custo: lancamento.centro_de_custo || '' }); } else { setModoEdicaoLancamento(false); setLancamentoForm({ descricao: '', valor: '', tipo: 'Despesa', status_pagamento: 'Pendente', data_lancamento: new Date().toISOString().split('T')[0], data_competencia: new Date().toISOString().split('T')[0], categoria: '', centro_de_custo: '' }); }
        setDialogLancamentoAberto(true);
    };
    const handleFecharDialogLancamento = () => setDialogLancamentoAberto(false);
    const handleInputChangeLancamento = (e) => setLancamentoForm(prevState => ({ ...prevState, [e.target.name]: e.target.value }));
    const handleSalvarLancamento = async () => { /* ...código sem alteração... */ 
        try { let valorFormatado = String(lancamentoForm.valor); valorFormatado = valorFormatado.replace(/\./g, ''); valorFormatado = valorFormatado.replace(',', '.'); const payload = { ...lancamentoForm, valor: parseFloat(valorFormatado) }; if (!payload.categoria) delete payload.categoria; if (!payload.centro_de_custo) delete payload.centro_de_custo; if (modoEdicaoLancamento) { await api.put(`/api/lancamentos/${idLancamentoEdit}/`, payload); } else { await api.post('/api/lancamentos/', payload); } handleFecharDialogLancamento(); buscarLancamentos(); } catch (erro) { console.error("Erro ao salvar lançamento:", erro.response?.data || erro); alert("Erro ao salvar lançamento. Verifique se todos os campos obrigatórios estão preenchidos corretamente."); }
    };

    const handleExportCSV = () => {
        // ### AQUI ESTÁ A CORREÇÃO FINAL ###
        // Vamos remover o '/financeiro' do caminho, pois o router principal
        // do seu projeto provavelmente já lida com isso.
        const url = `${process.env.REACT_APP_API_URL}/api/lancamentos/export/csv/`;
        
        window.open(url, '_blank');
    };

    return (
        <Container maxWidth="xl">
            {/* ... todo o seu código JSX permanece o mesmo ... */}
            <Typography variant="h4" sx={{ mb: 4 }}>Controle Financeiro</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={abaAtual} onChange={handleTabChange}><Tab label="Lançamentos" /><Tab label="Categorias" /><Tab label="Centros de Custo" /></Tabs>
            </Box>
            {abaAtual === 0 && (
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Lançamentos Financeiros</Typography>
                        <Box>
                            <Button variant="contained" onClick={() => handleAbrirDialogLancamento()} sx={{ mr: 2 }}>Novo Lançamento</Button>
                            <Button variant="outlined" onClick={handleExportCSV}>Exportar CSV</Button>
                        </Box>
                    </Box>
                    <TableContainer><Table size="small"><TableHead><TableRow><TableCell>Descrição</TableCell><TableCell>Valor</TableCell><TableCell>Tipo</TableCell><TableCell>Categoria</TableCell><TableCell>Centro de Custo</TableCell><TableCell>Data Lanç.</TableCell><TableCell>Status</TableCell><TableCell>Ações</TableCell></TableRow></TableHead>
                        <TableBody>
                            {carregandoLancamentos ? (<TableRow><TableCell colSpan={8} align="center"><CircularProgress /></TableCell></TableRow>) : (
                                lancamentos.map(lanc => (
                                    <TableRow key={lanc.id}>
                                        <TableCell>{lanc.descricao}</TableCell><TableCell>R$ {parseFloat(lanc.valor).toFixed(2)}</TableCell><TableCell>{lanc.tipo}</TableCell><TableCell>{lanc.categoria_nome}</TableCell><TableCell>{lanc.centro_de_custo_nome}</TableCell><TableCell>{new Date(lanc.data_lancamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell><TableCell>{lanc.status_pagamento}</TableCell>
                                        <TableCell><IconButton size="small" color="primary" onClick={() => handleAbrirDialogLancamento(lanc)}><EditIcon /></IconButton></TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table></TableContainer>
                </Paper>
            )}
            {abaAtual === 1 && ( /* ...código JSX sem alteração... */
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Gerir Categorias</Typography>
                        <Button variant="contained" onClick={() => handleAbrirDialogCategoria()}>Nova Categoria</Button>
                    </Box>
                    <TableContainer><Table><TableHead><TableRow><TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell></TableRow></TableHead>
                        <TableBody>
                            {carregandoCategorias ? (<TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>) : (
                                categorias.map(cat => (
                                    <TableRow key={cat.id}><TableCell>{cat.nome}</TableCell><TableCell>{cat.tipo}</TableCell><TableCell>{cat.descricao}</TableCell><TableCell><IconButton color="primary" onClick={() => handleAbrirDialogCategoria(cat)}><EditIcon /></IconButton></TableCell></TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table></TableContainer>
                </Paper>
            )}
            {abaAtual === 2 && ( /* ...código JSX sem alteração... */
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Gerir Centros de Custo</Typography>
                        <Button variant="contained" onClick={() => handleAbrirDialogCentro()}>Novo Centro de Custo</Button>
                    </Box>
                    <TableContainer><Table><TableHead><TableRow><TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell></TableRow></TableHead>
                        <TableBody>
                            {carregandoCentros ? (<TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>) : (
                                centrosDeCusto.map(cen => (
                                    <TableRow key={cen.id}><TableCell>{cen.nome}</TableCell><TableCell>{cen.descricao}</TableCell><TableCell><IconButton color="primary" onClick={() => handleAbrirDialogCentro(cen)}><EditIcon /></IconButton></TableCell></TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table></TableContainer>
                </Paper>
            )}
            <Dialog open={dialogLancamentoAberto} onClose={handleFecharDialogLancamento} fullWidth maxWidth="sm">
                <DialogTitle>{modoEdicaoLancamento ? 'Editar Lançamento' : 'Novo Lançamento'}</DialogTitle>
                <DialogContent>
                    <TextField name="descricao" label="Descrição" value={lancamentoForm.descricao} fullWidth margin="dense" required onChange={handleInputChangeLancamento} />
                    <TextField name="valor" label="Valor (R$)" value={lancamentoForm.valor} type="text" fullWidth margin="dense" required onChange={handleInputChangeLancamento} />
                    <FormControl fullWidth margin="dense" required><InputLabel>Tipo</InputLabel><Select name="tipo" value={lancamentoForm.tipo} label="Tipo" onChange={handleInputChangeLancamento}><MenuItem value="Receita">Receita</MenuItem><MenuItem value="Despesa">Despesa</MenuItem></Select></FormControl>
                    <FormControl fullWidth margin="dense"><InputLabel>Categoria</InputLabel><Select name="categoria" value={lancamentoForm.categoria} label="Categoria" onChange={handleInputChangeLancamento}>{categorias.filter(c => c.tipo === lancamentoForm.tipo).map(cat => (<MenuItem key={cat.id} value={cat.id}>{cat.nome}</MenuItem>))}</Select></FormControl>
                    <FormControl fullWidth margin="dense"><InputLabel>Centro de Custo</InputLabel><Select name="centro_de_custo" value={lancamentoForm.centro_de_custo} label="Centro de Custo" onChange={handleInputChangeLancamento}>{centrosDeCusto.map(cen => (<MenuItem key={cen.id} value={cen.id}>{cen.nome}</MenuItem>))}</Select></FormControl>
                    <TextField name="data_lancamento" label="Data do Lançamento" value={lancamentoForm.data_lancamento} type="date" fullWidth margin="dense" required onChange={handleInputChangeLancamento} InputLabelProps={{ shrink: true }} />
                    <TextField name="data_competencia" label="Data de Competência" value={lancamentoForm.data_competencia} type="date" fullWidth margin="dense" required onChange={handleInputChangeLancamento} InputLabelProps={{ shrink: true }} />
                    <FormControl fullWidth margin="dense" required><InputLabel>Status</InputLabel><Select name="status_pagamento" value={lancamentoForm.status_pagamento} label="Status" onChange={handleInputChangeLancamento}><MenuItem value="Pendente">Pendente</MenuItem><MenuItem value="Pago">Pago</MenuItem><MenuItem value="Atrasado">Atrasado</MenuItem><MenuItem value="Cancelado">Cancelado</MenuItem></Select></FormControl>
                </DialogContent>
                <DialogActions><Button onClick={handleFecharDialogLancamento}>Cancelar</Button><Button onClick={handleSalvarLancamento} variant="contained">Salvar</Button></DialogActions>
            </Dialog>
            <Dialog open={dialogCategoriaAberto} onClose={handleFecharDialogCategoria}>
                <DialogTitle>{modoEdicaoCategoria ? 'Editar Categoria' : 'Nova Categoria'}</DialogTitle>
                <DialogContent>
                    <TextField name="nome" label="Nome da Categoria" value={categoriaForm.nome} fullWidth margin="dense" required onChange={handleInputChangeCategoria} />
                    <FormControl fullWidth margin="dense" required><InputLabel>Tipo</InputLabel><Select name="tipo" value={categoriaForm.tipo} label="Tipo" onChange={handleInputChangeCategoria}><MenuItem value="Receita">Receita</MenuItem><MenuItem value="Despesa">Despesa</MenuItem></Select></FormControl>
                    <TextField name="descricao" label="Descrição" value={categoriaForm.descricao} fullWidth margin="dense" multiline rows={3} onChange={handleInputChangeCategoria} />
                </DialogContent>
                <DialogActions><Button onClick={handleFecharDialogCategoria}>Cancelar</Button><Button onClick={handleSalvarCategoria} variant="contained">Salvar</Button></DialogActions>
            </Dialog>
            <Dialog open={dialogCentroAberto} onClose={handleFecharDialogCentro}>
                <DialogTitle>{modoEdicaoCentro ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}</DialogTitle>
                <DialogContent>
                    <TextField name="nome" label="Nome do Centro de Custo" value={centroForm.nome} fullWidth margin="dense" required onChange={handleInputChangeCentro} />
                    <TextField name="descricao" label="Descrição" value={centroForm.descricao} fullWidth margin="dense" multiline rows={3} onChange={handleInputChangeCentro} />
                </DialogContent>
                <DialogActions><Button onClick={handleFecharDialogCentro}>Cancelar</Button><Button onClick={handleSalvarCentro} variant="contained">Salvar</Button></DialogActions>
            </Dialog>
        </Container>
    );
}

export default FinanceiroPage;