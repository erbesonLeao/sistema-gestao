// frontend/src/pages/EstoquePage.js - VERSÃO FINAL COM CRUD COMPLETO

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Typography, Container, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Box, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_ESTOQUE_URL = 'http://127.0.0.1:8001/api/produtos/';

function EstoquePage() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [error, setError] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idProdutoEdit, setIdProdutoEdit] = useState(null);
  const [dialogApagarAberto, setDialogApagarAberto] = useState(false);
  const [idProdutoApagar, setIdProdutoApagar] = useState(null);

  const [formState, setFormState] = useState({
    nome: '',
    descricao: '',
    quantidade_em_estoque: 0,
    unidade_medida: 'unidade',
    ponto_de_ressuprimento: 0,
  });

  const getToken = () => localStorage.getItem('accessToken');

  const buscarProdutos = useCallback(async () => {
    setCarregando(true);
    try {
      const token = getToken();
      if (!token) return;
      const resposta = await axios.get(API_ESTOQUE_URL, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProdutos(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar produtos:", erro);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    buscarProdutos();
  }, [buscarProdutos]);

  const handleAbrirDialogCriar = () => {
    setModoEdicao(false);
    setFormState({ nome: '', descricao: '', quantidade_em_estoque: 0, unidade_medida: 'unidade', ponto_de_ressuprimento: 0 });
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
      const token = getToken();
      if (!token) return;

      const payload = {
        ...formState,
        quantidade_em_estoque: parseInt(formState.quantidade_em_estoque, 10) || 0,
        ponto_de_ressuprimento: parseInt(formState.ponto_de_ressuprimento, 10) || 0,
      };

      if (modoEdicao) {
        await axios.put(`${API_ESTOQUE_URL}${idProdutoEdit}/`, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post(API_ESTOQUE_URL, payload, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      handleFecharDialog();
      buscarProdutos();
    } catch (erro) {
      setError('Erro ao salvar. Verifique se o nome do produto não é repetido.');
      console.error("Erro ao salvar produto:", erro.response?.data || erro);
    }
  };

  const handleEditarClick = (produto) => {
    setModoEdicao(true);
    setIdProdutoEdit(produto.id);
    setFormState({
        nome: produto.nome,
        descricao: produto.descricao,
        quantidade_em_estoque: produto.quantidade_em_estoque,
        unidade_medida: produto.unidade_medida,
        ponto_de_ressuprimento: produto.ponto_de_ressuprimento,
    });
    setDialogAberto(true);
  };

  const handleApagarClick = (id) => {
    setIdProdutoApagar(id);
    setDialogApagarAberto(true);
  };

  const handleFecharDialogApagar = () => {
    setDialogApagarAberto(false);
    setIdProdutoApagar(null);
  };

  const handleConfirmarApagar = async () => {
    try {
      const token = getToken();
      if (!token) return;
      await axios.delete(`${API_ESTOQUE_URL}${idProdutoApagar}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      handleFecharDialogApagar();
      buscarProdutos();
    } catch (erro) {
      console.error("Erro ao apagar produto:", erro);
      alert("Ocorreu um erro ao apagar o produto.");
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Controle de Estoque</Typography>
        <Button variant="contained" onClick={handleAbrirDialogCriar}>Adicionar Produto</Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome do Produto</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Unidade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ponto de Ressuprimento</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {carregando ? (<TableRow><TableCell colSpan={5} align="center"><CircularProgress /></TableCell></TableRow>) : (
              produtos.map(prod => (
                <TableRow key={prod.id}>
                  <TableCell>{prod.nome}</TableCell>
                  <TableCell>{prod.quantidade_em_estoque}</TableCell>
                  <TableCell>{prod.unidade_medida}</TableCell>
                  <TableCell>{prod.ponto_de_ressuprimento}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditarClick(prod)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleApagarClick(prod.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogAberto} onClose={handleFecharDialog}>
        <DialogTitle>{modoEdicao ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField name="nome" label="Nome do Produto" value={formState.nome} fullWidth margin="dense" required onChange={handleInputChange} />
          <TextField name="descricao" label="Descrição" value={formState.descricao} fullWidth margin="dense" multiline rows={3} onChange={handleInputChange} />
          <TextField name="quantidade_em_estoque" label="Quantidade em Estoque" value={formState.quantidade_em_estoque} type="number" fullWidth margin="dense" required onChange={handleInputChange} />
          <TextField name="unidade_medida" label="Unidade de Medida (ex: kg, l, un)" value={formState.unidade_medida} fullWidth margin="dense" required onChange={handleInputChange} />
          <TextField name="ponto_de_ressuprimento" label="Ponto de Ressuprimento" value={formState.ponto_de_ressuprimento} type="number" fullWidth margin="dense" required onChange={handleInputChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialog}>Cancelar</Button>
          <Button onClick={handleSalvar} variant="contained">Salvar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogApagarAberto} onClose={handleFecharDialogApagar}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent><Typography>Tem a certeza que deseja apagar este produto?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogApagar}>Cancelar</Button>
          <Button onClick={handleConfirmarApagar} color="error" variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EstoquePage;