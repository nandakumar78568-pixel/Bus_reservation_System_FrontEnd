import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { searchBuses, getCities } from "../api/api";
import BusBanner from "../components/BusBanner";

const POPULAR_ROUTES = [
  { source: "Chennai", destination: "Bangalore", emoji: "🏙️" },
  { source: "Bangalore", destination: "Hyderabad", emoji: "💻" },
  { source: "Delhi", destination: "Jaipur", emoji: "🏰" },
  { source: "Mumbai", destination: "Pune", emoji: "🌆" },
];

const OFFERS = [
  { code: "GOFIRST", text: "Flat ₹150 off on your first booking", gradient: "from-[#D6262C] to-[#8C1116]", icon: "🎉" },
  { code: "WEEKEND75", text: "₹75 off on weekend getaways", gradient: "from-[#7C3AED] to-[#4C1D95]", icon: "🌴" },
  { code: "SLEEPER10", text: "10% off on all sleeper buses", gradient: "from-[#0EA5E9] to-[#0369A1]", icon: "🌙" },
];

const FEATURES = [
  { icon: "🎫", title: "Live seat selection", sub: "Pick your exact seat with a 5-minute hold — no overbooked surprises." },
  { icon: "↩️", title: "Easy cancellations", sub: "Cancel in one tap and get your refund processed quickly." },
  { icon: "🛡️", title: "Verified operators", sub: "Every bus and every seat is checked for a safe, comfy ride." },
  { icon: "💸", title: "Best price offers", sub: "Coupons and festive deals applied right at checkout." },
];

