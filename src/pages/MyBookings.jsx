import { useEffect, useState } from "react";
import { getMyBookings, cancelBooking } from "../api/api";
import { useAuth } from "../context/AuthContext";

function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [refundInfo, setRefundInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getMyBookings(user.userId)
      .then(setBookings)
      .catch(() => setError("Failed to load bookings."))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!refundInfo) {
      setModalVisible(false);
      return;
    }
    const showTimer = setTimeout(() => setModalVisible(true), 10);
    const closeTimer = setTimeout(() => closeRefundModal(), 5000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refundInfo]);

  const closeRefundModal = () => {
    setModalVisible(false);
    setTimeout(() => setRefundInfo(null), 200);
  };

  const handleCancel = async (booking) => {
    if (!confirm("Cancel this booking?")) return;
    setCancelError("");
    try {
      const result = await cancelBooking(booking.bookingId);
      setBookings((prev) =>
        prev.map((b) => (b.bookingId === booking.bookingId ? { ...b, status: "Cancelled" } : b))
      );
      const amount = result?.refundAmount ?? booking.schedule?.fare * 0.9;
      setRefundInfo({ amount: amount ? amount.toFixed(2) : null });
    } catch (err) {
      setCancelError(err.message || "Failed to cancel booking. Please try again.");
    }
  };

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (bookings.length === 0) return <div className="text-center py-10 text-gray-600">No bookings yet.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4 bg-[#FFF8F3] min-h-[80vh]">
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-4">My Bookings</h2>

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
            <button onClick={() => handleCancel(b)} className="text-red-600 text-sm hover:underline">
              Cancel
            </button>
          )}
        </div>
      ))}

      {refundInfo && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
          onClick={closeRefundModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm w-full transform transition-all duration-300 ${
              modalVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div className="relative flex items-center justify-center mb-4">
              <span className="absolute w-16 h-16 rounded-full bg-green-100 animate-ping" />
              <span className="relative text-6xl animate-bounce">💸</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Cancelled</h3>
            <p className="text-gray-600 mb-1">
              Your refund of{" "}
              <span className="font-semibold text-green-600">
                {refundInfo.amount ? `₹${refundInfo.amount}` : "your fare"}
              </span>{" "}
              is being processed.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              It will reflect in your original payment method within 5–7 business days.
            </p>
            <button
              onClick={closeRefundModal}
              className="bg-[#D6262C] text-white px-6 py-2 rounded-lg hover:bg-[#B3201F] transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;