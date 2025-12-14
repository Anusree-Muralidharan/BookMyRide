import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import './App.css';
import bg from './assets/background-BookMyRide.png';
import Registration from './Components/Register/Register';
import UserView from './Components/Admin/UserView/UserView';
import BusTypeView from './Components/Admin/BusTypeView/BusTypeView';
import BusView from './Components/Admin/BusView/BusView';
import RoutesView from './Components/Admin/Routes/RoutesView';
import ScheduleView from './Components/Admin/ScheduleView/ScheduleView';
import SeatBooking from './Components/Booking/BookSeat/BookSeat';
import UserPage from './Components/User/Userpage';
import Userlogin from './Components/User/Userlogin';
import Userpage from './Components/User/Userpage';
import Payment from './Components/Booking/Payment/Payment';
import Receipt from './Components/Booking/Receipt/Receipt';

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
      <Route
          path="/schedule"
          element={
            <div>
              <ScheduleView />
            </div>
          }
        />
        <Route
          path="/book"
          element={
            <div>
              <SeatBooking />
            </div>
          }
        />
         <Route path="/payment" element={<Payment />} />
         <Route path="/receipt" element={<Receipt />} />
        <Route 
        path="/Userpage"
        element={
          <div>
            <UserPage/>
          </div>
        
        }
        />
        <Route 
        path="/Userlogin"
         element={
          <div>
          <Userlogin/>
          </div>
          } 
          />

      <Route path="/user-login" element={<Userlogin />} />



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
