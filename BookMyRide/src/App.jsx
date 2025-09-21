import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import './App.css';
import bg from './assets/background-BookMyRide.png';
import Registration from './Components/Register/Register';
import UserView from './Components/Admin/UserView/UserView';
import BusTypeView from './Components/Admin/BusView/BusTypeView';
import BusView from './Components/Admin/Bus/BusView';
import RoutesView from './Components/Admin/Routes/RoutesView';

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
        <Route
          path="/bus-type"
          element={
            <div>
              <BusTypeView />
            </div>
          }
        />
        <Route
          path="/bus"
          element={
            <div>
              <BusView />
            </div>
          }
        />
        <Route
          path="/routes"
          element={
            <div>
              <RoutesView />
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
