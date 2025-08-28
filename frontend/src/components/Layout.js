// frontend/src/components/Layout.js - VERSÃO FINAL COM UI DE NOTIFICAÇÕES

import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, AppBar, Toolbar, Typography, Drawer, List, 
  ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
  Avatar, Menu, MenuItem, IconButton, Tooltip, Badge
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import NotificationsIcon from '@mui/icons-material/Notifications';
// ...outros imports de ícones...
import DashboardIcon from '@mui/icons-material/Dashboard';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import InventoryIcon from '@mui/icons-material/Inventory';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';


const drawerWidth = 240;

function Layout() {
  const { user, logout, darkMode, toggleDarkMode, notificacoes, marcarNotificacoesComoLidas } = useAuth(); 
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const isUserMenuOpen = Boolean(userAnchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);
  const navigate = useNavigate();

  const handleUserMenu = (event) => setUserAnchorEl(event.currentTarget);
  const handleUserMenuClose = () => setUserAnchorEl(null);

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    if (notificacoes.length > 0) {
        marcarNotificacoesComoLidas();
    }
  };
  const handleNotificationMenuClose = () => setNotificationAnchorEl(null);
  const handleLogout = () => { handleUserMenuClose(); logout(); };
  const handleNotificationClick = (link) => {
    handleNotificationMenuClose();
    if(link) { navigate(link); }
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>Gerenciador da Empresa</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={darkMode ? "Modo Claro" : "Modo Escuro"}>
              <IconButton onClick={toggleDarkMode} color="inherit"><mrow darkMode ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
            </Tooltip>
            <Tooltip title="Notificações">
              <IconButton color="inherit" onClick={handleNotificationMenu}>
                <Badge badgeContent={notificacoes.length} color="error"><NotificationsIcon /></Badge>
              </IconButton>
            </Tooltip>
            {user && (
              <div>
                <Tooltip title="Opções da Conta">
                  <IconButton onClick={handleUserMenu} sx={{ p: 0, ml: 1 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>{user.username.charAt(0).toUpperCase()}</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu sx={{ mt: '45px' }} anchorEl={userAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isUserMenuOpen} onClose={handleUserMenuClose}>
                  <Box sx={{ px: 2, py: 1, textAlign: 'center' }}>
                      <Typography variant="h6">{user.first_name || user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={handleLogout}><ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>Sair</MenuItem>
                </Menu>
              </div>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Menu sx={{ mt: '45px' }} anchorEl={notificationAnchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={isNotificationMenuOpen} onClose={handleNotificationMenuClose}>
        <Box sx={{ px: 2, py: 1 }}><Typography variant="h6">Notificações</Typography></Box>
        <Divider />
        {notificacoes.length > 0 ? (
            notificacoes.map((notificacao) => (
                <MenuItem key={notificacao.id} onClick={() => handleNotificationClick(notificacao.link)}>
                    <ListItemText primary={notificacao.mensagem} secondary={new Date(notificacao.data_criacao).toLocaleString('pt-BR')} />
                </MenuItem>
            ))
        ) : (
            <MenuItem disabled><ListItemText primary="Nenhuma notificação nova" /></MenuItem>
        )}
      </Menu>

      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' }, }}>
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