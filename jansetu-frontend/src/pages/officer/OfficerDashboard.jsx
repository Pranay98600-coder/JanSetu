
import { useEffect, useState } from "react";
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Activity,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";

function OfficerDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user") || "null");

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/officer/complaints");

      // Backend currently returns the officer's assigned complaint list.
      const data = response.data;
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Officer dashboard API error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load your complaint statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const stats = [
    {
      title: "Assigned Complaints",
      value: complaints.length,
      icon: ClipboardList,
      color: "blue",
    },
    {
      title: "In Progress",
      value: complaints.filter(
        (c) => c.status === "IN_PROGRESS"
      ).length,
      icon: Activity,
      color: "orange",
    },
    {
      title: "Resolved",
      value: complaints.filter(
        (c) => c.status === "RESOLVED"
      ).length,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Pending Action",
      value: complaints.filter(
        (c) => c.status === "ASSIGNED"
      ).length,
      icon: Clock,
      color: "purple",
    },
  ];

  return (
    <div className="officer-dashboard">
      <div className="officer-welcome">
        <div>
          <span className="officer-dashboard-tag">
            OFFICER DASHBOARD
          </span>

          <h1>
            Welcome, {user?.fullName || "Officer"}!
          </h1>

          <p>
            Monitor your assigned complaints, update their progress,
            and help resolve civic issues in your area.
          </p>
        </div>
      </div>

      <div className="officer-dashboard-actions">
        <h2>Dashboard Overview</h2>

        <button
          type="button"
          onClick={fetchComplaints}
          disabled={loading}
          className="officer-refresh-btn"
        >
          <RefreshCw size={16} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="officer-dashboard-error">
          {error}
        </div>
      )}

      <div className="officer-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div className="officer-stat-card" key={stat.title}>
              <div className={`officer-stat-icon ${stat.color}`}>
                <Icon size={23} />
              </div>

              <div>
                <p>{stat.title}</p>
                <h2>{loading ? "..." : stat.value}</h2>
              </div>
            </div>
          );
        })}
      </div>

      <div className="officer-dashboard-info">
        <h2>Your Responsibilities</h2>

        <div className="officer-responsibility-grid">
          <div>
            <span>01</span>
            <h3>Review Complaints</h3>
            <p>Check the complaints assigned to you.</p>
          </div>

          <div>
            <span>02</span>
            <h3>Take Action</h3>
            <p>Update the complaint status as work progresses.</p>
          </div>

          <div>
            <span>03</span>
            <h3>Submit Evidence</h3>
            <p>Upload photos and details after resolving an issue.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OfficerDashboard;
