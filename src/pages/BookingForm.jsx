import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, getBoardingPoints } from "../api/api";

function BookingForm() {
  const { state } = useLocation();
  const { scheduleId, routeId, selected } = state || { selected: [] };
  const [passengers, setPassengers] = useState(
    selected.map((seatId) => ({ seat_id: seatId, name: "", age: "", gender: "Male" }))
  );
  const [boardingPoints, setBoardingPoints] = useState([]);
  const [droppingPoints, setDroppingPoints] = useState([]);
  const [boardingPointId, setBoardingPointId] = useState("");
  const [droppingPointId, setDroppingPointId] = useState("");
  const [journeyDate, setJourneyDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [pointsLoading, setPointsLoading] = useState(true);
  const [pointsError, setPointsError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!routeId) {
      setPointsError("Route information is missing. Boarding/dropping point selection will be skipped.");
      setPointsLoading(false);
      return;
    }

    setPointsLoading(true);
    getBoardingPoints(routeId)
      .then((data) => {
        setBoardingPoints(data.filter((p) => p.pointType === "Boarding"));
        setDroppingPoints(data.filter((p) => p.pointType === "Dropping"));
        setPointsError("");
      })
      .catch(() => {
        setPointsError("Failed to load boarding/dropping points. You can still continue without selecting one.");
      })
      .finally(() => setPointsLoading(false));
  }, [routeId]);

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const isUpiFlow = paymentMethod === "UPI" || paymentMethod === "Paytm";
  const isCardFlow = paymentMethod === "DebitCard" || paymentMethod === "CreditCard";

  const formatCardInput = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!journeyDate) {
      setError("Please select a journey date.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (isUpiFlow) {
      if (!upiId.trim()) {
        setError("Please enter your UPI ID.");
        return;
      }
      if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId.trim())) {
        setError("Please enter a valid UPI ID (e.g. name@bank).");
        return;
      }
    }
    if (isCardFlow) {
      const digits = cardNumber.replace(/\s/g, "");
      if (digits.length < 12 || digits.length > 19 || !/^\d+$/.test(digits)) {
        setError("Please enter a valid card number.");
        return;
      }
    }

    setLoading(true);
    try {
      const booking = await createBooking({
        scheduleId,
        passengers,
        boardingPointId: boardingPointId ? Number(boardingPointId) : null,
        droppingPointId: droppingPointId ? Number(droppingPointId) : null,
        journeyDate,
        paymentMethod,
        upiId: isUpiFlow ? upiId.trim() : null,
        cardNumber: isCardFlow ? cardNumber.replace(/\s/g, "") : null,
      });
      navigate("/booking-confirmation", { state: { booking } });
    } catch (err) {
      setError(err.message || "Booking failed. One or more seats may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Passenger Details</h2>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Boarding & Dropping Point Selection */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-700">Boarding & Dropping Points</h3>

          {pointsLoading && <p className="text-sm text-gray-500">Loading points...</p>}
          {pointsError && <p className="text-sm text-amber-600">{pointsError}</p>}
          {!pointsLoading && !pointsError && boardingPoints.length === 0 && droppingPoints.length === 0 && (
            <p className="text-sm text-gray-500">
              No boarding/dropping points configured for this route yet. You can still proceed with your booking.
            </p>
          )}

          <div className="flex gap-3">
            <select
              value={boardingPointId}
              onChange={(e) => setBoardingPointId(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={boardingPoints.length === 0}
            >
              <option value="">
                {boardingPoints.length === 0 ? "No boarding points available" : "Select Boarding Point"}
              </option>
              {boardingPoints.map((p) => (
                <option key={p.pointId} value={p.pointId}>
                  {p.pointName} ({p.pointTime})
                </option>
              ))}
            </select>

            <select
              value={droppingPointId}
              onChange={(e) => setDroppingPointId(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={droppingPoints.length === 0}
            >
              <option value="">
                {droppingPoints.length === 0 ? "No dropping points available" : "Select Dropping Point"}
              </option>
              {droppingPoints.map((p) => (
                <option key={p.pointId} value={p.pointId}>
                  {p.pointName} ({p.pointTime})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Journey Date */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-700">Journey Date</h3>
          <input
            type="date"
            value={journeyDate}
            min={todayStr}
            onChange={(e) => setJourneyDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          />
        </div>

        {/* Passenger Details */}
        {passengers.map((p, index) => (
          <div key={p.seat_id} className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-3">
            <h3 className="font-medium text-gray-700">Seat {p.seat_id}</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={p.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />

            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Age"
                value={p.age}
                onChange={(e) => handleChange(index, "age", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
                required
              />

              <select
                value={p.gender}
                onChange={(e) => handleChange(index, "gender", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        ))}

        {/* Payment Method */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-700">Payment Method</h3>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setUpiId("");
              setCardNumber("");
            }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            required
          >
            <option value="">Select Payment Method</option>
            <option value="UPI">UPI</option>
            <option value="Paytm">Paytm</option>
            <option value="DebitCard">Debit Card</option>
            <option value="CreditCard">Credit Card</option>
            <option value="NetBanking">Net Banking</option>
          </select>

          {isUpiFlow && (
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. name@okbank)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          )}

          {isCardFlow && (
            <input
              type="text"
              inputMode="numeric"
              placeholder="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardInput(e.target.value))}
              maxLength={23}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Confirming..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default BookingForm;