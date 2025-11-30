import React, { useEffect, useState } from "react";
import "./Userpage.css";
import bg from "../../assets/background-BookMyRide.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Userpage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (!token) {
      navigate("/Userpage");
      return;
    }

    // Fetch user profile
    axios
      .get("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => navigate("/Userpage"));

    // Fetch user bookings
    axios
      .get("http://localhost:5000/api/user/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setBookings(res.data))
      .catch((err) => console.log(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  return (
    <div className="user-page">
      {/* Background */}
      <img src={bg} alt="background" className="user-bg" />

      <div className="user-card">
        {/* Profile */}
        <h2>Welcome {user?.name} 👋</h2>
        <p>Email: {user?.email}</p>

        <button className="book-btn" onClick={() => navigate("/book")}>
          Book a Seat
        </button>

        {/* Bookings List */}
        <div className="booking-section">
          <h3>My Bookings</h3>
          {bookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="booking-card">
                <h4>{b.busName}</h4>
                <p>
                  <strong>Date:</strong> {b.date}
                </p>
                <p>
                  <strong>Route:</strong> {b.from} → {b.to}
                </p>
                <p>
                  <strong>Seat:</strong> {b.seats.join(", ")}
                </p>
              </div>
            ))
          )}
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Userpage;
