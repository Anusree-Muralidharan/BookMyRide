import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import './App.css';
import bg from './assets/background-BookMyRide.png';
import Registration from './Components/Register/Register';
import UserView from './Components/Admin/UserView/UserView';

function AppContent() {
  const location = useLocation();

  const showGlobalBg = location.pathname === '/' || location.pathname === '/home' ;

  return (
    <div className="App">
      <Home />
      {showGlobalBg && (
        <img src={bg} alt="background" className="background" />
      )}
      <Routes>
        <Route
          path="/login"
          element={
            <div className="App-login">
              <img
                src={bg}
                alt="background-login"
                className="background-login"
              />
              <Login />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="App-login">
              <img
                src={bg}
                alt="background-login"
                className="background-login"
              />
              <Registration />
            </div>
          }
        />
        <Route
          path="/users"
          element={
            <div>
              <UserView />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
