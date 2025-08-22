// frontend/src/components/Layout.js - VERSÃO FINAL COM BOTÃO DE TEMA FIXO

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Avatar, Menu, MenuItem, IconButton, Tooltip
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const drawerWidth = 240;

function Layout() {
  const { user, logout, darkMode, toggleDarkMode } = useAuth(); // Pegamos também o darkMode e a função toggle
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
          
          {/* Caixa para alinhar os ícones da direita */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* 1. BOTÃO DE TROCA DE TEMA NOVO E FIXO */}
            <Tooltip title={darkMode ? "Modo Claro" : "Modo Escuro"}>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
            </Tooltip>

            {/* 2. MENU DO USUÁRIO, AGORA AO LADO DO BOTÃO DE TEMA */}
            {user && (
              <div>
                <Tooltip title="Opções da Conta">
                  <IconButton onClick={handleMenu} sx={{ p: 0, ml: 1 }}>
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
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }, }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding><ListItemButton component={Link} to="/dashboard"><ListItemIcon><DashboardIcon /></ListItemIcon><ListItemText primary="Dashboard" /></ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton component={Link} to="/maquinario"><ListItemIcon><PrecisionManufacturingIcon /></ListItemIcon><ListItemText primary="Maquinário" /></ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton component={Link} to="/funcionarios"><ListItemIcon><GroupIcon /></ListItemIcon><ListItemText primary="Funcionários" /></ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton component={Link} to="/estoque"><ListItemIcon><InventoryIcon /></ListItemIcon><ListItemText primary="Estoque" /></ListItemButton></ListItem>
            <ListItem disablePadding><ListItemButton component={Link} to="/financeiro"><ListItemIcon><MonetizationOnIcon /></ListItemIcon><ListItemText primary="Financeiro" /></ListItemButton></ListItem>
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