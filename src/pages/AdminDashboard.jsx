import { useEffect, useState } from "react";
import { getAllBuses, addBus, deleteBus } from "../api/api";

function AdminDashboard() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ busNumber: "", busType: "AC", totalSeats: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    getAllBuses().then(setBuses).catch(() => setError("Failed to load buses."));
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newBus = await addBus(form);
      setBuses([...buses, newBus]);
      setForm({ busNumber: "", busType: "AC", totalSeats: "" });
    } catch {
      setError("Failed to add bus.");
    }
  };

  const handleDelete = async (busId) => {
    if (!confirm("Delete this bus?")) return;
    await deleteBus(busId);
    setBuses(buses.filter((b) => b.busId !== busId));
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard - Manage Buses</h2>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}

      <form onSubmit={handleAdd} className="bg-white shadow rounded-lg p-4 mb-6 flex gap-3 flex-wrap">
        <input placeholder="Bus Number" value={form.busNumber}
          onChange={(e) => setForm({ ...form, busNumber: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 flex-1" required />

        <select value={form.busType} onChange={(e) => setForm({ ...form, busType: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2">
          <option value="AC">AC</option>
          <option value="Non_AC">Non-AC</option>
          <option value="Sleeper">Sleeper</option>
          <option value="Semi_Sleeper">Semi-Sleeper</option>
        </select>

        <input type="number" placeholder="Total Seats" value={form.totalSeats}
          onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
          className="border border-gray-300 rounded-lg px-3 py-2 w-32" required />

        <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800">
          Add Bus
        </button>
      </form>

      <div className="space-y-3">
        {buses.map((bus) => (
          <div key={bus.busId} className="bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-200">
            <span>{bus.busNumber} - {bus.busType} ({bus.totalSeats} seats)</span>
            <button onClick={() => handleDelete(bus.busId)} className="text-red-600 hover:underline text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
