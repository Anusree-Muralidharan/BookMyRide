import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./BookSeat.css";

const BookSeat = ({ userId }) => {
  const { id } = useParams(); // busId
  const navigate = useNavigate();

  const [busDetails, setBusDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bus + booked seats
  useEffect(() => {
    const fetchData = async () => {
      try {
        const busRes = await axios.get(`http://localhost:3005/bus/${id}`);
        const bookedRes = await axios.get(
          `http://localhost:3005/bookings/bus/${id}`
        );

        setBusDetails(busRes.data);
        setBookedSeats(bookedRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const toggleSeat = (seat) => {
    if (!seat) return;
    if (bookedSeats.includes(seat)) return;

    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const confirmBooking = () => {
    if (selectedSeats.length === 0) {
      alert("Select at least one seat");
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

  if (loading) return <p>Loading...</p>;
  if (!busDetails) return <p>Bus not found</p>;

  // Dynamic seat generation
  const totalSeats = busDetails.busId.totalSeats || 40;
  const seatNumbers = Array.from(
    { length: totalSeats },
    (_, i) => (i + 1).toString()
  );

  const generateSeatLayout = () => {
    const layout = [];
    let index = 0;

    // Front row – driver only
    layout.push(["D", "", "", "", ""]);

    // Remaining rows – 2 left | aisle | 2 right
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
        {busDetails.routeId.sourceLocation} →{" "}
        {busDetails.routeId.destinationLocation}
        <br />
        Distance: {busDetails.routeId.distance} km
        <br />
        Fare per seat: ₹{busDetails.fare}
      </p>

      <div className="volvo-bus">
        {seatLayout.map((row, rIdx) => (
          <div className="row" key={rIdx}>
            {row.map((seat, sIdx) => {
              if (seat === "")
                return <div key={sIdx} className="aisle"></div>;

              if (seat === "D")
                return (
                  <div key={sIdx} className="driver">
                    D
                  </div>
                );

              const isBooked = bookedSeats.includes(seat);
              const isSelected = selectedSeats.includes(seat);

              return (
                <div
                  key={sIdx}
                  className={`seat 
                    ${isBooked ? "booked" : ""} 
                    ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSeat(seat)}
                >
                  {seat}
                </div>
              );
            })}
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
