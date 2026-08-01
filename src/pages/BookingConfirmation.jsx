import { useLocation, Link } from "react-router-dom";

function BookingConfirmation() {
  const { state } = useLocation();
  const booking = state?.booking;

  if (!booking) {
    return (
      <div className="text-center py-16 bg-[#FFF8F3] min-h-[80vh]">
        <p className="text-gray-600">No booking details found.</p>
        <Link to="/" className="text-[#D6262C] hover:underline">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center bg-[#FFF8F3] min-h-[80vh]">
      <div className="bg-green-50 border border-green-200 rounded-xl p-8">
        <div className="text-green-600 text-5xl mb-4">✓</div>
        <h2 className="font-display text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-4">Booking ID: #{booking.booking_id}</p>

        <div className="text-left bg-white rounded-lg p-4 space-y-2 text-sm text-gray-700">
          <p><strong>Bus:</strong> {booking.bus_number}</p>
          <p><strong>Route:</strong> {booking.source} → {booking.destination}</p>
          <p><strong>Departure:</strong> {booking.departure_time}</p>
          <p><strong>Journey Date:</strong> {booking.journey_date}</p>
          <p><strong>Seats:</strong> {booking.seat_numbers?.join(", ")}</p>
          <p><strong>Payment Method:</strong> {booking.payment_method}</p>
          <p><strong>Total Fare:</strong> ₹{booking.total_fare}</p>
        </div>

        <Link to="/my-bookings" className="block mt-6 bg-[#D6262C] text-white py-2 rounded-lg hover:bg-[#B3201F] transition">
          View My Bookings
        </Link>
      </div>
    </div>
  );
}

export default BookingConfirmation;