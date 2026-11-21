import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

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
        <Link to="/" aria-label="GoBus home">
          <Logo />
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