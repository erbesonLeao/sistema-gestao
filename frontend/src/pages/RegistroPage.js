import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

// Corrigido para o URL que definimos em urls.py
const API_REGISTRO_URL = 'http://127.0.0.1:8001/api/registro/';

function RegistroPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== password2) {
            setError('As senhas não coincidem.');
            return;
        }
        try {
            await axios.post(API_REGISTRO_URL, { username, password });
            navigate('/login');
        } catch (err) {
            if (err.response && err.response.data.username) {
                setError('Este nome de usuário já existe. Por favor, escolha outro.');
            } else {
                setError('Ocorreu um erro no registro. Tente novamente.');
            }
            console.error('Erro de registro:', err);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Criar Nova Conta de Usuário</Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField margin="normal" required fullWidth label="Nome de Usuário (para login)" name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
                    <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <TextField margin="normal" required fullWidth name="password2" label="Repetir Senha" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrar</Button>
                    <Link to="/login" style={{ textDecoration: 'none' }}>{"Já tem uma conta? Faça o login"}</Link>
                </Box>
            </Box>
        </Container>
    );
};
export default RegistroPage;