import { useEffect, useState } from "react";
import { getAllRoutes, getPointsByRoute, addBoardingPoint, deleteBoardingPoint } from "../api/api";

function AdminBoardingPoints() {
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [points, setPoints] = useState([]);
  const [form, setForm] = useState({ pointName: "", pointType: "Boarding", pointTime: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    getAllRoutes().then(setRoutes).catch(() => setError("Failed to load routes."));
  }, []);

  useEffect(() => {
    if (!routeId) { setPoints([]); return; }
    getPointsByRoute(routeId).then(setPoints).catch(() => setError("Failed to load points."));
  }, [routeId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!routeId) { setError("Select a route first."); return; }
    try {
      const newPoint = await addBoardingPoint({
        route: { routeId: Number(routeId) },
        pointName: form.pointName,
        pointType: form.pointType,
        pointTime: form.pointTime,
      });
      setPoints([...points, newPoint]);
      setForm({ pointName: "", pointType: "Boarding", pointTime: "" });
    } catch {
      setError("Failed to add point.");
    }
  };

  const handleDelete = async (pointId) => {
    if (!confirm("Delete this point?")) return;
    await deleteBoardingPoint(pointId);
    setPoints(points.filter((p) => p.pointId !== pointId));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 bg-[#FFF8F3] min-h-[80vh]">
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Manage Boarding & Dropping Points</h2>

      {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{error}</p>}

      <select
        value={routeId}
        onChange={(e) => setRouteId(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6"
      >
        <option value="">Select a Route</option>
        {routes.map((r) => (
          <option key={r.routeId} value={r.routeId}>
            {r.source} → {r.destination}
          </option>
        ))}
      </select>

      {routeId && (
        <>
          <form onSubmit={handleAdd} className="bg-white shadow rounded-lg p-4 mb-6 flex gap-3 flex-wrap">
            <input
              placeholder="Point Name"
              value={form.pointName}
              onChange={(e) => setForm({ ...form, pointName: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
              required
            />
            <select
              value={form.pointType}
              onChange={(e) => setForm({ ...form, pointType: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="Boarding">Boarding</option>
              <option value="Dropping">Dropping</option>
            </select>
            <input
              type="time"
              value={form.pointTime}
              onChange={(e) => setForm({ ...form, pointTime: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2"
              required
            />
            <button type="submit" className="bg-[#D6262C] text-white px-4 py-2 rounded-lg hover:bg-[#B3201F] transition">
              Add Point
            </button>
          </form>

          <div className="space-y-3">
            {points.map((p) => (
              <div key={p.pointId} className="bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-200">
                <span>{p.pointName} — {p.pointType} ({p.pointTime})</span>
                <button onClick={() => handleDelete(p.pointId)} className="text-red-600 hover:underline text-sm">
                  Delete
                </button>
              </div>
            ))}
            {points.length === 0 && <p className="text-gray-500 text-sm">No points added yet for this route.</p>}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminBoardingPoints;