import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BusLogoIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10 shrink-0 drop-shadow" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="46" height="46" rx="14" fill="#FFFFFF" />
      <path d="M6 30 A18 18 0 0 1 24 8" fill="none" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M4 24 A20 20 0 0 1 24 4" fill="none" stroke="#D6262C" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
      <rect x="8" y="17" width="33" height="18" rx="5" fill="#FFC107" />
      <path d="M10 21 Q10 17 14 17 H35 Q39 17 39 21 V23 H10 Z" fill="#FFD54F" />
      <rect x="31" y="20" width="7" height="8.5" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />
      <rect x="12" y="20" width="6" height="8.5" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />
      <rect x="20" y="20" width="6" height="8.5" rx="2" fill="#BBDEFB" stroke="#0D47A1" strokeWidth="1" />
      <rect x="8" y="30" width="33" height="4" fill="#D6262C" />
      <rect x="27" y="30" width="4" height="6" fill="#37474F" opacity="0.5" />
      <circle cx="39.5" cy="32" r="1.6" fill="#FFF176" />
      <circle cx="16" cy="37" r="4" fill="#212121" />
      <circle cx="16" cy="37" r="1.6" fill="#B0BEC5" />
      <circle cx="33" cy="37" r="4" fill="#212121" />
      <circle cx="33" cy="37" r="1.6" fill="#B0BEC5" />
    </svg>
  );
}

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg transition ${
      isActive ? "bg-white/20 text-white" : "text-red-100 hover:text-white hover:bg-white/10"
    }`;

  const initial = user?.fullName?.trim()?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#D6262C]/95 via-[#C21F26]/95 to-[#A5161C]/95 backdrop-blur-md text-white shadow-lg shadow-red-900/20">
      <div className="max-w-6xl mx-auto px-5 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-display font-extrabold tracking-tight">
          <BusLogoIcon />
          <span>
            Go<span className="text-yellow-300">Bus</span>
          </span>
        </Link>

        <button
          className="md:hidden w-10 h-10 rounded-lg bg-white/15 hover:bg-white/25 transition text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          {user && <NavLink to="/my-bookings" className={linkClass}>My Bookings</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin" end className={linkClass}>Admin</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin/points" className={linkClass}>Boarding Points</NavLink>}

          <div className="w-px h-6 bg-white/25 mx-3" />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/15 rounded-full pl-1 pr-3 py-1">
                <span className="w-7 h-7 rounded-full bg-yellow-300 text-[#8C1116] font-bold text-sm flex items-center justify-center">
                  {initial}
                </span>
                <span className="text-sm font-medium">{user.fullName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-[#8C1116] hover:bg-[#6f0d11] px-4 py-2 rounded-full text-sm font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium hover:bg-white/10 rounded-full transition">
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-yellow-300 text-[#8C1116] px-5 py-2 rounded-full text-sm font-bold hover:bg-yellow-200 shadow transition"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-1 text-sm">
          <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user && <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {user?.role === "admin" && <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user?.role === "admin" && <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/admin/points" onClick={() => setMenuOpen(false)}>Boarding Points</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-left px-3 py-2 rounded-lg hover:bg-white/10">
              Logout ({user.fullName})
            </button>
          ) : (
            <>
              <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="px-3 py-2 rounded-lg hover:bg-white/10" to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
