import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, RefreshCw, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import api from "../../services/api";
import ResolutionSubmission from "../../components/officer/ResolutionSubmission";
import OfficerEvidenceGallery from "../../components/officer/OfficerEvidenceGallery";

function OfficerComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const [complaintResponse, historyResponse] = await Promise.all([
        api.get(`/officer/complaints/${id}`),
        api.get(`/officer/complaints/${id}/history`),
      ]);

      setComplaint(complaintResponse.data);
      setHistory(
        Array.isArray(historyResponse.data) ? historyResponse.data : [],
      );
    } catch (err) {
      console.error("Failed to load complaint details:", err);

      setError(
        err.response?.data?.message || "Unable to load complaint details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStartWork = async () => {
    try {
      setUpdatingStatus(true);
      setError("");

      await api.patch(`/officer/complaints/${id}/status`, {
        status: "IN_PROGRESS",
      });

      await fetchDetails();
    } catch (err) {
      console.error("Status update failed:", err);

      setError(
        err.response?.data?.message || "Unable to update complaint status.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const formatStatus = (status) => {
    return status?.replaceAll("_", " ") || "—";
  };

  if (loading) {
    return (
      <div className="officer-details-message">
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="officer-details-error">
        <p>{error || "Complaint not found."}</p>
        <button onClick={() => navigate("/officer/complaints")}>
          Back to Assigned Complaints
        </button>
      </div>
    );
  }

  const hasCoordinates =
    complaint.latitude != null && complaint.longitude != null;

  return (
    <div className="officer-complaint-details">
      <button
        className="officer-back-btn"
        onClick={() => navigate("/officer/complaints")}
      >
        <ArrowLeft size={18} />
        Back to Assigned Complaints
      </button>

      <div className="officer-details-heading">
        <div>
          <span className="officer-dashboard-tag">COMPLAINT DETAILS</span>

          <h1>{complaint.title}</h1>

          <p>Complaint Number: {complaint.complaintNumber}</p>
        </div>

        <div className="officer-details-actions">
          {complaint.status === "ASSIGNED" && (
            <button
              type="button"
              className="officer-start-work-btn"
              onClick={handleStartWork}
              disabled={updatingStatus}
            >
              {updatingStatus ? "Starting..." : "Start Work"}
            </button>
          )}

          <button
            className="officer-refresh-btn"
            onClick={fetchDetails}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="officer-details-grid">
        <section className="officer-details-card">
          <h2>Complaint Information</h2>

          <div className="officer-detail-row">
            <span>Category</span>
            <strong>{complaint.category || "—"}</strong>
          </div>

          <div className="officer-detail-row">
            <span>Priority</span>
            <strong>{complaint.priority || "—"}</strong>
          </div>

          <div className="officer-detail-row">
            <span>Status</span>
            <strong>{formatStatus(complaint.status)}</strong>
          </div>

          <div className="officer-detail-row">
            <span>Submitted On</span>
            <strong>{formatDate(complaint.createdAt)}</strong>
          </div>

          <div className="officer-detail-row">
            <span>Last Updated</span>
            <strong>{formatDate(complaint.updatedAt)}</strong>
          </div>
        </section>

        <section className="officer-details-card">
          <h2>Complaint Description</h2>
          <p className="officer-description">
            {complaint.description || "No description provided."}
          </p>

          <h3>
            <MapPin size={17} />
            Reported Address
          </h3>

          <p>{complaint.address || "Address not available."}</p>
        </section>
      </div>

      <section className="officer-details-card officer-location-section">
        <h2>
          <MapPin size={19} />
          Reported Location
        </h2>

        {hasCoordinates ? (
          <>
            <div className="officer-coordinate-text">
              Latitude: {Number(complaint.latitude).toFixed(6)}
              {" | "}
              Longitude: {Number(complaint.longitude).toFixed(6)}
            </div>

            <MapContainer
              center={[Number(complaint.latitude), Number(complaint.longitude)]}
              zoom={16}
              scrollWheelZoom={true}
              className="officer-details-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[
                  Number(complaint.latitude),
                  Number(complaint.longitude),
                ]}
              >
                <Popup>{complaint.title}</Popup>
              </Marker>
            </MapContainer>
          </>
        ) : (
          <p>Location coordinates were not provided for this complaint.</p>
        )}
      </section>

      {complaint.status === "IN_PROGRESS" && (
        <ResolutionSubmission complaintId={id} onSuccess={fetchDetails} />
      )}
      <OfficerEvidenceGallery complaintId={id} />
      <section className="officer-details-card officer-history-section">
        <h2>
          <Clock size={19} />
          Complaint Status History
        </h2>

        {history.length === 0 ? (
          <p>No status history available.</p>
        ) : (
          <div className="officer-history-list">
            {history.map((item, index) => (
              <div className="officer-history-item" key={item.id ?? index}>
                <span className="officer-history-dot"></span>

                <div>
                  <strong>{formatStatus(item.newStatus)}</strong>

                  <p>
                    {item.previousStatus
                      ? `${formatStatus(item.previousStatus)} → ${formatStatus(item.newStatus)}`
                      : "Complaint created"}
                  </p>

                  <span>{formatDate(item.changedAt || item.createdAt)}</span>

                  {item.description && <p>{item.description}</p>}
                  {item.remarks && <p>{item.remarks}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OfficerComplaintDetails;
