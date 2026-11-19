import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import api from "./services/api";
import "./App.css";
import CitizenLayout from "./layouts/CitizenLayout";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import SubmitComplaint from "./pages/citizen/SubmitComplaint";
import MyComplaints from "./pages/citizen/MyComplaints";
import ComplaintDetails from "./pages/citizen/ComplaintDetails";
import OfficerLayout from "./layouts/OfficerLayout";
import OfficerDashboard from "./pages/officer/OfficerDashboard";
import AssignedComplaints from "./pages/officer/AssignedComplaints";
import OfficerComplaintDetails from "./pages/officer/OfficerComplaintDetails";
import OfficerProfile from "./pages/officer/OfficerProfile";

function HomePage() {
  const [backendStatus, setBackendStatus] = useState("CHECKING");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get("/health");

        setBackendStatus(response.data.status);
        setMessage(response.data.message);
      } catch (error) {
        console.error("Backend connection failed:", error);

        setBackendStatus("OFFLINE");
        setMessage("Unable to connect with JanSetu backend.");
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">J</span>
          <span>JanSetu</span>
        </div>

        <span className="brand-hindi">जनसेतु</span>
      </header>

      <main className="hero">
        <div className="hero-content">
          <span className="tagline">CONNECTING CITIZENS</span>

          <h1>
            Your City.
            <br />
            Your Voice.
            <br />
            <span>Our Responsibility.</span>
          </h1>

          <p>
            Report civic issues, track their progress, and help build a better
            community through JanSetu.
          </p>

          <button className="primary-btn">Explore JanSetu</button>
        </div>

        <div className="hero-card">
          <div className="card-icon">🏙️</div>

          <h2>Better Cities Start With You</h2>

          <p>
            From reporting potholes to tracking public infrastructure problems,
            make your voice count.
          </p>

          <div className="connection-status">
            <span
              className={`status-dot ${
                backendStatus === "UP"
                  ? "online"
                  : backendStatus === "CHECKING"
                    ? "checking"
                    : "offline"
              }`}
            />

            <strong>Backend: {backendStatus}</strong>
          </div>

          <p className="status-message">{message}</p>

          <div className="color-strip">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </main>

      <footer>
        © 2026 JanSetu. Connecting Citizens. Creating Better Communities.
      </footer>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["CITIZEN"]} />}>
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="submit-complaint" element={<SubmitComplaint />} />
            <Route path="complaints" element={<MyComplaints />} />
            <Route path="complaints/:id" element={<ComplaintDetails />} />
          </Route>
        </Route>

        {/* Officer Protected Routes */}
        {/* Officer Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={["OFFICER"]} />}>
          <Route path="/officer" element={<OfficerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<OfficerDashboard />} />

            <Route path="complaints" element={<AssignedComplaints />} />

            <Route
              path="complaints/:id"
              element={<OfficerComplaintDetails />}
            />

            <Route path="profile" element={<OfficerProfile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
