// frontend/src/theme.js

import { createTheme } from '@mui/material/styles';

// --- TEMA CLARO (LIGHT MODE) ---
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Um azul profissional e clássico do Material Design
    },
    secondary: {
      main: '#2a9d8f', // Um verde-água vibrante para contraste e ações
    },
    background: {
      default: '#f4f6f8', // Um cinza bem claro para o fundo da página
      paper: '#ffffff',   // O fundo dos "cartões" (Paper) será branco puro
    },
    text: {
      primary: '#333333', // Cor de texto principal um pouco mais suave que o preto puro
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700, // Títulos mais fortes
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
        fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 16, // Cantos levemente arredondados para um visual mais moderno
  },
  components: {
    // Estilização padrão para todos os Paper (cartões)
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', // Sombra padrão mais suave
        },
      },
    },
    // Estilização padrão para todos os botões
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none', // Botões sem o texto todo em maiúsculo
                fontWeight: 'bold',
            }
        }
    }
  },
});

// --- TEMA ESCURO (DARK MODE) ---
export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#90caf9', // Azul claro para contraste no escuro
      },
      secondary: {
        main: '#80cbc4', // Verde-água claro
      },
      background: {
        default: '#121212', // Fundo padrão do Material Design para modo escuro
        paper: '#1e1e1e',   // Fundo dos cartões um pouco mais claro
      },
    },
    // Podemos herdar as outras configurações (typography, shape, etc.) do tema claro
    // ou definir novas aqui se quisermos.
    ...lightTheme, // Herda as configurações do lightTheme
    palette: { // ...e então sobrescreve a paleta
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#80cbc4' },
        background: { default: '#121212', paper: '#1e1e1e' },
        text: { primary: '#ffffff', secondary: '#bbbbbb' },
    },
  });