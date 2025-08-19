// frontend/src/pages/MaquinarioPage.js - VERSÃO CORRIGIDA E OTIMIZADA

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api'; // << Usamos nosso cliente API centralizado
import {
    Typography, Container, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, CircularProgress, Box, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// A URL fixa e a função getToken não são mais necessárias!

function MaquinarioPage() {
    const [maquinas, setMaquinas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [dialogAberto, setDialogAberto] = useState(false);
    const [error, setError] = useState('');
    const [modoEdicao, setModoEdicao] = useState(false);
    const [idMaquinaEdit, setIdMaquinaEdit] = useState(null);
    const [dialogApagarAberto, setDialogApagarAberto] = useState(false);
    const [idMaquinaApagar, setIdMaquinaApagar] = useState(null);

    const [formState, setFormState] = useState({
        nome: '', identificador: '', descricao: ''
    });

    const buscarMaquinas = useCallback(async () => {
        setCarregando(true);
        try {
            // Chamada de LEITURA (GET) simplificada
            const resposta = await api.get('/api/maquinario/');
            setMaquinas(resposta.data);
        } catch (erro) {
            console.error("Erro ao buscar máquinas:", erro);
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => {
        buscarMaquinas();
    }, [buscarMaquinas]);

    const handleAbrirDialogCriar = () => {
        setModoEdicao(false);
        setFormState({ nome: '', identificador: '', descricao: '' });
        setDialogAberto(true);
    };

    const handleFecharDialog = () => {
        setDialogAberto(false);
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSalvar = async () => {
        setError('');
        try {
            if (modoEdicao) {
                // Chamada de ATUALIZAÇÃO (PUT) simplificada
                await api.put(`/api/maquinario/${idMaquinaEdit}/`, formState);
            } else {
                // Chamada de CRIAÇÃO (POST) simplificada
                await api.post('/api/maquinario/', formState);
            }
            handleFecharDialog();
            buscarMaquinas();
        } catch (erro) {
            setError('Erro ao salvar. Verifique os dados, o identificador não pode ser repetido.');
            console.error("Erro ao salvar máquina:", erro.response?.data || erro);
        }
    };

    const handleEditarClick = (maquina) => {
        setModoEdicao(true);
        setIdMaquinaEdit(maquina.id);
        setFormState({
            nome: maquina.nome,
            identificador: maquina.identificador,
            descricao: maquina.descricao,
        });
        setDialogAberto(true);
    };

    const handleApagarClick = (id) => {
        setIdMaquinaApagar(id);
        setDialogApagarAberto(true);
    };

    const handleFecharDialogApagar = () => {
        setDialogApagarAberto(false);
        setIdMaquinaApagar(null);
    };

    const handleConfirmarApagar = async () => {
        try {
            // Chamada de DELEÇÃO (DELETE) simplificada
            await api.delete(`/api/maquinario/${idMaquinaApagar}/`);
            handleFecharDialogApagar();
            buscarMaquinas();
        } catch (erro) {
            console.error("Erro ao apagar máquina:", erro);
            alert("Ocorreu um erro ao apagar a máquina.");
        }
    };

    // O JSX para renderização permanece o mesmo.
    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4">Controle de Maquinário</Typography>
                <Button variant="contained" onClick={handleAbrirDialogCriar}>Adicionar Máquina</Button>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Identificador</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Descrição</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carregando ? (<TableRow><TableCell colSpan={4} align="center"><CircularProgress /></TableCell></TableRow>) : (
                            maquinas.map(maq => (
                                <TableRow key={maq.id}>
                                    <TableCell>{maq.nome}</TableCell>
                                    <TableCell>{maq.identificador}</TableCell>
                                    <TableCell>{maq.descricao}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditarClick(maq)}><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => handleApagarClick(maq.id)}><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogAberto} onClose={handleFecharDialog}>
                <DialogTitle>{modoEdicao ? 'Editar Máquina' : 'Adicionar Nova Máquina'}</DialogTitle>
                <DialogContent>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField name="nome" label="Nome da Máquina" value={formState.nome} fullWidth margin="dense" required onChange={handleInputChange} />
                    <TextField name="identificador" label="Identificador" value={formState.identificador} fullWidth margin="dense" required onChange={handleInputChange} />
                    <TextField name="descricao" label="Descrição" value={formState.descricao} fullWidth margin="dense" multiline rows={3} onChange={handleInputChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharDialog}>Cancelar</Button>
                    <Button onClick={handleSalvar} variant="contained">Salvar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogApagarAberto} onClose={handleFecharDialogApagar}>
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent><Typography>Tem a certeza que deseja apagar esta máquina?</Typography></DialogContent>
                <DialogActions>
                    <Button onClick={handleFecharDialogApagar}>Cancelar</Button>
                    <Button onClick={handleConfirmarApagar} color="error" variant="contained">Confirmar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default MaquinarioPage;