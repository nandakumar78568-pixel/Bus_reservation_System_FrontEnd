import { useEffect, useState } from "react";
import { getAllBuses, addBusWithSchedule, deleteBus, getCities } from "../api/api";

const initialForm = {
  busNumber: "",
  busType: "AC",
  totalSeats: "40",
  operatorName: "",
  source: "",
  destination: "",
  departureTime: "",
  arrivalTime: "",
  fare: "",
};

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllBuses().then(setBuses).catch(() => setError("Failed to load buses."));
    getCities().then(setCities).catch(() => {});
  }, []);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.source.trim().toLowerCase() === form.destination.trim().toLowerCase()) {
      setError("Source and destination must be different.");
      return;
    }
    if (!form.departureTime || !form.arrivalTime) {
      setError("Please select both departure and arrival time.");
      return;
    }
    if (form.arrivalTime <= form.departureTime) {
      setError("Arrival time must be after departure time.");
      return;
    }

    setLoading(true);
    try {
      await addBusWithSchedule({
        busNumber: form.busNumber,
        busType: form.busType,
        totalSeats: Number(form.totalSeats),
        operatorName: form.operatorName,
        source: form.source,
        destination: form.destination,
        departureTime: form.departureTime,
        arrivalTime: form.arrivalTime,
        fare: Number(form.fare),
      });

      const updatedBuses = await getAllBuses();
      setBuses(updatedBuses);
      setForm(initialForm);
      setSuccess("Bus added and scheduled successfully.");
    } catch (err) {
      setError(err.message || "Failed to add bus.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (busId) => {
    if (!confirm("Delete this bus?")) return;
    await deleteBus(busId);
    setBuses(buses.filter((b) => b.busId !== busId));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 bg-[#FFF8F3] min-h-[80vh]">
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Admin Dashboard - Manage Buses</h2>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}
      {success && <p className="text-green-700 text-sm bg-green-50 p-2 rounded mb-4">{success}</p>}

      <form onSubmit={handleAdd} className="bg-white shadow rounded-lg p-4 mb-6 space-y-4 border border-gray-200">
        <div className="flex gap-3 flex-wrap">
          <input
            placeholder="Bus Number"
            value={form.busNumber}
            onChange={(e) => handleChange("busNumber", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[160px]"
            required
          />

          <input
            placeholder="Operator Name"
            value={form.operatorName}
            onChange={(e) => handleChange("operatorName", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[160px]"
            required
          />

          <select
            value={form.busType}
            onChange={(e) => handleChange("busType", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="AC">AC</option>
            <option value="Non_AC">Non-AC</option>
            <option value="Sleeper">Sleeper</option>
            <option value="Semi_Sleeper">Semi-Sleeper</option>
          </select>

          <input
            type="number"
            min="1"
            placeholder="Total Seats"
            value={form.totalSeats}
            onChange={(e) => handleChange("totalSeats", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-32"
            required
          />
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4 flex gap-3 flex-wrap">
          <input
            list="admin-city-options"
            placeholder="Source city"
            value={form.source}
            onChange={(e) => handleChange("source", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[160px]"
            required
          />

          <input
            list="admin-city-options"
            placeholder="Destination city"
            value={form.destination}
            onChange={(e) => handleChange("destination", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 min-w-[160px]"
            required
          />

          <datalist id="admin-city-options">
            {cities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <input
            type="number"
            min="0"
            step="1"
            placeholder="Fare (₹)"
            value={form.fare}
            onChange={(e) => handleChange("fare", e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-32"
            required
          />
        </div>

        <div className="border-t border-dashed border-gray-200 pt-4 flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Departure Time</label>
            <input
              type="datetime-local"
              value={form.departureTime}
              onChange={(e) => handleChange("departureTime", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Arrival Time</label>
            <input
              type="datetime-local"
              value={form.arrivalTime}
              onChange={(e) => handleChange("arrivalTime", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#D6262C] text-white px-4 py-2 rounded-lg hover:bg-[#B3201F] transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Bus"}
        </button>
      </form>

      <div className="space-y-3">
        {buses.map((bus) => (
          <div key={bus.busId} className="bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-200">
            <span>
              {bus.busNumber} - {bus.busType} ({bus.totalSeats} seats)
              {bus.operatorName ? ` — ${bus.operatorName}` : ""}
            </span>
            <button onClick={() => handleDelete(bus.busId)} className="text-red-600 hover:underline text-sm">
              Delete
            </button>
          </div>
        ))}
        {buses.length === 0 && <p className="text-gray-500 text-sm">No buses added yet.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;