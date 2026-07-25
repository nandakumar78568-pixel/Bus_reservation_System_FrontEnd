# Bus Reservation System — React + Tailwind Frontend

## Structure
```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx           (entry point)
    ├── App.jsx             (routes)
    ├── index.css            (Tailwind directives)
    ├── api/api.js            (centralized API calls, attaches JWT token)
    ├── context/AuthContext.jsx
    ├── components/
    │   ├── Navbar.jsx
    │   └── ProtectedRoute.jsx
    └── pages/
        ├── Home.jsx
        ├── BusList.jsx
        ├── SeatSelection.jsx
        ├── BookingForm.jsx
        ├── BookingConfirmation.jsx
        ├── MyBookings.jsx
        ├── Login.jsx
        ├── Signup.jsx
        └── AdminDashboard.jsx
```

## Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend will start on **http://localhost:5173**.

## Before running
Make sure the Spring Boot backend is already running on **http://localhost:5000** — this frontend calls it directly (see `BASE_URL` in `src/api/api.js`). If your backend runs on a different port, update that constant.

## Notes
- JWT token is stored in `localStorage` after login and automatically attached as `Authorization: Bearer <token>` on every protected API call (bookings, cancellations, admin routes, seat locks).
- `SeatSelection.jsx` calls the seat-lock endpoint the moment a seat is clicked, giving the user a 5-minute hold before someone else can grab the same seat.
- `BookingConfirmation.jsx` expects the structured booking object the backend now returns directly after `POST /api/bookings` (bus, route, seats, fare) — no extra fetch needed.
- Full user flow: Signup → Login → Search → Select Seats → Passenger Details → Confirmation → My Bookings. Admin flow: Login (as admin) → Admin Dashboard → Add/Delete Buses.
