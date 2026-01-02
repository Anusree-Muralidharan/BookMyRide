import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingDetailsView.css";

const BookingDetailsView = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchBus, setSearchBus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3005/bookings");
      const data = res.data.bookings || res.data;

      setBookings(data);
      setFilteredBookings(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchBus.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter((booking) =>
      booking.busId?.name
        ?.toLowerCase()
        .includes(searchBus.toLowerCase())
    );

    setFilteredBookings(filtered);
  };

  const handleClear = () => {
    setSearchBus("");
    setFilteredBookings(bookings);
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading bookings...</p>;

  return (
    <div className="booking-container">

      {/* 🔍 SEARCH BAR */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Bus Name"
          value={searchBus}
          onChange={(e) => setSearchBus(e.target.value)}
        />

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* 📋 BOOKINGS TABLE */}
      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Seats</th>
            <th>Amount (₹)</th>
            <th>Journey Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>

                <td>
                  {booking.userId?.name ||
                    booking.userId?.email ||
                    "N/A"}
                </td>

                <td>{booking.busId?.name || "N/A"}</td>

                <td>
                  {booking.routeId
                    ? `${booking.routeId.sourceLocation} → ${booking.routeId.destinationLocation}`
                    : "N/A"}
                </td>

                <td>
                  {Array.isArray(booking.seats)
                    ? booking.seats.join(", ")
                    : "-"}
                </td>

                <td>{booking.fare}</td>

                {/* ✅ JOURNEY DATE */}
                <td>{booking.journeyDate || "-"}</td>

                <td>
                  <span
                    className={`status ${
                      booking.status === "Cancelled"
                        ? "cancelled"
                        : "confirmed"
                    }`}
                  >
                    {booking.status || "Confirmed"}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetailsView;
