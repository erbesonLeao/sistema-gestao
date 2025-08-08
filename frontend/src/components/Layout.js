// frontend/src/components/Layout.js

// AQUI: Importamos useNavigate
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider 
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout'; // <-- AQUI: Importamos o ícone de Logout
import InventoryIcon from '@mui/icons-material/Inventory'; // icone do estoquer
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'; // icone de financas 

const drawerWidth = 240;

function Layout() {
  // AQUI: Inicializamos a ferramenta de navegação
  const navigate = useNavigate();

  // AQUI: Criamos a função de logout
  const handleLogout = () => {
    // 1. Apagamos o "crachá" do bolso do navegador
    localStorage.removeItem('accessToken');
    // 2. Redirecionamos o usuário para a página de login
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Gerenciador da Empresa
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard">
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/maquinario">
                <ListItemIcon>
                  <PrecisionManufacturingIcon />
                </ListItemIcon>
                <ListItemText primary="Maquinário" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/funcionarios">
                <ListItemIcon>
                  <GroupIcon />
                </ListItemIcon>
                <ListItemText primary="Funcionários" />
              </ListItemButton>
            </ListItem>
          </List>
          <ListItemButton component={Link} to="/estoque">
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Estoque" />
          </ListItemButton>
          <ListItemButton component={Link} to="/financeiro">
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            <ListItemText primary="Financeiro" />
          </ListItemButton>
          
          <Divider /> {/* Uma linha para separar as seções do menu */}

          {/* AQUI: Adicionamos o novo item de menu para "Sair" */}
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Sair" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
export default Layout;