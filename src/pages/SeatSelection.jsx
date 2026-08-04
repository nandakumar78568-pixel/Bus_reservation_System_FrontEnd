import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { getSeats, lockSeat, unlockSeat, getScheduleById } from "../api/api";

function SeatPersonIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <circle cx="12" cy="7" r="3.2" />
      <path d="M12 12c-4.2 0-7.5 2.3-7.5 5.2V19h15v-1.8c0-2.9-3.3-5.2-7.5-5.2z" />
    </svg>
  );
}

function SteeringIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 5.5v3M12 15.5v3M6 9l3 2M18 9l-3 2M6 15l3-2M18 15l-3-2" />
    </svg>
  );
}

function SeatSelection() {
  const { scheduleId } = useParams();
  const { state } = useLocation();
  const routeId = state?.routeId;

  const [seats, setSeats] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [lockError, setLockError] = useState("");
  const [busType, setBusType] = useState(null);
  const [fare, setFare] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getSeats(scheduleId)
      .then((data) => {
        setSeats(data);
        setSelected(data.filter((s) => s.locked_by_me).map((s) => s.seat_id));
      })
      .catch((err) => {
        console.error("getSeats failed:", err);
        setError(
          err.status === 404
            ? "This bus schedule no longer exists. Please search again."
            : err.message || "Failed to load seats. Please try again."
        );
      })
      .finally(() => setLoading(false));
  }, [scheduleId]);

  useEffect(() => {
    getScheduleById(scheduleId)
      .then((data) => {
        setBusType(data.bus?.busType || null);
        setFare(data.fare ?? null);
      })
      .catch(() => {
        // Non-fatal — falls back to the standard seater layout if we can't tell.
      });
  }, [scheduleId]);

  const toggleSeat = async (seat) => {
    if (seat.booked || (seat.locked && !selected.includes(seat.seat_id))) return;
    setLockError("");

    const alreadySelected = selected.includes(seat.seat_id);

    if (!alreadySelected) {
      try {
        await lockSeat(scheduleId, seat.seat_id);
      } catch (err) {
        if (err.status === 401) {
          setLockError("Your session has expired. Please log in again.");
          return;
        }
        const message = err.status === 400
          ? `Seat ${seat.seat_number} is currently locked by another user. Try a different seat.`
          : `Couldn't lock seat ${seat.seat_number}. Please try again.`;
        setLockError(message);
        getSeats(scheduleId).then(setSeats).catch(() => {});
        return;
      }
    } else {
      unlockSeat(scheduleId, seat.seat_id);
    }

    setSelected((prev) =>
      alreadySelected
        ? prev.filter((id) => id !== seat.seat_id)
        : [...prev, seat.seat_id]
    );
  };

  const handleContinue = () => {
    navigate("/booking", { state: { scheduleId, routeId, selected } });
  };

  const isSleeper = busType === "Sleeper" || busType === "Semi_Sleeper";

  // ---------- Seater (AC / Non_AC) helpers ----------
  const rows = [];
  for (let i = 0; i < seats.length; i += 4) {
    rows.push(seats.slice(i, i + 4));
  }

  const seatClass = (seat, isSelected) => {
    if (seat.booked) return "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed";
    if (seat.locked && !isSelected) return "bg-yellow-100 text-yellow-700 border-yellow-300 cursor-not-allowed";
    if (isSelected) return "bg-green-600 text-white border-green-600";
    return "bg-white text-gray-700 border-gray-300 hover:border-[#D6262C]";
  };

  // ---------- Sleeper / Semi-Sleeper helpers ----------
  const berthClass = (seat, isSelected) => {
    if (seat.booked) return "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed";
    if (seat.locked && !isSelected) return "bg-yellow-50 text-yellow-700 border-yellow-300 cursor-not-allowed";
    if (isSelected) return "bg-[#D6262C]/10 text-[#D6262C] border-[#D6262C]";
    return "bg-white text-gray-600 border-gray-200 hover:border-[#D6262C]";
  };

  const half = Math.ceil(seats.length / 2);
  const lowerDeck = seats.slice(0, half);
  const upperDeck = seats.slice(half);

  const SleeperBerth = ({ seat }) => {
    const isSelected = selected.includes(seat.seat_id);
    return (
      <button
        onClick={() => toggleSeat(seat)}
        disabled={seat.booked || (seat.locked && !isSelected)}
        title={seat.locked && !seat.booked && !isSelected ? "Locked by another user" : ""}
        className={`flex flex-col items-center justify-center gap-1 h-20 w-16 rounded-xl border-2 text-[10px] font-semibold transition ${berthClass(seat, isSelected)}`}
      >
        <SeatPersonIcon className="w-5 h-5" />
        <span>{seat.booked ? "Sold" : seat.seat_number}</span>
        {!seat.booked && fare != null && (
          <span className="text-[9px] font-normal opacity-70">₹{fare}</span>
        )}
      </button>
    );
  };

  const SleeperDeck = ({ title, deckSeats, showWheel }) => (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-gray-700 text-sm">{title}</h4>
        {showWheel && (
          <div className="w-7 h-7 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">
            <SteeringIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-3 gap-3 justify-items-center">
        {deckSeats.map((seat) => (
          <SleeperBerth key={seat.seat_id} seat={seat} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 pb-28 bg-[#FFF8F3] min-h-[80vh]">
      <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Select Your Seats</h2>
      <p className="text-sm text-gray-500 mb-6">Tap a seat to select</p>

      {loading && <p className="text-gray-500 mb-4">Loading seats...</p>}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded mb-4">
          <p className="mb-2">{error}</p>
          <Link to="/" className="text-[#D6262C] hover:underline font-medium">
            ← Back to bus search
          </Link>
        </div>
      )}

      {!loading && !error && seats.length === 0 && (
        <p className="text-gray-500 mb-4">No seats found for this bus. Contact admin.</p>
      )}
      {lockError && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{lockError}</p>
      )}

      {seats.length > 0 && !isSleeper && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap gap-4 justify-center mb-6 text-xs text-gray-600">
            <LegendItem colorClass="bg-white border-gray-300" label="Available" />
            <LegendItem colorClass="bg-green-600 border-green-600" label="Selected" />
            <LegendItem colorClass="bg-yellow-100 border-yellow-300" label="Locked" />
            <LegendItem colorClass="bg-gray-300 border-gray-300" label="Booked" />
          </div>

          <div className="flex justify-end pr-2 mb-3">
            <div className="w-8 h-8 rounded-full border-4 border-gray-300 flex items-center justify-center text-gray-400 text-xs">
              🚌
            </div>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl px-4 py-6 bg-gray-50">
            <div className="flex flex-col gap-3 items-center">
              {rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {row.slice(0, 2).map((seat) => {
                      const isSelected = selected.includes(seat.seat_id);
                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.booked || (seat.locked && !isSelected)}
                          title={seat.locked && !seat.booked && !isSelected ? "Locked by another user" : ""}
                          className={`w-12 h-12 rounded-lg text-xs font-semibold border transition ${seatClass(seat, isSelected)}`}
                        >
                          {seat.seat_number}
                        </button>
                      );
                    })}
                  </div>

                  <div className="w-8" />

                  <div className="flex gap-2">
                    {row.slice(2, 4).map((seat) => {
                      const isSelected = selected.includes(seat.seat_id);
                      return (
                        <button
                          key={seat.seat_id}
                          onClick={() => toggleSeat(seat)}
                          disabled={seat.booked || (seat.locked && !isSelected)}
                          title={seat.locked && !seat.booked && !isSelected ? "Locked by another user" : ""}
                          className={`w-12 h-12 rounded-lg text-xs font-semibold border transition ${seatClass(seat, isSelected)}`}
                        >
                          {seat.seat_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {seats.length > 0 && isSleeper && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex flex-wrap gap-4 justify-center mb-6 text-xs text-gray-600">
            <LegendItem colorClass="bg-white border-gray-200" label="Available" />
            <LegendItem colorClass="bg-[#D6262C]/10 border-[#D6262C]" label="Selected" />
            <LegendItem colorClass="bg-yellow-50 border-yellow-300" label="Locked" />
            <LegendItem colorClass="bg-gray-200 border-gray-200" label="Sold" />
          </div>

          <div className="border-2 border-gray-200 rounded-2xl px-4 py-6 bg-gray-50 flex gap-8">
            <SleeperDeck title="Lower Deck" deckSeats={lowerDeck} showWheel />
            <SleeperDeck title="Upper Deck" deckSeats={upperDeck} />
          </div>
        </div>
      )}

      {seats.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Seats selected</p>
              <p className="font-semibold text-gray-800">
                {selected.length > 0
                  ? seats.filter((s) => selected.includes(s.seat_id)).map((s) => s.seat_number).join(", ")
                  : "None"}
              </p>
            </div>
            <button
              onClick={handleContinue}
              disabled={selected.length === 0}
              className="bg-[#D6262C] text-white px-6 py-2 rounded-lg hover:bg-[#B3201F] transition disabled:opacity-50"
            >
              Continue ({selected.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ colorClass, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-4 h-4 rounded border ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}

export default SeatSelection;