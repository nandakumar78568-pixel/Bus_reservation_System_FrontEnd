import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking, getBoardingPoints, getScheduleById, applyCoupon } from "../api/api";

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

  // ---- Fare (needed to show a subtotal and to validate coupons) ----
  const [fare, setFare] = useState(null);
  const [fareLoading, setFareLoading] = useState(true);
  const [fareError, setFareError] = useState("");

  // ---- Coupon ----
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState(null); // { valid, code, discountAmount, finalFare, message }
  const [couponLoading, setCouponLoading] = useState(false);

  useEffect(() => {
    if (!scheduleId) {
      setFareError("Schedule information is missing.");
      setFareLoading(false);
      return;
    }
    setFareLoading(true);
    getScheduleById(scheduleId)
      .then((data) => setFare(data.fare))
      .catch(() => setFareError("Couldn't load fare details. You can still complete your booking."))
      .finally(() => setFareLoading(false));
  }, [scheduleId]);

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

  const subtotal = fare != null ? fare * passengers.length : null;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || subtotal == null) return;
    setCouponLoading(true);
    try {
      const result = await applyCoupon(couponCode.trim().toUpperCase(), subtotal);
      setCouponResult(result);
    } catch (err) {
      setCouponResult({ valid: false, message: err.message || "Failed to apply coupon" });
    } finally {
      setCouponLoading(false);
    }
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
        couponCode: couponResult?.valid ? couponResult.code : null,
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

        {/* Fare Summary & Coupon */}
        <div className="bg-white shadow rounded-lg p-4 border border-gray-200 space-y-3">
          <h3 className="font-medium text-gray-700">Fare & Coupon</h3>

          {fareLoading && <p className="text-sm text-gray-500">Loading fare...</p>}
          {fareError && <p className="text-sm text-amber-600">{fareError}</p>}

          {!fareLoading && subtotal != null && (
            <>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code (e.g. GOFIRST)"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponResult(null);
                  }}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={!couponCode.trim() || couponLoading}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition disabled:opacity-50"
                >
                  {couponLoading ? "Checking..." : "Apply"}
                </button>
              </div>

              {couponResult && !couponResult.valid && (
                <p className="text-sm text-red-600">{couponResult.message}</p>
              )}
              {couponResult && couponResult.valid && (
                <p className="text-sm text-green-600">{couponResult.message}</p>
              )}

              <div className="text-sm text-gray-600 space-y-1 pt-2 border-t border-dashed border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal ({passengers.length} seat{passengers.length > 1 ? "s" : ""})</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {couponResult?.valid && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponResult.code})</span>
                    <span>-₹{couponResult.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-gray-800 text-base pt-1">
                  <span>Total</span>
                  <span>₹{(couponResult?.valid ? couponResult.finalFare : subtotal).toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

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
  disabled={loading || fareLoading}
  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
>
  {loading
    ? "Confirming..."
    : subtotal != null
      ? `Confirm Booking — Pay ₹${(couponResult?.valid ? couponResult.finalFare : subtotal).toFixed(2)}`
      : "Confirm Booking"}
</button>
      </form>
    </div>
  );
}

export default BookingForm;