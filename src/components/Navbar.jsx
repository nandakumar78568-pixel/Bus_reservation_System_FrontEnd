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
    <nav className="bg-blue-700 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">BusGo</Link>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/" className="hover:text-blue-200">Home</Link>
          {user && <Link to="/my-bookings" className="hover:text-blue-200">My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin" className="hover:text-blue-200">Admin</Link>}
          {user ? (
            <>
              <span className="text-blue-200 text-sm">Hi, {user.full_name}</span>
              <button onClick={handleLogout} className="bg-blue-900 px-3 py-1 rounded-lg hover:bg-blue-950">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/signup" className="hover:text-blue-200">Signup</Link>
            </>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 flex flex-col space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {user && <Link to="/my-bookings" onClick={() => setMenuOpen(false)}>My Bookings</Link>}
          {user?.role === "admin" && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
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
