import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSeats, lockSeat, unlockSeat } from "../api/api";

function SeatSelection() {
  const { scheduleId } = useParams();
  const { state } = useLocation();
  const routeId = state?.routeId;
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [lockError, setLockError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSeats(scheduleId).then((data) => setSeats(data));
  }, [scheduleId]);

  const toggleSeat = async (seat) => {
    if (seat.booked || (seat.locked && !selected.includes(seat.seat_id))) return;
    setLockError("");

    const alreadySelected = selected.includes(seat.seat_id);

    if (!alreadySelected) {
      try {
        await lockSeat(scheduleId, seat.seat_id);
      } catch (err) {
        const message = err.status === 400
          ? `Seat ${seat.seat_number} is currently locked by another user. Try a different seat.`
          : `Couldn't lock seat ${seat.seat_number}. Please try again.`;
        setLockError(message);
        getSeats(scheduleId).then(setSeats); // refresh lock state
        return;
      }
    } else {
      unlockSeat(scheduleId, seat.seat_id); // fire and forget
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-semibold mb-6">Select Your Seats</h2>

      {lockError && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded mb-4">{lockError}</p>
      )}

      <div className="grid grid-cols-5 gap-3 mb-6">
        {seats.map((seat) => {
          const isSelected = selected.includes(seat.seat_id);
          const isUnavailable = seat.booked || (seat.locked && !isSelected);
          return (
            <button
              key={seat.seat_id}
              onClick={() => toggleSeat(seat)}
              disabled={isUnavailable}
              title={seat.locked && !seat.booked && !isSelected ? "Locked by another user" : ""}
              className={`py-3 rounded-lg text-sm font-medium border transition
                ${seat.booked
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : seat.locked && !isSelected
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300 cursor-not-allowed"
                  : isSelected
                  ? "bg-blue-700 text-white border-blue-700"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                }`}
            >
              {seat.seat_number}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-600">{selected.length} seat(s) selected</p>
        <button
          onClick={handleContinue}
          disabled={selected.length === 0}
          className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default SeatSelection;