import React, { useState } from "react";
import "./BookSeat.css";

const BookSeat = () => {
  // Volvo / KSRTC Bus Seat Layout
  const seatLayout = [
    ["D", "", "1", "2"],  // Driver seat + 1st row
    ["", "", "", ""],     // Door area
    ["3", "4", "", "5", "6"],
    ["7", "8", "", "9", "10"],
    ["11", "12", "", "13", "14"],
    ["15", "16", "", "17", "18"],
    ["19", "20", "", "21", "22"],
    ["23", "24", "", "25", "26"],
    ["27", "28", "", "29", "30"],
    ["", "", "", ""],     // Back area
  ];

  const [selectedSeats, setSelectedSeats] = useState([]);

  const toggleSeat = (seat) => {
    if (!seat || seat === "D") return; // ignore aisle + driver

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const bookSeats = () => {
    alert("Booked Seats: " + selectedSeats.join(", "));
  };

  return (
    <div className="volvo-page">

      <h2 className="title"> Seat Booking</h2>

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

      <button className="book-btn" onClick={bookSeats}>
        Confirm Booking
      </button>
    </div>
  );
};

export default BookSeat;
