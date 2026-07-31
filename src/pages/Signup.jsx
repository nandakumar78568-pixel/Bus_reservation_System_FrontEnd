import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api/api";

function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signupUser(form);
      navigate("/login");
    } catch (err) {
      setError("Signup failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] bg-[#FFF8F3]">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm space-y-4">
        <h2 className="font-display text-2xl font-bold text-gray-800">Create Account</h2>

        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

        <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D6262C]" required />

        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D6262C]" required />

        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D6262C]" required />

        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D6262C]" required />

        <button type="submit" disabled={loading}
          className="w-full bg-[#D6262C] text-white py-2 rounded-lg font-semibold hover:bg-[#B3201F] transition disabled:opacity-50">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;