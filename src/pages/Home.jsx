import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchBuses } from "../api/api";

function Home() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    searchBuses()
      .then(setBuses)
      .catch(() => setError("Failed to load available buses."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/buses?source=${source}&destination=${destination}&date=${date}`);
  };

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      <div className="flex justify-center items-center py-10">
        <form
          onSubmit={handleSearch}
          className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-semibold text-gray-800">Search Buses</h2>

          <input
            type="text"
            placeholder="From"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="text"
            placeholder="To"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Available Buses</h2>

        {loading && <div className="text-center py-10 text-gray-600">Loading buses...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}
        {!loading && !error && buses.length === 0 && (
          <div className="text-center py-10 text-gray-600">No buses available right now.</div>
        )}

        <div className="space-y-4">
          {buses.map((bus) => (
            <div
              key={bus.scheduleId}
              className="bg-white shadow rounded-lg p-5 flex justify-between items-center border border-gray-200"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {bus.bus?.busNumber} - {bus.bus?.busType}
                </h3>
                <p className="text-gray-600 text-sm">
                  {bus.route?.source} → {bus.route?.destination}
                </p>
                <p className="text-gray-500 text-sm">
                  Departure: {bus.departureTime}
                </p>
              </div>

              <div className="text-right">
                <p className="text-blue-700 font-bold text-lg">₹{bus.fare}</p>
                <button
                  onClick={() =>
                    navigate(`/seats/${bus.scheduleId}`, {
                      state: { routeId: bus.route?.routeId },
                    })
                  }
                  className="mt-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  Select Seats
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;