// frontend/src/components/RotaProtegida.js

import React from 'react';
import { Navigate } from 'react-router-dom';

// Este componente é o nosso "Segurança"
// Ele recebe 'children', que é a página que ele deve proteger
function RotaProtegida({ children }) {

  // 1. O segurança vai ao "bolso" do navegador (localStorage) e procura o crachá
  const token = localStorage.getItem('accessToken');

  // 2. Se não encontrou o crachá...
  if (!token) {
    // ...ele expulsa o usuário, mandando de volta para a página de login.
    return <Navigate to="/login" />;
  }

  // 3. Se encontrou o crachá, ele deixa a pessoa entrar.
  // 'children' aqui representa o componente da página que queremos mostrar (ex: MaquinarioPage)
  return children;
}

export default RotaProtegida;