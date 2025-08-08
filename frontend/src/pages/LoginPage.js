import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, TextField, Button, Alert } from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (evento) => {
    evento.preventDefault();
    setError('');
    try {
      const resposta = await axios.post('http://127.0.0.1:8001/api/token/', {
        username: username,
        password: password,
      });
      localStorage.setItem('accessToken', resposta.data.access);
      navigate('/dashboard');
    } catch (err) {
      setError('Usuário ou senha inválidos. Tente novamente.');
      console.error('Falha no login:', err);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Acessar Sistema</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField margin="normal" required fullWidth label="Usuário" name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
          <Link to="/registro" style={{ textDecoration: 'none' }}>{"Não tem uma conta? Registre-se"}</Link>
        </Box>
      </Box>
    </Container>
  );
}
export default LoginPage;