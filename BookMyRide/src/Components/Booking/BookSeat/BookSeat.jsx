import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BookSeat.css";

const BookSeat = ({ userId }) => {
  const { id } = useParams(); // busId from URL
  const navigate = useNavigate();

  const [busDetails, setBusDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/bus/${id}`);
        setBusDetails(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchBus();
  }, [id]);

  const toggleSeat = (seat) => {
    if (!seat) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    navigate("/payment", {
      state: {
        userId,
        busId: busDetails.busId._id,
        busName: busDetails.busId.name,
        routeId: busDetails.routeId._id,
        seats: selectedSeats,
        amount: selectedSeats.length * busDetails.fare,
      },
    });
  };

  if (loading) return <p>Loading bus details...</p>;
  if (!busDetails) return <p>Bus details not found!</p>;

  const totalSeats = busDetails.busId.totalSeats || 40; // total seats from bus data
const seatNumbers = Array.from({ length: totalSeats }, (_, i) => (i + 1).toString());

// Generate dynamic layout
const generateSeatLayout = () => {
  const layout = [];
  let index = 0;

  // Front row: driver (left) + first passenger seat + empty space
  layout.push(["D","" || "","", ""]);

  // Remaining rows: 2 left + 2 right with aisle
  while (index < seatNumbers.length) {
    layout.push([
      seatNumbers[index++] || "",
      seatNumbers[index++] || "",
      "",
      seatNumbers[index++] || "",
      seatNumbers[index++] || "",
    ]);
  }

  return layout;
};

const seatLayout = generateSeatLayout();


  return (
    <div className="volvo-page">
      <h2 className="title">{busDetails.busId.name} - Seat Booking</h2>
      <p>
        Route: {busDetails.routeId.sourceLocation} → {busDetails.routeId.destinationLocation} <br />
        Distance: {busDetails.routeId.distance} km <br />
        Fare per seat: ₹{busDetails.fare}
      </p>

      <div className="volvo-bus">
        {seatLayout.map((row, rowIndex) => (
          <div className="row" key={rowIndex}>
            {row.map((seat, seatIndex) =>
              seat === "" ? (
                <div className="aisle" key={seatIndex}></div>
              ) : seat === "D" ? (
                <div className="driver" key={seatIndex}>D</div>
              ) : (
                <div
                  key={seatIndex}
                  className={`seat ${selectedSeats.includes(seat) ? "selected" : ""}`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <p>Total Fare: ₹{selectedSeats.length * busDetails.fare}</p>
      <div className="book-button">
        <button className="book-btn" onClick={confirmBooking}>
          Confirm
        </button>
        <button className="book-btn" onClick={() => navigate("/user")}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BookSeat;
