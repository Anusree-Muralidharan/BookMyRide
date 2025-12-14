import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookSeat.css";

const BookSeat = () => {
  const navigate = useNavigate();

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

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (!seat || seat === "D") return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    navigate("/payment", {
      state: {
        seats: selectedSeats,
        amount: selectedSeats.length * 500, // ₹500 per seat
      },
    });
  };

  return (
    <div className="volvo-page">
      <h2 className="title">Seat Booking</h2>

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

      <button className="book-btn" onClick={confirmBooking}>
        Confirm Booking
      </button>
    </div>
  );
};

export default BookSeat;
