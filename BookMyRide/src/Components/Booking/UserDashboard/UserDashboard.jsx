import React, { useEffect, useState } from "react";
import "./UserDashboard.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Banner images
import banner1 from "./../../../assets/bus-dashboard.png";
import banner2 from "./../../../assets/busss.webp";
import banner3 from "./../../../assets/download.webp";
import banner4 from "./../../../assets/busx.webp";

const banners = [banner1, banner2, banner3, banner4];

const UserDashboard = () => {
  const [journeyDate, setJourneyDate] = useState("");
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [routes, setRoutes] = useState([]);          // ✅ must be array
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [schedules, setSchedules] = useState([]);

  /* ------------------ Banner Auto Slider ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  /* ------------------ Fetch Routes ------------------ */
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("http://localhost:3005/routes");
        setRoutes(Array.isArray(res.data &&res.data.routes) ? res.data.routes : []); // ✅ safe guard
        console.log(res)
      } catch (err) {
        console.error("Failed to fetch routes", err);
        setRoutes([]);
      }
    };
    fetchRoutes();
  }, []);

  /* ------------------ Scroll ------------------ */
  const scrollToBooking = () => {
    document.getElementById("booking").scrollIntoView({ behavior: "smooth" });
  };

  /* ------------------ Search Buses ------------------ */
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!from || !to) {
      alert("Please select From and To locations");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3005/search-buses", {
        params: { from, to },
      });

      setSchedules(res.data);
    } catch (err) {
      console.error("Search failed", err);
      alert("No buses found");
      setSchedules([]);
    }
  };

  return (
    <div className="dashboard-container">

      {/* ================= HERO SLIDER ================= */}
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

      {/* ================= BOOKING SECTION ================= */}
      <section id="booking" className="booking-section">
        <h2>Book Your Journey</h2>

        <form className="booking-form" onSubmit={handleSearch}>

          {/* FROM DROPDOWN */}
          <select value={from} onChange={(e) => setFrom(e.target.value)} required>
            <option value="">From Location</option>
            {[...new Set(routes.map(r => r.sourceLocation))].map((src, i) => (
              <option key={i} value={src}>{src}</option>
            ))}
          </select>

          {/* TO DROPDOWN */}
          <select value={to} onChange={(e) => setTo(e.target.value)} required>
            <option value="">To Location</option>
            {routes
              .filter(r => r.sourceLocation === from)
              .map((r, i) => (
                <option key={i} value={r.destinationLocation}>
                  {r.destinationLocation}
                </option>
              ))}
          </select>

          <input
            type="date"
            min={today}
            value={journeyDate}
            onChange={(e) => setJourneyDate(e.target.value)}
            required
          />
          <button type="submit">Search Buses</button>
        </form>
      </section>

      {/* ================= SEARCH RESULTS ================= */}
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
                  <p>{item.departureTime} - {item.arrivalTime}</p>
                  <p className="fare">₹ {item.fare}</p>

                  <button onClick={() => navigate(`/book/${item.busId._id}`, {
                      state: { journeyDate }
                    })}>
                    Book Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      <section id="about" className="about-section">
        <h2>About EasyBus</h2>
        <p>
          EasyBus is your one-stop platform for booking bus tickets across cities
          with real-time seat availability and secure payments.
        </p>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">
        <h2>Why Choose EasyBus?</h2>
        <div className="features-scroll">
          <div className="feature-card">Live Seat Availability</div>
          <div className="feature-card">Secure Payments</div>
          <div className="feature-card">Instant Tickets</div>
          <div className="feature-card">24/7 Support</div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
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
