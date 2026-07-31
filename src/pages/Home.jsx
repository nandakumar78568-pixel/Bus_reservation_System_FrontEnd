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

const OFFERS = [
  { code: "GOFIRST", text: "Flat ₹150 off on your first booking", tone: "bg-[#D6262C]" },
  { code: "WEEKEND75", text: "₹75 off on weekend getaways", tone: "bg-[#8C1116]" },
  { code: "SLEEPER10", text: "10% off on all sleeper buses", tone: "bg-[#B3221F]" },
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
    <div className="bg-[#FFF8F3] min-h-[80vh] font-sans">
      {/* ---- Hero ---- */}
      <div className="relative bg-gradient-to-br from-[#D6262C] via-[#C21F26] to-[#8C1116] pb-28 pt-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, white 0 24px, transparent 24px 48px)",
            backgroundPosition: "bottom 44px left 0",
            backgroundSize: "100% 4px",
            backgroundRepeat: "no-repeat",
          }}
        />

        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <p className="text-yellow-200 tracking-[0.2em] text-xs font-semibold uppercase mb-3">
            India's Trusted Bus Booking
          </p>
          <h1 className="font-display text-white text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
            Where's your next ride?
          </h1>
          <p className="text-red-100 text-sm md:text-base">
            Compare buses, pick your seat, travel your way — every time.
          </p>
        </div>

        <div className="max-w-3xl mx-auto px-4 mt-7 flex flex-wrap justify-center gap-2 relative">
          {POPULAR_ROUTES.map((r) => (
            <button
              key={`${r.source}-${r.destination}`}
              onClick={() => handleRouteChip(r)}
              className="bg-white/15 hover:bg-white/25 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/30 transition backdrop-blur-sm"
            >
              {r.source} → {r.destination}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Ticket-stub search card ---- */}
      <div className="max-w-2xl mx-auto px-4 -mt-16 relative z-10">
        <div className="relative bg-white rounded-2xl shadow-2xl">
          <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FFF8F3] rounded-full" />
          <span className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#FFF8F3] rounded-full" />

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
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-[#D6262C] px-1 py-2 text-gray-800 font-semibold focus:outline-none transition"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSwap}
                title="Swap cities"
                className="mt-5 shrink-0 w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D6262C] hover:border-red-300 transition"
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
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-[#D6262C] px-1 py-2 text-gray-800 font-semibold focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <datalist id="city-options">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

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
                  className="w-full border-0 border-b-2 border-gray-200 focus:border-[#D6262C] px-1 py-2 text-gray-800 font-semibold focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex gap-1.5 mt-5">
                <button
                  type="button"
                  onClick={() => setDate(todayPlus(0))}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-[#D6262C] transition"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setDate(todayPlus(1))}
                  className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:border-red-300 hover:text-[#D6262C] transition"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#D6262C] hover:bg-[#B3201F] text-white font-display font-bold py-3 rounded-xl transition shadow-md shadow-red-200"
            >
              Search Buses
            </button>
          </form>
        </div>
      </div>

      {/* ---- Trust strip ---- */}
      <div className="max-w-3xl mx-auto px-4 mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "🎫", label: "Live seat selection", sub: "No overbooked surprises" },
          { icon: "↩️", label: "Easy cancellations", sub: "Refunds processed fast" },
          { icon: "🛡️", label: "Verified operators", sub: "Every bus, every seat" },
        ].map((item) => (
          <div key={item.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
              <p className="text-gray-500 text-xs">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---- Offers strip ---- */}
      <div className="max-w-3xl mx-auto px-4 mt-10">
        <h3 className="font-display font-bold text-gray-800 mb-3">Offers for you</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {OFFERS.map((offer) => (
            <div
              key={offer.code}
              className={`${offer.tone} text-white rounded-xl p-4 min-w-[220px] shrink-0 relative overflow-hidden`}
            >
              <p className="text-xs font-bold tracking-wide bg-white/20 inline-block px-2 py-0.5 rounded mb-2">
                {offer.code}
              </p>
              <p className="text-sm font-medium leading-snug">{offer.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---- Listing ---- */}
      <div className="max-w-3xl mx-auto px-4 pt-10 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="font-display text-2xl font-bold text-gray-800">All Available Buses</h2>

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
                  <h3 className="font-bold text-lg text-gray-800">
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
                  <p className="text-[#D6262C] font-bold text-lg">₹{bus.fare}</p>
                  <button
                    onClick={() =>
                      navigate(`/seats/${bus.scheduleId}`, {
                        state: { routeId: bus.route?.routeId },
                      })
                    }
                    className="mt-2 bg-[#D6262C] text-white px-4 py-2 rounded-lg hover:bg-[#B3201F] transition"
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