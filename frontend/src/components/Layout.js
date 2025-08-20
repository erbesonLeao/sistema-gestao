// frontend/src/components/Layout.js - VERSÃO FINAL COM DADOS DO USUÁRIO

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // << Usamos nosso hook de autenticação
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Avatar, Menu, MenuItem, IconButton, Tooltip // Componentes para o menu do usuário
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const drawerWidth = 240;

function Layout() {
  const { user, logout } = useAuth(); // << Pegamos os dados do usuário e a função logout do contexto
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar o menu dropdown
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // A função de logout agora vem do nosso contexto centralizado
  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gerenciador da Empresa
          </Typography>
          
          {/* AQUI ESTÁ A NOVA SEÇÃO DO USUÁRIO */}
          {user && (
            <div>
              <Tooltip title="Opções da Conta">
                <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                  {/* O Avatar mostra a primeira letra do nome do usuário */}
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={open}
                onClose={handleClose}
              >
                <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                    <Typography variant="h6">{user.first_name || user.username}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                  Sair
                </MenuItem>
              </Menu>
            </div>
          )}
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
          {/* Mantemos os links do menu lateral, mas removemos o botão "Sair" daqui */}
          <List>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/dashboard"><ListItemIcon><DashboardIcon /></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/maquinario"><ListItemIcon><PrecisionManufacturingIcon /></ListItemIcon><ListItemText primary="Maquinário" /></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/funcionarios"><ListItemIcon><GroupIcon /></ListItemIcon><ListItemText primary="Funcionários" /></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/estoque"><ListItemIcon><InventoryIcon /></ListItemIcon><ListItemText primary="Estoque" /></ListItemButton>
            </ListItem>
            <ListItem disablePadding>
                <ListItemButton component={Link} to="/financeiro"><ListItemIcon><MonetizationOnIcon /></ListItemIcon><ListItemText primary="Financeiro" /></ListItemButton>
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