const STATS = [
  { value: "10K+", label: "Happy travellers" },
  { value: "200+", label: "Routes covered" },
  { value: "50+", label: "Bus operators" },
];

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function formatDateTime(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d)) return value;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(dep, arr) {
  if (!dep || !arr) return null;
  const mins = Math.round((new Date(arr) - new Date(dep)) / 60000);
  if (!mins || mins <= 0) return null;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
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
  const [cities, setCities] = useState([]);
  const [copied, setCopied] = useState("");
  const navigate = useNavigate();

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

  const copyCode = (code) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopied(code);
    setTimeout(() => setCopied(""), 1800);
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
    <div className="bg-[#FFF8F3] min-h-[80vh]">
      {/* ================= HERO ================= */}
      <section className="relative bg-gradient-to-br from-[#E0262D] via-[#B71C22] to-[#6E0C11] pt-16 pb-40 overflow-hidden">
        {/* glowing blobs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-yellow-300/30 blur-3xl animate-blob" />
        <div className="absolute top-10 -right-24 w-96 h-96 rounded-full bg-pink-500/30 blur-3xl animate-blob [animation-delay:3s]" />
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(white 1.2px, transparent 1.2px)", backgroundSize: "26px 26px" }} />

        <div className="relative max-w-4xl mx-auto px-4 text-center animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/25 text-yellow-200 text-xs font-semibold tracking-[0.18em] uppercase px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            India's Trusted Bus Booking
          </span>

          <h1 className="font-display text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4">
            Where's your{" "}
            <span className="bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              next ride?
            </span>
          </h1>
          <p className="text-red-100 text-base md:text-lg max-w-xl mx-auto">
            Compare buses, pick your seat and travel your way — every single time.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-2">
            {POPULAR_ROUTES.map((r) => (
              <button
                key={`${r.source}-${r.destination}`}
                onClick={() => handleRouteChip(r)}
                className="bg-white/15 hover:bg-white hover:text-[#D6262C] text-white text-xs font-semibold px-4 py-2 rounded-full border border-white/30 transition backdrop-blur-sm"
              >
                {r.source} → {r.destination}
              </button>
            ))}
          </div>
        </div>

        {/* road + driving bus */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/25">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-white/40" />
          <div className="absolute -top-6 text-4xl animate-drive select-none">🚌</div>
        </div>
      </section>

      {/* ================= SEARCH CARD ================= */}
      <section className="max-w-3xl mx-auto px-4 -mt-28 relative z-10">
        <div className="glass rounded-3xl shadow-2xl shadow-red-900/20 p-6 md:p-8">
          <form onSubmit={handleSearch} className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-end gap-3">
              <div className="flex-1">
                <label className="field-label">📍 From</label>
                <input
                  type="text"
                  list="city-options"
                  placeholder="Departure city"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="field-input"
                  required
                />
              </div>

              <button
                type="button"
                onClick={handleSwap}
                title="Swap cities"
                className="self-center md:self-end shrink-0 w-11 h-11 rounded-full bg-[#D6262C] text-white text-lg flex items-center justify-center shadow-md hover:rotate-180 hover:bg-[#B3201F] transition duration-500"
              >
                ⇄
              </button>

              <div className="flex-1">
                <label className="field-label">🏁 To</label>
                <input
                  type="text"
                  list="city-options"
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="field-input"
                  required
                />
              </div>
            </div>

            <datalist id="city-options">
              {cities.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>

            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <label className="field-label">📅 Journey date</label>
                <input
                  type="date"
                  value={date}
                  min={todayPlus(0)}
                  onChange={(e) => setDate(e.target.value)}
                  className="field-input"
                  required
                />
              </div>

              <div className="flex gap-2">
                {[
                  { label: "Today", d: 0 },
                  { label: "Tomorrow", d: 1 },
                ].map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => setDate(todayPlus(q.d))}
                    className={`text-sm font-medium px-4 py-2.5 rounded-xl border transition ${
                      date === todayPlus(q.d)
                        ? "bg-[#D6262C] text-white border-[#D6262C]"
                        : "border-gray-200 text-gray-600 hover:border-[#D6262C] hover:text-[#D6262C]"
                    }`}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#D6262C] to-[#A5161C] hover:from-[#B3201F] hover:to-[#8C1116] text-white font-display font-bold text-lg py-3.5 rounded-xl shadow-lg shadow-red-300 hover:-translate-y-0.5 active:translate-y-0 transition"
            >
              🔍 Search Buses
            </button>
          </form>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center bg-white rounded-2xl border border-gray-100 shadow-sm py-4">
              <p className="font-display text-2xl font-extrabold text-[#D6262C]">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= POPULAR ROUTES ================= */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h3 className="font-display text-2xl font-bold text-gray-800">Popular routes</h3>
        <p className="text-sm text-gray-500 mb-5">Tap a route to see buses instantly</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POPULAR_ROUTES.map((r) => (
            <button
              key={`card-${r.source}-${r.destination}`}
              onClick={() => handleRouteChip(r)}
              className="group text-left bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-red-200 transition"
            >
              <span className="text-3xl block mb-3 group-hover:scale-110 transition">{r.emoji}</span>
              <p className="font-semibold text-gray-800">{r.source}</p>
              <p className="text-[#D6262C] text-sm font-medium">
                to {r.destination} <span className="inline-block group-hover:translate-x-1 transition">→</span>
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* ================= OFFERS ================= */}
      <section className="max-w-5xl mx-auto px-4 mt-16">
        <h3 className="font-display text-2xl font-bold text-gray-800">Offers for you</h3>
        <p className="text-sm text-gray-500 mb-5">Tap a code to copy it, then use it at checkout</p>

        <div className="flex gap-4 overflow-x-auto pb-3 snap-x">
          {OFFERS.map((offer) => (
            <button
              key={offer.code}
              onClick={() => copyCode(offer.code)}
              className={`snap-start text-left bg-gradient-to-br ${offer.gradient} text-white rounded-2xl p-5 min-w-[260px] shrink-0 relative overflow-hidden shadow-lg hover:-translate-y-1 transition`}
            >
              <span className="absolute -right-4 -top-4 text-7xl opacity-20">{offer.icon}</span>
              <p className="text-sm font-medium leading-snug mb-4 pr-10">{offer.text}</p>
              <div className="inline-flex items-center gap-2 border-2 border-dashed border-white/60 rounded-lg px-3 py-1.5">
                <span className="font-display font-bold tracking-widest text-sm">{offer.code}</span>
                <span className="text-[11px] bg-white/25 rounded px-1.5 py-0.5">
                  {copied === offer.code ? "Copied ✓" : "Copy"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ================= LISTING ================= */}
      <section className="max-w-4xl mx-auto px-4 pt-16" id="buses">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800">All Available Buses</h2>
            <p className="text-sm text-gray-500">{displayedBuses.length} bus(es) found</p>
          </div>

          <div className="flex gap-3">
            <select
              value={busType}
              onChange={(e) => setBusType(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:border-[#D6262C]"
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
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:border-[#D6262C]"
            >
              <option value="departure">Earliest Departure</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-white border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}
        {error && <div className="text-center py-10 text-red-600 bg-red-50 rounded-2xl">{error}</div>}
        {!loading && !error && displayedBuses.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-dashed border-gray-300">
            🚌 No buses match your filters.
          </div>
        )}

        <div className="space-y-5">
          {displayedBuses.map((bus) => {
            const duration = formatDuration(bus.departureTime, bus.arrivalTime);
            return (
              <div
                key={bus.scheduleId}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition overflow-hidden md:flex"
              >
                <BusBanner busType={bus.bus?.busType} className="h-32 md:h-auto md:w-56 md:min-h-[150px] md:shrink-0" />

                <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-bold text-lg text-gray-800">{bus.bus?.busNumber}</h3>
                      <span className="text-[11px] font-semibold bg-red-50 text-[#D6262C] px-2 py-0.5 rounded-full">
                        {bus.bus?.busType?.replace("_", "-")}
                      </span>
                    </div>

                    {bus.bus?.operatorName && (
                      <p className="text-xs text-gray-400">by {bus.bus.operatorName}</p>
                    )}

                    <p className="text-gray-700 font-medium text-sm">
                      {bus.route?.source} <span className="text-[#D6262C]">→</span> {bus.route?.destination}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span className="bg-gray-100 rounded-lg px-2 py-1">🕒 Dep {formatDateTime(bus.departureTime)}</span>
                      {bus.arrivalTime && (
                        <span className="bg-gray-100 rounded-lg px-2 py-1">🏁 Arr {formatDateTime(bus.arrivalTime)}</span>
                      )}
                      {duration && <span className="bg-yellow-50 text-yellow-700 rounded-lg px-2 py-1">⏱ {duration}</span>}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <p className="text-[11px] text-gray-400 uppercase tracking-wide">Starts at</p>
                    <p className="text-[#D6262C] font-display font-extrabold text-2xl">₹{bus.fare}</p>
                    <button
                      onClick={() =>
                        navigate(`/seats/${bus.scheduleId}`, {
                          state: { routeId: bus.route?.routeId },
                        })
                      }
                      className="mt-2 w-full sm:w-auto bg-gradient-to-r from-[#D6262C] to-[#A5161C] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-red-200 hover:shadow-lg hover:-translate-y-0.5 transition"
                    >
                      Select Seats
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= WHY GOBUS ================= */}
      <section className="max-w-5xl mx-auto px-4 mt-20">
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-800">Why travel with GoBus?</h3>
          <p className="text-sm text-gray-500 mt-1">Everything you need for a smooth journey</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition text-center"
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center text-2xl">
                {f.icon}
              </div>
              <p className="font-semibold text-gray-800 mb-1">{f.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="mt-20 bg-gradient-to-br from-[#8C1116] to-[#4A0709] text-red-100">
        <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-extrabold text-white">
              Go<span className="text-yellow-300">Bus</span>
            </p>
            <p className="text-red-200/80 text-xs mt-1">Book smart. Travel happy.</p>
          </div>
          <p className="text-xs text-red-200/70">© {new Date().getFullYear()} GoBus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;