
import { useEffect, useState } from "react";
import { RefreshCw, Search, Eye, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function AssignedComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/officer/complaints");

      if (Array.isArray(response.data)) {
        setComplaints(response.data);
      } else {
        setComplaints([]);
        setError("Unexpected complaint data received from the server.");
      }
    } catch (err) {
      console.error("Failed to load assigned complaints:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load assigned complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((complaint) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchText) ||
      complaint.complaintNumber?.toLowerCase().includes(searchText) ||
      complaint.category?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      complaint.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusClass = (status) => {
    return `officer-status-badge ${status?.toLowerCase().replaceAll("_", "-")}`;
  };

  const getPriorityClass = (priority) => {
    return `officer-priority-badge ${priority?.toLowerCase()}`;
  };

  return (
    <div className="assigned-complaints-page">
      <div className="assigned-page-heading">
        <div>
          <span className="officer-dashboard-tag">WORKSPACE</span>
          <h1>Assigned Complaints</h1>
          <p>View and manage the civic complaints assigned to you.</p>
        </div>

        <button
          className="officer-refresh-btn"
          onClick={fetchComplaints}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="assigned-complaint-summary">
        <ClipboardList size={22} />
        <div>
          <strong>{loading ? "..." : complaints.length}</strong>
          <span>Total assigned complaints</span>
        </div>
      </div>

      <div className="assigned-complaint-filters">
        <div className="assigned-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by title, complaint number or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {error && (
        <div className="officer-dashboard-error">{error}</div>
      )}

      <div className="assigned-complaints-table-wrapper">
        <table className="assigned-complaints-table">
          <thead>
            <tr>
              <th>Complaint</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="officer-table-message">
                  Loading assigned complaints...
                </td>
              </tr>
            ) : filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="6" className="officer-table-message">
                  No assigned complaints found.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <strong>{complaint.title}</strong>
                    <span className="officer-complaint-number">
                      {complaint.complaintNumber}
                    </span>
                  </td>

                  <td>{complaint.category}</td>

                  <td>
                    <span className={getPriorityClass(complaint.priority)}>
                      {complaint.priority}
                    </span>
                  </td>

                  <td>
                    <span className={getStatusClass(complaint.status)}>
                      {complaint.status?.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    {complaint.createdAt
                      ? new Date(complaint.createdAt).toLocaleDateString()
                      : "—"}
                  </td>

                  <td>
                    <button
                      className="officer-view-btn"
                      onClick={() =>
                        navigate(`/officer/complaints/${complaint.id}`)
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AssignedComplaints;
