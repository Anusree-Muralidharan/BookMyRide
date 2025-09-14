import React from 'react'
import './Home.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); 
  return (
    <Box sx={{ flexGrow: 1 }} className='home'>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <h3>Welcome to BookMyRide</h3>
          </Typography>
          <Button color="inherit"  onClick={() => navigate('/register')}>Register</Button>
          <Button color="inherit"  onClick={() => navigate('/login')}>Log In</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Home
