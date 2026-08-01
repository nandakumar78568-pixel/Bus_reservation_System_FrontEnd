import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BusLogoIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-9 h-9 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* rounded badge background */}
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#FFFFFF" />
      <rect x="1" y="1" width="46" height="46" rx="12" fill="#FFF3E0" opacity="0.0" />

      {/* bus body */}
      <rect x="7" y="15" width="34" height="19" rx="5" fill="#FFC107" />

      {/* roof highlight */}
      <path d="M9 19 Q9 15 13 15 H35 Q39 15 39 19 V21 H9 Z" fill="#FFD54F" />

      {/* windshield / front window (front = right) */}
      <rect x="31" y="18" width="7" height="9" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />

      {/* passenger windows */}
      <rect x="11" y="18" width="6" height="9" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />
      <rect x="19" y="18" width="6" height="9" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />

      {/* red stripe */}
      <rect x="7" y="28" width="34" height="4" fill="#D6262C" />

      {/* door */}
      <rect x="26" y="28" width="4" height="6" fill="#37474F" opacity="0.5" />

      {/* headlight */}
      <circle cx="39.5" cy="30" r="1.6" fill="#FFF176" />

      {/* wheels */}
      <circle cx="15" cy="35" r="4" fill="#212121" />
      <circle cx="15" cy="35" r="1.6" fill="#B0BEC5" />
      <circle cx="33" cy="35" r="4" fill="#212121" />
      <circle cx="33" cy="35" r="1.6" fill="#B0BEC5" />

      {/* road/motion lines */}
      <line x1="2" y1="24" x2="6" y2="24" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <line x1="2" y1="28" x2="5" y2="28" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-[#D6262C] text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-display font-extrabold tracking-tight">
          <BusLogoIcon />
          <span>Go<span className="text-yellow-200">Bus</span></span>
        </Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="hover:text-red-100 transition">Home</Link>
          {user && <Link to="/my-bookings" className="hover:text-red-100 transition">My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin" className="hover:text-red-100 transition">Admin</Link>}
          {user?.role === "admin" && <Link to="/admin/points" className="hover:text-red-100 transition">Boarding Points</Link>}
          {user ? (
            <>
              <span className="text-red-100 text-sm">Hi, {user.fullName}</span>
              <button onClick={handleLogout} className="bg-[#8C1116] px-3 py-1.5 rounded-lg hover:bg-[#6f0d11] transition">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-red-100 transition">Login</Link>
              <Link
                to="/signup"
                className="bg-white text-[#D6262C] px-3 py-1.5 rounded-lg font-semibold hover:bg-red-50 transition"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user && <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user?.role === "admin" && <Link to="/admin/points" onClick={() => setMenuOpen(false)}>Boarding Points</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left">Logout</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;