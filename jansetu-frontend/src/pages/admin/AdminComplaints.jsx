
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  Filter,
  AlertCircle,
  UserRound,
  UserCheck,
  ClipboardList,
  X,
} from "lucide-react";
import api from "../../services/api";
// import "./AdminComplaints.css";

const STATUS_OPTIONS = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "REJECTED",
  "REOPENED",
  "CLOSED",
];

const PRIORITY_OPTIONS = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

const getStatusClass = (status = "") =>
  status.toLowerCase().replaceAll("_", "-");

const getPriorityClass = (priority = "") =>
  priority.toLowerCase();

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getComplaintList = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.complaints)) return data.complaints;
  return [];
};

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [officers, setOfficers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [officersLoading, setOfficersLoading] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);
  const [assigningOfficer, setAssigningOfficer] = useState(false);

  const [selectedOfficerId, setSelectedOfficerId] = useState("");

  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/complaints", {
        params: {
          page: 0,
          size: 100,
        },
      });

      setComplaints(getComplaintList(response.data));
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load complaints."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      setOfficersLoading(true);

      const response = await api.get("/admin/officers");

      setOfficers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Unable to load officers."
      );
    } finally {
      setOfficersLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        !searchValue ||
        complaint.title?.toLowerCase().includes(searchValue) ||
        complaint.complaintNumber?.toLowerCase().includes(searchValue) ||
        complaint.citizenName?.toLowerCase().includes(searchValue) ||
        complaint.citizenEmail?.toLowerCase().includes(searchValue) ||
        complaint.category?.toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter || complaint.status === statusFilter;

      const matchesPriority =
        !priorityFilter || complaint.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [complaints, search, statusFilter, priorityFilter]);

  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter((complaint) =>
    ["SUBMITTED", "UNDER_REVIEW"].includes(complaint.status)
  ).length;

  const assignedComplaints = complaints.filter((complaint) =>
    ["ASSIGNED", "IN_PROGRESS"].includes(complaint.status)
  ).length;

  const resolvedComplaints = complaints.filter((complaint) =>
    ["RESOLVED", "CLOSED"].includes(complaint.status)
  ).length;

  const openComplaint = async (complaint) => {
    setSelectedComplaint(complaint);

    setActionMessage("");
    setActionError("");
    setSelectedOfficerId("");

    await fetchOfficers();
  };

  const closeModal = () => {
    if (updatingStatus || updatingPriority || assigningOfficer) return;

    setSelectedComplaint(null);
    setActionMessage("");
    setActionError("");
    setSelectedOfficerId("");
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      setUpdatingStatus(true);
      setActionMessage("");
      setActionError("");

      const response = await api.patch(
        `/admin/complaints/${complaintId}/status`,
        { status: newStatus }
      );

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, ...response.data }
            : complaint
        )
      );

      setSelectedComplaint((prev) =>
        prev?.id === complaintId
          ? { ...prev, ...response.data }
          : prev
      );

      setActionMessage("Complaint status updated successfully.");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Failed to update complaint status."
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityUpdate = async (
    complaintId,
    newPriority
  ) => {
    try {
      setUpdatingPriority(true);
      setActionMessage("");
      setActionError("");

      const response = await api.patch(
        `/admin/complaints/${complaintId}/priority`,
        { priority: newPriority }
      );

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, ...response.data }
            : complaint
        )
      );

      setSelectedComplaint((prev) =>
        prev?.id === complaintId
          ? { ...prev, ...response.data }
          : prev
      );

      setActionMessage("Complaint priority updated successfully.");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Failed to update complaint priority."
      );
    } finally {
      setUpdatingPriority(false);
    }
  };

  const handleOfficerAssignment = async () => {
    if (!selectedComplaint || !selectedOfficerId) {
      setActionError("Please select an officer first.");
      return;
    }

    try {
      setAssigningOfficer(true);
      setActionMessage("");
      setActionError("");

      const response = await api.patch(
        `/admin/officers/assign-complaint/${selectedComplaint.id}`,
        {
          officerId: Number(selectedOfficerId),
        }
      );

      const assignment = response.data;

      const updatedComplaint = {
        ...selectedComplaint,
        status: assignment.status,
        assignedOfficerId: assignment.officerId,
        assignedOfficerName: assignment.officerName,
        assignedOfficerEmail: assignment.officerEmail,
        updatedAt: assignment.updatedAt,
      };

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint.id === selectedComplaint.id
            ? { ...complaint, ...updatedComplaint }
            : complaint
        )
      );

      setSelectedComplaint(updatedComplaint);

      setActionMessage(
        `Complaint assigned successfully to ${assignment.officerName}.`
      );

      setSelectedOfficerId("");
    } catch (err) {
      setActionError(
        err.response?.data?.message ||
          "Failed to assign officer. Please try again."
      );
    } finally {
      setAssigningOfficer(false);
    }
  };

  return (
    <div className="admin-complaints-page">
      {/* Header */}
      <div className="admin-complaints-header">
        <div>
          <h1>Complaint Management</h1>
          <p>Manage, review and track citizen complaints</p>
        </div>

        <button
          className="admin-refresh-btn"
          onClick={fetchComplaints}
          disabled={loading}
        >
          <RefreshCw size={17} className={loading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="admin-complaints-summary">
        <div className="complaint-summary-card">
          <div className="summary-icon total">
            <ClipboardList size={22} />
          </div>
          <div>
            <span>Total Complaints</span>
            <strong>{totalComplaints}</strong>
          </div>
        </div>

        <div className="complaint-summary-card">
          <div className="summary-icon pending">
            <AlertCircle size={22} />
          </div>
          <div>
            <span>Pending Review</span>
            <strong>{pendingComplaints}</strong>
          </div>
        </div>

        <div className="complaint-summary-card">
          <div className="summary-icon progress">
            <UserCheck size={22} />
          </div>
          <div>
            <span>Assigned / In Progress</span>
            <strong>{assignedComplaints}</strong>
          </div>
        </div>

        <div className="complaint-summary-card">
          <div className="summary-icon resolved">
            <ClipboardList size={22} />
          </div>
          <div>
            <span>Resolved</span>
            <strong>{resolvedComplaints}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-complaints-toolbar">
        <div className="admin-complaint-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search complaint, citizen, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filter-select">
          <Filter size={17} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option value={status} key={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-filter-select">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option value={priority} key={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-complaints-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button onClick={fetchComplaints}>Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="admin-complaints-table-container">
        {loading ? (
          <div className="admin-complaints-loading">
            <RefreshCw className="spin" size={24} />
            <p>Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="admin-complaints-empty">
            <ClipboardList size={40} />
            <h3>No complaints found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        ) : (
          <table className="admin-complaints-table">
            <thead>
              <tr>
                <th>Complaint</th>
                <th>Citizen</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <div className="complaint-table-title">
                      <strong>{complaint.title}</strong>
                      <small>{complaint.complaintNumber}</small>
                    </div>
                  </td>

                  <td>
                    <div className="complaint-citizen-cell">
                      <strong>{complaint.citizenName || "Citizen"}</strong>
                      <small>{complaint.citizenEmail || "N/A"}</small>
                    </div>
                  </td>

                  <td>{complaint.category}</td>

                  <td>
                    <span
                      className={`complaint-priority-badge ${getPriorityClass(
                        complaint.priority
                      )}`}
                    >
                      {complaint.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`complaint-status-badge ${getStatusClass(
                        complaint.status
                      )}`}
                    >
                      {complaint.status?.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>{formatDate(complaint.createdAt)}</td>

                  <td>
                    <button
                      className="complaint-view-btn"
                      onClick={() => openComplaint(complaint)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-complaints-footer">
        Showing {filteredComplaints.length} of {complaints.length} complaints
      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (
        <div className="admin-complaint-modal-overlay" onClick={closeModal}>
          <div
            className="admin-complaint-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-complaint-modal-header">
              <div>
                <h2>Complaint Details</h2>
                <p>{selectedComplaint.complaintNumber}</p>
              </div>

              <button
                className="admin-modal-close-btn"
                onClick={closeModal}
                disabled={updatingStatus || updatingPriority || assigningOfficer}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-complaint-modal-body">
              {/* Complaint Information */}
              <section className="admin-complaint-detail-section">
                <h3>{selectedComplaint.title}</h3>

                <div className="complaint-detail-badges">
                  <span
                    className={`complaint-status-badge ${getStatusClass(
                      selectedComplaint.status
                    )}`}
                  >
                    {selectedComplaint.status?.replaceAll("_", " ")}
                  </span>

                  <span
                    className={`complaint-priority-badge ${getPriorityClass(
                      selectedComplaint.priority
                    )}`}
                  >
                    {selectedComplaint.priority}
                  </span>
                </div>

                <p className="complaint-detail-description">
                  {selectedComplaint.description}
                </p>
              </section>

              {/* Citizen Information */}
              <section className="admin-complaint-detail-section">
                <h3>Citizen Information</h3>

                <div className="complaint-detail-info-grid">
                  <div>
                    <span>Name</span>
                    <strong>{selectedComplaint.citizenName || "N/A"}</strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>{selectedComplaint.citizenEmail || "N/A"}</strong>
                  </div>

                  <div>
                    <span>Category</span>
                    <strong>{selectedComplaint.category || "N/A"}</strong>
                  </div>

                  <div>
                    <span>Complaint ID</span>
                    <strong>{selectedComplaint.id}</strong>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="admin-complaint-detail-section">
                <h3>
                  <MapPin size={17} />
                  Location
                </h3>

                <p>{selectedComplaint.address || "Address not provided"}</p>

                {selectedComplaint.latitude != null &&
                    selectedComplaint.longitude != null && (
                  <a
                    href={`https://www.google.com/maps?q=${selectedComplaint.latitude},${selectedComplaint.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="complaint-map-link"
                  >
                    <MapPin size={15} />
                    View on Google Maps
                  </a>
                )}
              </section>

              {/* Dates */}
              <section className="admin-complaint-detail-section">
                <h3>
                  <Calendar size={17} />
                  Timeline Information
                </h3>

                <div className="complaint-detail-info-grid">
                  <div>
                    <span>Submitted</span>
                    <strong>{formatDate(selectedComplaint.createdAt)}</strong>
                  </div>

                  <div>
                    <span>Last Updated</span>
                    <strong>{formatDate(selectedComplaint.updatedAt)}</strong>
                  </div>
                </div>
              </section>

              {/* Current Assigned Officer */}
              <section className="admin-complaint-detail-section">
                <h3>
                  <UserCheck size={18} />
                  Assigned Officer
                </h3>

                {selectedComplaint.assignedOfficerName ? (
                  <div className="assigned-officer-card">
                    <div className="assigned-officer-avatar">
                      <UserRound size={20} />
                    </div>

                    <div>
                      <strong>{selectedComplaint.assignedOfficerName}</strong>
                      <span>
                        {selectedComplaint.assignedOfficerEmail || ""}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="no-officer-assigned">
                    No officer assigned to this complaint yet.
                  </div>
                )}
              </section>

              {/* Assign / Reassign Officer */}
              <section className="admin-complaint-detail-section assignment-section">
                <h3>
                  <UserRound size={18} />
                  {selectedComplaint.assignedOfficerName
                    ? "Reassign Officer"
                    : "Assign Officer"}
                </h3>

                {officersLoading ? (
                  <div className="assignment-loading">
                    <RefreshCw size={16} className="spin" />
                    Loading officers...
                  </div>
                ) : officers.length === 0 ? (
                  <div className="assignment-empty">
                    No officers available. Register an officer first.
                  </div>
                ) : (
                  <>
                    <div className="assignment-controls">
                      <select
                        value={selectedOfficerId}
                        onChange={(e) => setSelectedOfficerId(e.target.value)}
                        disabled={assigningOfficer}
                      >
                        <option value="">Select officer</option>

                        {officers.map((officer) => (
                          <option
                            key={officer.id}
                            value={officer.id}
                          >
                            {officer.fullName} — {officer.email}
                          </option>
                        ))}
                      </select>

                      <button
                        className="assign-officer-btn"
                        onClick={handleOfficerAssignment}
                        disabled={!selectedOfficerId || assigningOfficer}
                      >
                        {assigningOfficer ? (
                          <>
                            <RefreshCw size={16} className="spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <UserCheck size={16} />
                            {selectedComplaint.assignedOfficerName
                              ? "Reassign"
                              : "Assign Officer"}
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </section>

              {/* Status */}
              <section className="admin-complaint-detail-section">
                <h3>Update Status</h3>

                <select
                  value={selectedComplaint.status}
                  onChange={(e) =>
                    handleStatusUpdate(
                      selectedComplaint.id,
                      e.target.value
                    )
                  }
                  disabled={updatingStatus}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>

                {updatingStatus && (
                  <span className="admin-action-loading">
                    Updating status...
                  </span>
                )}
              </section>

              {/* Priority */}
              <section className="admin-complaint-detail-section">
                <h3>Update Priority</h3>

                <select
                  value={selectedComplaint.priority}
                  onChange={(e) =>
                    handlePriorityUpdate(
                      selectedComplaint.id,
                      e.target.value
                    )
                  }
                  disabled={updatingPriority}
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>

                {updatingPriority && (
                  <span className="admin-action-loading">
                    Updating priority...
                  </span>
                )}
              </section>

              {/* Feedback */}
              {actionMessage && (
                <div className="admin-action-success">
                  {actionMessage}
                </div>
              )}

              {actionError && (
                <div className="admin-action-error">
                  <AlertCircle size={16} />
                  {actionError}
                </div>
              )}
            </div>

            <div className="admin-complaint-modal-footer">
              <button
                className="admin-modal-done-btn"
                onClick={closeModal}
                disabled={updatingStatus || updatingPriority || assigningOfficer}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
