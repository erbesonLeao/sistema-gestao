// frontend/src/api.js - VERSÃO FINAL COM RENOVAÇÃO DE TOKEN

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL
});

// Interceptador de REQUISIÇÕES (adiciona o token de acesso)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptador de RESPOSTAS (lida com tokens expirados)
api.interceptors.response.use(
    // Se a resposta for bem-sucedida, apenas a retorna
    (response) => response,
    // Se ocorrer um erro...
    async (error) => {
        const originalRequest = error.config;

        // Se o erro for 401 e não for uma tentativa de repetição
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Marca como uma tentativa de repetição

            try {
                // Pega o refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                
                // Pede um novo access token usando o refresh token
                const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
                    refresh: refreshToken
                });

                // Salva o novo access token
                localStorage.setItem('accessToken', response.data.access);

                // Tenta a requisição original novamente com o novo token
                return api(originalRequest);

            } catch (refreshError) {
                // Se o refresh token também falhar, desloga o usuário
                console.error("Refresh token inválido. Deslogando...", refreshError);
                localStorage.clear();
                window.location.href = '/login'; // Redireciona para a página de login
                return Promise.reject(refreshError);
            }
        }

        // Para qualquer outro erro, apenas o retorna
        return Promise.reject(error);
    }
);

export default api;