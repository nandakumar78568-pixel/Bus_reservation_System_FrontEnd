import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchBuses, getCities } from "../api/api";
import BusBanner from "../components/BusBanner";

const POPULAR_ROUTES = [
  { source: "Chennai", destination: "Bangalore" },
  { source: "Bangalore", destination: "Hyderabad" },
  { source: "Delhi", destination: "Jaipur" },
  { source: "Mumbai", destination: "Pune" },
];

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function Home() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busType, setBusType] = useState("All");
  const [sortBy, setSortBy] = useState("departure");
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    searchBuses()
      .then(setBuses)
      .catch(() => setError("Failed to load available buses."))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    navigate(`/buses?source=${source}&destination=${destination}&date=${date}`);
  };

  const handleSwap = () => {
    setSource(destination);
    setDestination(source);
  };

  const handleRouteChip = (route) => {
    setSource(route.source);
    setDestination(route.destination);
    navigate(`/buses?source=${route.source}&destination=${route.destination}&date=${date || todayPlus(0)}`);
  };

  const displayedBuses = useMemo(() => {
    let result = [...buses];
    if (busType !== "All") {
      result = result.filter((b) => b.bus?.busType === busType);
    }
    if (sortBy === "priceLow") result.sort((a, b) => a.fare - b.fare);
    else if (sortBy === "priceHigh") result.sort((a, b) => b.fare - a.fare);
    else if (sortBy === "departure") {
      result.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
    }
    return result;
  }, [buses, busType, sortBy]);

  return (
    <div className="bg-gray-50 min-h-[80vh]">
      {/* ---- Hero ---- */}
      <div className="relative bg-gradient-to-br from-rose-700 via-red-600 to-orange-600 pb-24 pt-14 overflow-hidden">
        {/* subtle road-dash pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0 24px, transparent 24px 48px)",
            backgroundPosition: "bottom 40px left 0",
            backgroundSize: "100% 4px",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <p className="text-orange-100 tracking-widest text-xs font-semibold uppercase mb-2">
            India's easiest way to book bus tickets
          </p>
          <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-1">
            Where's your next ride?
          </h1>
          <p className="text-orange-100 text-sm">
            Compare buses, pick your seat, travel your way.
          </p>
        </div>

        {/* Popular route chips */}
        <div className="max-w-3xl mx-auto px-4 mt-6 flex flex-wrap justify-center gap-2 relative">
          {POPULAR_ROUTES.map((r) => (
            <button
              key={`${r.source}-${r.destination}`}
              onClick={() => handleRouteChip(r)}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30 transition"
            >
              {r.source} → {r.destination}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Ticket-stub search card, overlapping the hero ---- */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        <div className="relative bg-white rounded-2xl shadow-xl">
          {/* notch cutouts to sell the "ticket" shape */}
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />
          <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full" />

          <form onSubmit={handleSearch} className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  From
                </label>
                <input
                  type="text"
                  list="city-options"
                  placeholder="Departure city"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-red-600 px-1 py-2 text-gray-800 font-medium focus:outline-none"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSwap}
                title="Swap cities"
                className="mt-5 shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-300 transition"
              >
                ⇄
              </button>

              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  To
                </label>
                <input
                  type="text"
                  list="city-options"
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-red-600 px-1 py-2 text-gray-800 font-medium focus:outline-none"
                  required
                />
              </div>
            </div>

            <datalist id="city-options">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            {/* dashed divider like a ticket perforation */}
            <div className="border-t border-dashed border-gray-300" />

            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">
                  Journey date
                </label>
                <input
                  type="date"
                  value={date}
                  min={todayPlus(0)}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-red-600 px-1 py-2 text-gray-800 font-medium focus:outline-none"
                  required
                />
              </div>

              <div className="flex gap-1.5 mt-5">
                <button
                  type="button"
                  onClick={() => setDate(todayPlus(0))}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 transition"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDate(todayPlus(1))}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600 transition"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-red-200"
            >
              Search Buses
            </button>
          </form>
        </div>
      </div>

      {/* ---- Listing ---- */}
      <div className="max-w-3xl mx-auto px-4 pt-14 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">All Available Buses</h2>

          <div className="flex gap-3">
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="All">All Types</option>
              <option value="AC">AC</option>
              <option value="Non_AC">Non-AC</option>
              <option value="Sleeper">Sleeper</option>
              <option value="Semi_Sleeper">Semi-Sleeper</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="departure">Earliest Departure</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && <div className="text-center py-10 text-gray-600">Loading buses...</div>}
        {error && <div className="text-center py-10 text-red-600">{error}</div>}
        {!loading && !error && displayedBuses.length === 0 && (
          <div className="text-center py-10 text-gray-600">No buses match your filters.</div>
        )}

        <div className="space-y-4">
          {displayedBuses.map((bus) => (
            <div
              key={bus.scheduleId}
              className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden"
            >
              <BusBanner busType={bus.bus?.busType} />

              <div className="flex justify-between items-center p-5">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;