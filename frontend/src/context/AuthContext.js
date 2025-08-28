// frontend/src/context/AuthContext.js - VERSÃO FINAL COM NOTIFICAÇÕES

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../theme';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [notificacoes, setNotificacoes] = useState([]); // Estado para as notificações
    const navigate = useNavigate();
    const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

    const fetchUser = useCallback(async () => { /* ...código sem alteração... */
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await api.get('/api/users/me/');
                setUser(response.data);
            } catch (error) { console.error("Token inválido ou expirado, limpando...", error); localStorage.clear(); setUser(null); }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    // LÓGICA PARA BUSCAR NOTIFICAÇÕES
    const fetchNotificacoes = useCallback(async () => {
        try {
            const response = await api.get('/api/core/notificacoes/?lida=false');
            setNotificacoes(response.data);
        } catch (error) { console.error("Erro ao buscar notificações:", error); }
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotificacoes(); // Busca na primeira vez
            const interval = setInterval(fetchNotificacoes, 30000); // E depois a cada 30 segundos
            return () => clearInterval(interval); // Limpa o intervalo
        }
    }, [user, fetchNotificacoes]);

    const marcarNotificacoesComoLidas = async () => {
        try {
            await api.post('/api/core/notificacoes/marcar_todas_como_lidas/');
            fetchNotificacoes();
        } catch (error) { console.error("Erro ao marcar notificações como lidas:", error); }
    };

    const logout = () => { /* ...código sem alteração... */
        localStorage.clear();
        setUser(null);
        setNotificacoes([]);
        navigate('/login');
    };

    const toggleDarkMode = () => { setDarkMode(!darkMode); };

    const value = { user, isLoading, logout, darkMode, toggleDarkMode, notificacoes, marcarNotificacoesComoLidas };

    return (
        <AuthContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {!isLoading && children}
            </ThemeProvider>
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};