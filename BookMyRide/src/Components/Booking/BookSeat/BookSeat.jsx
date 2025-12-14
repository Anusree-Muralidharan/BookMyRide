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

  const seatLayout = [
    ["D", "", "1", "2"],
    ["", "", "", ""],
    ["3", "4", "", "5", "6"],
    ["7", "8", "", "9", "10"],
    ["11", "12", "", "13", "14"],
    ["15", "16", "", "17", "18"],
    ["19", "20", "", "21", "22"],
    ["23", "24", "", "25", "26"],
    ["27", "28", "", "29", "30"],
    ["", "", "", ""],
  ];

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
    if (!seat || seat === "D") return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    try {
      navigate("/payment", {
      state: {
        userId,
        busId: busDetails.busId._id,
        busName:busDetails.busId.name,
        routeId: busDetails.routeId._id,
        seats: selectedSeats,
        amount: selectedSeats.length * busDetails.fare,
      },
    });

    } catch (err) {
      console.error(err);
      alert("Booking failed, try again");
    }
  };

  if (loading) return <p>Loading bus details...</p>;
  if (!busDetails) return <p>Bus details not found!</p>;

  return (
    <div className="volvo-page">
      <h2 className="title">{busDetails.busId.name} - Seat Booking</h2>
      <p>
        Route: {busDetails.routeId.sourceLocation} → {busDetails.routeId.destinationLocation} <br/>
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
      <button className="book-btn" onClick={confirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
};

export default BookSeat;
