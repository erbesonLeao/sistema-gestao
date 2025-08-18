import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Container, Typography, Box, Alert } from '@mui/material';

// A URL base da API vem das variáveis de ambiente da Render.
const API_BASE_URL = process.env.REACT_APP_API_URL;

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
            // CORREÇÃO FINAL: O caminho correto, baseado no seu urls.py, é '/api/users/'.
            const endpoint = '/api/users/';
            
            // Construímos a URL completa para a requisição
            const fullApiUrl = `${API_BASE_URL}${endpoint}`;

            await axios.post(fullApiUrl, { username, password });
            
            // Se o registro for bem-sucedido, redireciona o usuário para a página de login.
            navigate('/login');

        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.username) {
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
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        label="Nome de Usuário" 
                        name="username" 
                        autoFocus 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password" 
                        label="Senha" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <TextField 
                        margin="normal" 
                        required 
                        fullWidth 
                        name="password2" 
                        label="Repetir Senha" 
                        type="password" 
                        value={password2} 
                        onChange={(e) => setPassword2(e.target.value)} 
                    />
                    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrar</Button>
                    <Link to="/login" style={{ textDecoration: 'none' }}>
                        {"Já tem uma conta? Faça o login"}
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default RegistroPage;