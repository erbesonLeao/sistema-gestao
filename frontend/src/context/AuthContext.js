// frontend/src/context/AuthContext.js - VERSÃO ATUALIZADA

import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material'; // Importamos o ThemeProvider
import { lightTheme, darkTheme } from '../theme'; // Importamos os temas
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false); // 1. O estado do tema agora vive aqui
    const navigate = useNavigate();

    const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode]);

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

    const logout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/login');
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // O valor compartilhado agora inclui o controle do tema
    const value = { user, isLoading, logout, darkMode, toggleDarkMode };

    return (
        <AuthContext.Provider value={value}>
            {/* 2. O ThemeProvider agora envolve os filhos do AuthProvider */}
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