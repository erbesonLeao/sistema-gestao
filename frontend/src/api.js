// frontend/src/api.js

import axios from 'axios';

// Cria uma "instância" do axios com configurações pré-definidas
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL // Usa a URL base do nosso backend na Render
});

// Este é o "interceptador". Ele age como um porteiro para todas as requisições.
// Antes de qualquer requisição sair, ele vai adicionar o token de autenticação.
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Se o token existir, adiciona o cabeçalho 'Authorization'
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Em caso de erro na configuração da requisição, rejeita a promessa
        return Promise.reject(error);
    }
);

export default api;