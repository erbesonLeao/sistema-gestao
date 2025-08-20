// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// 1. Criamos o Contexto
const AuthContext = createContext(null);

// 2. Criamos o Provedor (o componente que vai "prover" os dados)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const response = await api.get('/api/users/me/');
                setUser(response.data);
            } catch (error) {
                console.error("Token inválido ou expirado, limpando...", error);
                localStorage.clear(); // Limpa tokens inválidos
                setUser(null);
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const logout = () => {
        localStorage.clear(); // Limpa todos os tokens
        setUser(null);
        navigate('/login');
    };

    // O valor que será compartilhado com todos os componentes filhos
    const value = { user, isLoading, logout };

    // Só renderiza os filhos depois de verificar o usuário (evita "piscar" a tela)
    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// 3. Criamos um "hook" customizado para facilitar o uso do contexto
export const useAuth = () => {
    return useContext(AuthContext);
};