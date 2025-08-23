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
    const [notificacoes, setNotificacoes] = useState([]); // 1. Novo estado para guardar as notificações
    const navigate = useNavigate();

    const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

    // --- LÓGICA DE USUÁRIO (sem alteração) ---
    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await api.get('/api/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error("Token inválido ou expirado, limpando...", error);
                localStorage.clear();
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // --- 2. NOVA LÓGICA PARA BUSCAR NOTIFICAÇÕES ---
    const fetchNotificacoes = useCallback(async () => {
        try {
            // Buscamos apenas notificações não lidas
            const response = await api.get('/api/core/notificacoes/?lida=false');
            setNotificacoes(response.data);
        } catch (error) {
            console.error("Erro ao buscar notificações:", error);
        }
    }, []);

    // --- 3. O "RADAR" (POLLING) QUE VERIFICA AS NOTIFICAÇÕES ---
    useEffect(() => {
        // Só começa a verificar se o usuário está logado
        if (user) {
            fetchNotificacoes(); // Busca uma vez imediatamente
            
            // E então, cria um intervalo para verificar a cada 30 segundos
            const interval = setInterval(fetchNotificacoes, 30000); // 30000 ms = 30 segundos

            // Função de "limpeza": quando o componente for desmontado, o intervalo é limpo
            // Isso evita vazamentos de memória e chamadas desnecessárias da API
            return () => clearInterval(interval);
        }
    }, [user, fetchNotificacoes]); // Roda sempre que o usuário ou a função de busca mudar

    // --- 4. NOVA FUNÇÃO PARA MARCAR NOTIFICAÇÕES COMO LIDAS ---
    const marcarNotificacoesComoLidas = async () => {
        try {
            await api.post('/api/core/notificacoes/marcar_todas_como_lidas/');
            // Após marcar como lidas, atualizamos a lista (que agora estará vazia)
            fetchNotificacoes();
        } catch (error) {
            console.error("Erro ao marcar notificações como lidas:", error);
        }
    };


    const logout = () => {
        localStorage.clear();
        setUser(null);
        setNotificacoes([]); // Limpa as notificações ao sair
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // 5. O valor compartilhado agora inclui tudo sobre as notificações
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