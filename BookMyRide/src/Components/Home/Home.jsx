import React, { useState, useEffect } from 'react';
import './Home.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  let isMenuEnabled = JSON.parse(localStorage.getItem('userDetails') || '{}')

  const location = useLocation();

  const showGlobalBg = location.pathname === '/' || location.pathname === '/home' ;

  const toggleDrawer = (value) => () => {
    setOpen(value);
  };
  
  const logout = () => {
    localStorage.removeItem('userDetails')
    navigate('/login')
  }

  const getHeaderText = () => {
  const path = location.pathname;

    switch (path) {
      case '/users':
        return 'Users';
      case '/bus-type':
        return 'Bus Types';
      case '/bus':
        return 'Buses';
      case '/routes':
        return 'Routes';
      case '/schedule':
        return 'Schedule';
      case '/book':
        return 'Book';
      case '/':
      case '/home':
        return 'Welcome to EasyBus';
      default:
        return 'Welcome to EasyBus';
    }
  };

  const menuItems = [
    { text: 'Users', path: '/users' },
    { text: 'Bus Types', path: '/bus-type' },
    { text: 'Buses', path: '/bus' },
    { text: 'Routes', path: '/routes' },
    { text: 'Schedule', path: '/schedule' },
    { text: 'Book', path: '/book' },
  ];

  const list = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography variant="h6" sx={{ p: 2 }} className=''>
        EasyBus
      </Typography>
      <Divider />
      <List>
        {menuItems.map(item => (
          <ListItem key={item.text} disablePadding className='home'>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }} className='home'>
      <AppBar position="static">
        <Toolbar>
          {isMenuEnabled && isMenuEnabled.email && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h3>{getHeaderText()}</h3>
          </Typography>

          {!isMenuEnabled?.email && (
            <>
              <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
              <Button color="inherit" onClick={() => navigate('/login')}>Log In</Button>
            </>
          )}
          {isMenuEnabled?.email && (
            <>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        {list}
      </Drawer>
    </Box>
  );
}

export default Home;
