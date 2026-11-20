
import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  UserPlus,
  Mail,
  Phone,
  ShieldCheck,
  X,
} from "lucide-react";
import api from "../../services/api";

function AdminOfficers() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const fetchOfficers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/officers");
      setOfficers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to fetch officers:", err);
      setError(
        err.response?.data?.message || "Failed to load officers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const filteredOfficers = useMemo(() => {
    const searchText = search.toLowerCase();

    return officers.filter(
      (officer) =>
        officer.fullName?.toLowerCase().includes(searchText) ||
        officer.email?.toLowerCase().includes(searchText) ||
        officer.phone?.includes(searchText)
    );
  }, [officers, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      phone: "",
    });

    setFormError("");
  };

  const handleCreateOfficer = async (e) => {
    e.preventDefault();

    try {
      setCreating(true);
      setFormError("");
      setSuccessMessage("");

      const response = await api.post("/admin/officers", formData);

      setOfficers((prev) => [response.data, ...prev]);

      setSuccessMessage("Officer registered successfully!");
      setShowForm(false);
      resetForm();
    } catch (err) {
      console.error("Officer creation failed:", err);

      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to register officer."
      );
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="admin-officers-page">
      {/* Header */}
      <div className="admin-officers-header">
        <div>
          <h1>Officer Management</h1>
          <p>Manage field officers and register new officers.</p>
        </div>

        <div className="admin-officers-header-actions">
          <button
            className="admin-officers-refresh-btn"
            onClick={fetchOfficers}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="admin-add-officer-btn"
            onClick={() => {
              setFormError("");
              setSuccessMessage("");
              setShowForm(true);
            }}
          >
            <UserPlus size={17} />
            Add Officer
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="admin-officers-summary">
        <div className="admin-officer-summary-card">
          <div className="admin-officer-summary-icon">
            <Users size={22} />
          </div>
          <div>
            <span>Total Officers</span>
            <h2>{officers.length}</h2>
          </div>
        </div>

        <div className="admin-officer-summary-card">
          <div className="admin-officer-summary-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span>Registered Role</span>
            <h2>OFFICER</h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-officers-toolbar">
        <div className="admin-officers-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Success */}
      {successMessage && (
        <div className="admin-officers-success">
          {successMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="admin-officers-error">
          {error}
          <button onClick={fetchOfficers}>Retry</button>
        </div>
      )}

      {/* Officers Table */}
      <div className="admin-officers-table-container">
        {loading ? (
          <div className="admin-officers-loading">
            <RefreshCw size={22} />
            <p>Loading officers...</p>
          </div>
        ) : filteredOfficers.length === 0 ? (
          <div className="admin-officers-empty">
            <Users size={32} />
            <h3>No officers found</h3>
            <p>
              {search
                ? "Try a different search."
                : "Register your first officer to get started."}
            </p>
          </div>
        ) : (
          <div className="admin-officers-table-scroll">
            <table className="admin-officers-table">
              <thead>
                <tr>
                  <th>Officer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Registered</th>
                </tr>
              </thead>

              <tbody>
                {filteredOfficers.map((officer) => (
                  <tr key={officer.id}>
                    <td>
                      <div className="admin-officer-name-cell">
                        <div className="admin-officer-avatar">
                          {officer.fullName?.charAt(0).toUpperCase()}
                        </div>

                        <strong>{officer.fullName}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="admin-officer-contact">
                        <Mail size={15} />
                        {officer.email}
                      </span>
                    </td>

                    <td>
                      <span className="admin-officer-contact">
                        <Phone size={15} />
                        {officer.phone || "—"}
                      </span>
                    </td>

                    <td>
                      <span className="admin-officer-role-badge">
                        {officer.role}
                      </span>
                    </td>

                    <td>{formatDate(officer.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-officers-footer">
        Showing {filteredOfficers.length} of {officers.length} officers
      </div>

      {/* Register Officer Modal */}
      {showForm && (
        <div
          className="admin-officer-modal-overlay"
          onClick={() => !creating && setShowForm(false)}
        >
          <div
            className="admin-officer-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-officer-modal-header">
              <div>
                <h2>Register New Officer</h2>
                <p>Create an officer account for JanSetu.</p>
              </div>

              <button
                type="button"
                className="admin-officer-modal-close"
                onClick={() => setShowForm(false)}
                disabled={creating}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="admin-officer-form"
              onSubmit={handleCreateOfficer}
            >
              <div className="admin-officer-form-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  minLength={3}
                  maxLength={100}
                  required
                />
              </div>

              <div className="admin-officer-form-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="officer@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="admin-officer-form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                />
              </div>

              <div className="admin-officer-form-field">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                  minLength={8}
                  maxLength={100}
                  required
                />
              </div>

              {formError && (
                <div className="admin-officer-form-error">
                  {formError}
                </div>
              )}

              <div className="admin-officer-form-actions">
                <button
                  type="button"
                  className="admin-officer-cancel-btn"
                  onClick={() => setShowForm(false)}
                  disabled={creating}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-officer-submit-btn"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Register Officer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOfficers;
