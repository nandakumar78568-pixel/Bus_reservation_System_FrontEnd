import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/api";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");

  useEffect(() => {
    getMyBookings(user.userId)
      .then(setBookings)
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelError("");
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === bookingId ? { ...b, status: "Cancelled" } : b))
      );
    } catch (err) {
      setCancelError("Failed to cancel booking. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (bookings.length === 0) return <div className="text-center py-10 text-gray-600">No bookings yet.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {cancelError && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{cancelError}</p>
      )}

      {bookings.map((b) => (
        <div key={b.bookingId} className="bg-white shadow rounded-lg p-5 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold">
              {b.schedule?.bus?.busNumber} - {b.schedule?.route?.source} → {b.schedule?.route?.destination}
            </h3>
            <p className="text-sm text-gray-500">{b.schedule?.departureTime}</p>
            <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full
              ${b.status === "Confirmed" ? "bg-green-100 text-green-700" :
                b.status === "Cancelled" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
              {b.status}
            </span>
          </div>

          {b.status === "Confirmed" && (
            <button onClick={() => handleCancel(b.bookingId)} className="text-red-600 text-sm hover:underline">
              Cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyBookings;