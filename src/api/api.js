const BASE_URL = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---------- Auth ----------
export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

// ---------- Buses / Seats ----------
export async function searchBuses(params) {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`${BASE_URL}/buses/search${query}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getSeats(scheduleId) {
  const res = await fetch(`${BASE_URL}/seats/${scheduleId}`);
  if (!res.ok) throw new Error("Failed to load seats");
  return res.json();
}

export async function getBoardingPoints(routeId) {
  const res = await fetch(`${BASE_URL}/routes/${routeId}/points`);
  if (!res.ok) throw new Error("Failed to load boarding points");
  return res.json();
}

// ---------- Seat Locking ----------
export async function lockSeat(scheduleId, seatId) {
  const res = await fetch(
    `${BASE_URL}/seat-locks?scheduleId=${scheduleId}&seatId=${seatId}`,
    { method: "POST", headers: authHeaders() }
  );
  if (!res.ok) {
    const message = await res.text().catch(() => "");
    const err = new Error(message || "Seat lock failed");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// ---------- Bookings ----------
export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}

export async function getMyBookings(userId) {
  const res = await fetch(`${BASE_URL}/bookings/user/${userId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load bookings");
  return res.json();
}

export async function cancelBooking(bookingId) {
  const res = await fetch(`${BASE_URL}/bookings/${bookingId}/cancel`, {
    method: "PUT",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Cancellation failed");
  return res.json();
}

// ---------- Reviews ----------
export async function getReviews(busId) {
  const res = await fetch(`${BASE_URL}/reviews/bus/${busId}`);
  if (!res.ok) throw new Error("Failed to load reviews");
  return res.json();
}

export async function addReview(data) {
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to submit review");
  return res.json();
}

// ---------- Admin ----------
export async function getAllBuses() {
  const res = await fetch(`${BASE_URL}/admin/buses`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load buses");
  return res.json();
}

export async function addBus(data) {
  const res = await fetch(`${BASE_URL}/admin/buses`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add bus");
  return res.json();
}

export async function deleteBus(busId) {
  const res = await fetch(`${BASE_URL}/admin/buses/${busId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete bus");
  return res.ok;
}
