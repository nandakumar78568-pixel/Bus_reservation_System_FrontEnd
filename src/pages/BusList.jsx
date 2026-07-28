import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { searchBuses } from "../api/api";

const busTypeStyles = {
  AC: { gradient: "from-sky-500 to-blue-600", emoji: "🚌" },
  Non_AC: { gradient: "from-amber-500 to-orange-600", emoji: "🚍" },
  Sleeper: { gradient: "from-purple-500 to-indigo-600", emoji: "🛌" },
  Semi_Sleeper: { gradient: "from-teal-500 to-emerald-600", emoji: "🚐" },
};

function BusBanner({ busType }) {
  const style = busTypeStyles[busType] || busTypeStyles.AC;
  return (
    <div className={`h-28 rounded-t-lg bg-gradient-to-r ${style.gradient} flex items-center justify-center text-5xl select-none`}>
      {style.emoji}
    </div>
  );
}

function BusList() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const source = searchParams.get("source");
    const destination = searchParams.get("destination");

    searchBuses(source && destination ? { source, destination } : undefined)
      .then(setBuses)
      .catch(() => setError("Failed to load buses. Try again."))
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) return <div className="text-center py-16 text-gray-600">Loading buses...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;
  if (buses.length === 0) return <div className="text-center py-16 text-gray-600">No buses found for this route.</div>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Available Buses</h2>

      {buses.map((bus) => (
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
  );
}

export default BusList;