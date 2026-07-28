const BASE_URL = "http://localhost:5000/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Call this after any authenticated fetch to handle expired/invalid tokens
// consistently. Throws with the real backend message when available.
async function handleAuthFailure(res, fallbackMessage) {
  let message = fallbackMessage;
  try {
    const body = await res.json();
    if (body?.error) message = body.error;
  } catch {
    try {
      const text = await res.text();
      if (text) message = text;
    } catch {
      // no body
    }
  }

  if (res.status === 401) {
    // Token is dead — clear it and force the app back to login.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new CustomEvent("auth-expired", { detail: message }));
  }

  const err = new Error(message);
  err.status = res.status;
  throw err;
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
  const res = await fetch(`${BASE_URL}/seats/${scheduleId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    // Surface the backend's actual message (e.g. "Schedule not found")
    // instead of a generic string, so failures are debuggable.
    let message = "Failed to load seats";
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
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
  // Backend returns a plain-text confirmation ("Seat locked for 5 minutes"),
  // not JSON — res.json() would throw a SyntaxError here even on success.
  return res.text();
}

export async function unlockSeat(scheduleId, seatId) {
  const res = await fetch(
    `${BASE_URL}/seat-locks?scheduleId=${scheduleId}&seatId=${seatId}`,
    { method: "DELETE", headers: authHeaders() }
  );
  if (!res.ok) {
    // Non-fatal — lock will expire on its own in 5 min either way
    console.warn("Failed to release seat lock");
  }
}

// ---------- Bookings ----------
export async function createBooking(data) {
  const res = await fetch(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || "Booking failed");
  }
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
  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || "Cancellation failed");
  }
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
  if (!res.ok) {
    const message = await res.text().catch(() => "");
    throw new Error(message || "Failed to submit review");
  }
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

// ---------- Admin: Boarding Points ----------
export async function getPointsByRoute(routeId) {
  const res = await fetch(`${BASE_URL}/admin/boarding-points/route/${routeId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load points");
  return res.json();
}

export async function addBoardingPoint(data) {
  const res = await fetch(`${BASE_URL}/admin/boarding-points`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add point");
  return res.json();
}

export async function deleteBoardingPoint(pointId) {
  const res = await fetch(`${BASE_URL}/admin/boarding-points/${pointId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete point");
  return res.ok;
}

export async function getAllRoutes() {
  const res = await fetch(`${BASE_URL}/admin/routes`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to load routes");
  return res.json();
}
export async function getCities() {
  const res = await fetch(`${BASE_URL}/routes/cities`);
  if (!res.ok) throw new Error("Failed to load cities");
  return res.json();
}