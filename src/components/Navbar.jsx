import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
        <Link to="/" className="flex items-center gap-1.5 text-xl font-display font-extrabold tracking-tight">
          <span className="text-2xl">🚌</span>
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