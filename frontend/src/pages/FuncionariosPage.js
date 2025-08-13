// frontend/src/pages/FuncionariosPage.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Typography, Container, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
  IconButton, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_FUNCIONARIOS_URL = `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8001'}/api/funcionarios/`;

function FuncionariosPage() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [error, setError] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idFuncionarioEdit, setIdFuncionarioEdit] = useState(null);
  const [dialogApagarAberto, setDialogApagarAberto] = useState(false);
  const [idFuncionarioApagar, setIdFuncionarioApagar] = useState(null);
  const [formState, setFormState] = useState({
    nome_completo: '', cargo: '', data_admissao: '', status: 'Ativo',
    user: { username: '', password: '', password2: '' }
  });

  const getToken = () => localStorage.getItem('accessToken');

  const buscarFuncionarios = useCallback(async () => {
    setCarregando(true);
    try {
      const token = getToken();
      if (!token) return;
      const resposta = await axios.get(API_FUNCIONARIOS_URL, { headers: { 'Authorization': `Bearer ${token}` } });
      setFuncionarios(resposta.data);
    } catch (erro) { console.error("Erro ao buscar funcionários:", erro); }
    finally { setCarregando(false); }
  }, []);

  useEffect(() => {
    buscarFuncionarios();
  }, [buscarFuncionarios]);

  const handleAbrirDialogCriar = () => {
    setModoEdicao(false);
    setFormState({ nome_completo: '', cargo: '', data_admissao: '', status: 'Ativo', user: { username: '', password: '', password2: '' } });
    setDialogAberto(true);
  };

  const handleFecharDialog = () => {
    setDialogAberto(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username' || name === 'password' || name === 'password2') {
      setFormState(prevState => ({ ...prevState, user: { ...prevState.user, [name]: value } }));
    } else {
      setFormState(prevState => ({ ...prevState, [name]: value }));
    }
  };
  
  const handleSalvar = async () => {
    if (modoEdicao) {
      try {
        const token = getToken();
        if (!token) return;
        const payload = {
          nome_completo: formState.nome_completo, cargo: formState.cargo,
          data_admissao: formState.data_admissao, status: formState.status
        };
        await axios.put(`${API_FUNCIONARIOS_URL}${idFuncionarioEdit}/`, payload, { headers: { 'Authorization': `Bearer ${token}` } });
        handleFecharDialog();
        buscarFuncionarios();
      } catch (erro) {
        setError('Erro ao atualizar funcionário.');
        console.error("Erro ao atualizar funcionário:", erro.response?.data || erro);
      }
    } else {
      handleSalvarNovoFuncionario();
    }
  };

  const handleSalvarNovoFuncionario = async () => {
    setError('');
    if (formState.user.password !== formState.user.password2) {
      setError('As senhas para o novo usuário não coincidem.');
      return;
    }
    try {
      const token = getToken();
      if (!token) return;
      const payload = { ...formState };
      delete payload.user.password2;
      await axios.post(API_FUNCIONARIOS_URL, payload, { headers: { 'Authorization': `Bearer ${token}` } });
      handleFecharDialog();
      buscarFuncionarios();
    } catch (erro) {
      setError('Erro ao salvar. Verifique se o usuário já existe.');
      console.error("Erro ao salvar funcionário:", erro.response?.data || erro);
    }
  };

  const handleEditarClick = (funcionario) => {
    setModoEdicao(true);
    setIdFuncionarioEdit(funcionario.id);
    setFormState({
      nome_completo: funcionario.nome_completo, cargo: funcionario.cargo,
      data_admissao: funcionario.data_admissao, status: funcionario.status,
      user: { username: '', password: '', password2: '' }
    });
    setDialogAberto(true);
  };
  
  const handleApagarClick = (id) => {
    setIdFuncionarioApagar(id);
    setDialogApagarAberto(true);
  };

  const handleFecharDialogApagar = () => {
    setDialogApagarAberto(false);
    setIdFuncionarioApagar(null);
  };

  const handleConfirmarApagar = async () => {
    try {
      const token = getToken();
      if (!token) return;
      await axios.delete(`${API_FUNCIONARIOS_URL}${idFuncionarioApagar}/`, { headers: { 'Authorization': `Bearer ${token}` } });
      handleFecharDialogApagar();
      buscarFuncionarios();
    } catch (erro) {
      console.error("Erro ao apagar funcionário:", erro);
      alert("Ocorreu um erro ao apagar o funcionário.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Cadastro de Funcionários</Typography>
        <Button variant="contained" onClick={handleAbrirDialogCriar}>Adicionar Funcionário</Button>
      </Box>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome Completo</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Cargo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data de Admissão</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Usuário de Login</TableCell><TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carregando ? (<TableRow><TableCell colSpan={6} align="center"><CircularProgress /></TableCell></TableRow>) : (
              funcionarios.map(func => (
                <TableRow key={func.id}>
                  <TableCell>{func.nome_completo}</TableCell><TableCell>{func.cargo}</TableCell>
                  <TableCell>{new Date(func.data_admissao).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</TableCell><TableCell>{func.status}</TableCell>
                  <TableCell>{func.username_read}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditarClick(func)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleApagarClick(func.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={dialogAberto} onClose={handleFecharDialog}>
        <DialogTitle>{modoEdicao ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField name="nome_completo" label="Nome Completo" value={formState.nome_completo} fullWidth margin="dense" required onChange={handleInputChange} />
          <TextField name="cargo" label="Cargo" value={formState.cargo} fullWidth margin="dense" required onChange={handleInputChange} />
          <TextField name="data_admissao" label="Data de Admissão" value={formState.data_admissao} type="date" fullWidth margin="dense" required onChange={handleInputChange} InputLabelProps={{ shrink: true }} />
          <FormControl fullWidth margin="dense" required><InputLabel>Status</InputLabel><Select name="status" value={formState.status} label="Status" onChange={handleInputChange}><MenuItem value="Ativo">Ativo</MenuItem><MenuItem value="Férias">Férias</MenuItem><MenuItem value="Demitido">Demitido</MenuItem></Select></FormControl>
          {!modoEdicao && (<>
              <hr style={{margin: '10px 0'}} /><Typography variant="subtitle1">Dados de Login do Novo Funcionário</Typography>
              <TextField name="username" label="Nome de Usuário" fullWidth margin="dense" required onChange={handleInputChange} />
              <TextField name="password" label="Senha" type="password" fullWidth margin="dense" required onChange={handleInputChange} />
              <TextField name="password2" label="Repetir Senha" type="password" fullWidth margin="dense" required onChange={handleInputChange} />
          </>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>Cancelar</Button><Button onClick={handleSalvar} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogApagarAberto} onClose={handleFecharDialogApagar}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><Typography>Tem a certeza que deseja apagar este funcionário? Esta ação não pode ser desfeita.</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogApagar}>Cancelar</Button><Button onClick={handleConfirmarApagar} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
export default FuncionariosPage;