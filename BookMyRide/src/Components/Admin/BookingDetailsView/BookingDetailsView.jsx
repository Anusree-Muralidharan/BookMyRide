import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookingDetailsView.css";

const BookingDetailsView = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:3005/bookings");
      setBookings(res.data.bookings || res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings", error);
      setLoading(false);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading bookings...</p>;

  return (
    <div className="booking-container">
      {/* <h2 className="page-title">Booking Details</h2> */}

      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Seats</th>
            <th>Amount (₹)</th>
            <th>Booking Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <tr key={booking._id}>
                <td>{index + 1}</td>

                <td>
                  {booking.userId?.name || booking.userId?.email || "N/A"}
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

                <td>
                  {booking.bookingDate
                    ? new Date(booking.bookingDate).toLocaleDateString()
                    : "-"}
                </td>

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
