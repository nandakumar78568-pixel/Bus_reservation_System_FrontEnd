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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!routeId) return;
    getBoardingPoints(routeId).then((data) => {
      setBoardingPoints(data.filter((p) => p.pointType === "Boarding"));
      setDroppingPoints(data.filter((p) => p.pointType === "Dropping"));
    });
  }, [routeId]);

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const booking = await createBooking({
        scheduleId,
        passengers,
        boardingPointId,
        droppingPointId,
      });
      navigate("/booking-confirmation", { state: { booking } });
    } catch (err) {
      setError("Booking failed. One or more seats may already be taken.");
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

          <div className="flex gap-3">
            <select
              value={boardingPointId}
              onChange={(e) => setBoardingPointId(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Boarding Point</option>
              {boardingPoints.map((p) => (
                <option key={p.pointId} value={p.pointId}>
                  {p.pointName} ({p.pointTime})
                </option>
              ))}
            </select>

            <select
              value={droppingPointId}
              onChange={(e) => setDroppingPointId(e.target.value)}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2"
              required
            >
              <option value="">Select Dropping Point</option>
              {droppingPoints.map((p) => (
                <option key={p.pointId} value={p.pointId}>
                  {p.pointName} ({p.pointTime})
                </option>
              ))}
            </select>
          </div>
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
