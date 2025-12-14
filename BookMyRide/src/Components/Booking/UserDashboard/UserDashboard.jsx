import React, { useEffect, useState } from "react";
import "./UserDashboard.css";

// Import banner images
import banner1 from "./../../../assets/bus-dashboard.png";

import banner2 from "./../../../assets/busss.webp";
import banner3 from "./../../../assets/download.webp";
import banner4 from "./../../../assets/busx.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const banners = [banner1,banner2,banner3,banner4];


const UserDashboard = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate(); 

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  };
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [schedules, setSchedules] = useState([]);



const handleSearch = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.get(
      "http://localhost:3005/search-buses",
      {
        params: {
          from,
          to,
        },
      }
    );

    setSchedules(res.data);
  } catch (err) {
    console.error("Search failed", err);
    alert("No buses found");
  }
};



  return (
    <div className="dashboard-container">
      {/* HERO SLIDER */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${banners[currentSlide]})` }}
      >
        <div className="hero-overlay">
          <h1>Welcome to EasyBus</h1>
          <p>Book your bus tickets easily and travel hassle-free!</p>

          <div className="hero-buttons">
            <a href="#about" className="btn-secondary">Learn More</a>
            <button className="btn-primary" onClick={scrollToBooking}>
              Book Now
            </button>
          </div>
        </div>

        {/* Slider dots */}
        <div className="slider-dots">
          {banners.map((_, index) => (
            <span
              key={index}
              className={index === currentSlide ? "dot active" : "dot"}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* BOOKING SECTION */}
      <section id="booking" className="booking-section">
        <h2>Book Your Journey</h2>
        <form className="booking-form">
          <input
            type="text"
            placeholder="From Location"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="To Location"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            required
          />

          <input type="date" required />
          <button type="submit" onClick={handleSearch}>
            Search Buses
          </button>

        </form>
      </section>
      {schedules.length > 0 && (
        <section className="search-results">
            <h2>Available Buses</h2>

            <div className="bus-list">
            {schedules.map((item) => (
                <div className="bus-card" key={item._id}>
                <img
                    src={`http://localhost:3005/upload/${item.busId.image}`}
                    alt="Bus"
                />

                <div className="bus-info">
                    <h3>{item.busId.busName}</h3>
                    <p>
                    {item.routeId.sourceLocation} → {item.routeId.destinationLocation}
                    </p>
                    <p>
                    {item.departureTime} - {item.arrivalTime}
                    </p>
                    <p className="fare">₹ {item.fare}</p>

                    <button
                    onClick={() =>
                        navigate(`/book/${item.busId._id}`)
                    }
                    >
                    Book Seat
                    </button>
                </div>
                </div>
            ))}
            </div>
        </section>
      )}

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <h2>About EasyBus</h2>
        <p>
          EasyBus is your one-stop platform for booking bus tickets across cities.
          With real-time seat availability, secure payments, and instant booking
          confirmation, we make your journey simple and stress-free.
        </p>
        <p>
          Whether you are traveling for work or leisure, EasyBus ensures comfort,
          convenience, and reliability every step of the way.
        </p>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <h2>Why Choose EasyBus?</h2>
        <div className="features-scroll">
          <div className="feature-card">
            <h3>Live Seat Availability</h3>
            <p>Check seats instantly before booking.</p>
          </div>
          <div className="feature-card">
            <h3>Secure Payments</h3>
            <p>Safe card, UPI, and wallet payments.</p>
          </div>
          <div className="feature-card">
            <h3>Instant Tickets</h3>
            <p>Get confirmation immediately.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>We are always here to help you.</p>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="contact-section">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required />
          <button type="submit">Send Message</button>
        </form>
      </section>
    </div>
  );
};

export default UserDashboard;
