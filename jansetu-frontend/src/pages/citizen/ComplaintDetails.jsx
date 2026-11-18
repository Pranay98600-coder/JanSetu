
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import api from '../../services/api';
import ComplaintTimeline from '../../components/citizen/ComplaintTimeline';

import ResolutionEvidence from '../../components/citizen/ResolutionEvidence';

function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/citizen/complaints/${id}`);
      setComplaint(response.data);
    } catch (err) {
      console.error('Failed to load complaint:', err);
      console.error('Backend response:', err.response?.data);

      setError(
        err.response?.data?.message ||
        'Unable to load complaint details. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status) => {
    return status
      ? status.replaceAll('_', ' ')
      : 'Unknown';
  };

  const stages = [
    'SUBMITTED',
    'UNDER_REVIEW',
    'ASSIGNED',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
  ];

  const getCurrentStageIndex = () => {
    if (!complaint) return -1;

    if (complaint.status === 'REOPENED') {
      return 3;
    }

    return stages.indexOf(complaint.status);
  };

  const getStatusClass = (status) => {
    const classes = {
      SUBMITTED: 'status-submitted',
      UNDER_REVIEW: 'status-review',
      ASSIGNED: 'status-assigned',
      IN_PROGRESS: 'status-progress',
      RESOLVED: 'status-resolved',
      REJECTED: 'status-rejected',
      REOPENED: 'status-reopened',
      CLOSED: 'status-closed'
    };

    return classes[status] || '';
  };

  if (loading) {
    return (
      <div className="complaint-detail-message">
        Loading complaint details...
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="complaint-detail-error">
        <AlertCircle size={30} />
        <h2>Unable to Load Complaint</h2>
        <p>{error || 'Complaint not found.'}</p>

        <button onClick={fetchComplaint}>
          <RefreshCw size={17} />
          Try Again
        </button>

        <button onClick={() => navigate('/citizen/complaints')}>
          Back to My Complaints
        </button>
      </div>
    );
  }

  const currentStage = getCurrentStageIndex();
  const isRejected = complaint.status === 'REJECTED';
  const isReopened = complaint.status === 'REOPENED';

  return (
    <div className="complaint-details-page">

      <button
        className="complaint-details-back"
        onClick={() => navigate('/citizen/complaints')}
      >
        <ArrowLeft size={18} />
        Back to My Complaints
      </button>

      {/* HEADER */}

      <div className="complaint-details-header">
        <div>
          <span className="complaint-details-label">
            COMPLAINT DETAILS
          </span>

          <h1>{complaint.title}</h1>

          <p>
            Complaint Number: <strong>{complaint.complaintNumber}</strong>
          </p>
        </div>

        <span
          className={`complaint-status-badge ${getStatusClass(complaint.status)}`}
        >
          {formatStatus(complaint.status)}
        </span>
      </div>

      {/* STATUS TRACKER */}

      <section className="complaint-detail-card">
        <div className="complaint-detail-section-heading">
          <Clock size={21} />
          <h2>Complaint Progress</h2>
        </div>

        {isRejected ? (
          <div className="complaint-rejected-message">
            <AlertCircle size={24} />
            <div>
              <strong>Complaint Rejected</strong>
              <p>
                Your complaint has been marked as rejected.
                Please contact the concerned authority for clarification.
              </p>
            </div>
          </div>
        ) : (
          <div className="complaint-progress-tracker">
            {stages.map((stage, index) => {
              const completed = index <= currentStage;

              return (
                <div
                  key={stage}
                  className={`progress-stage ${completed ? 'completed' : ''}`}
                >
                  <div className="progress-stage-icon">
                    {completed ? (
                      <CheckCircle size={21} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <span>{formatStatus(stage)}</span>
                </div>
              );
            })}
          </div>
        )}

        {isReopened && (
          <p className="complaint-reopened-note">
            Your complaint has been reopened and requires further attention.
          </p>
        )}

        <div className="complaint-current-status">
          Current Status:
          <strong>{formatStatus(complaint.status)}</strong>
        </div>
      </section>

      {/* COMPLAINT INFORMATION */}

      <section className="complaint-detail-card">
        <div className="complaint-detail-section-heading">
          <FileText size={21} />
          <h2>Complaint Information</h2>
        </div>

        <div className="complaint-info-grid">
          <div className="complaint-info-item">
            <span>Complaint Number</span>
            <strong>{complaint.complaintNumber}</strong>
          </div>

          <div className="complaint-info-item">
            <span>Category</span>
            <strong>{complaint.category}</strong>
          </div>

          <div className="complaint-info-item">
            <span>Priority</span>
            <strong className={`priority-badge priority-${(complaint.priority || 'MEDIUM').toLowerCase()}`}>
              {complaint.priority || 'MEDIUM'}
            </strong>
          </div>

          <div className="complaint-info-item">
            <span>Submitted On</span>
            <strong>{formatDate(complaint.createdAt)}</strong>
          </div>

          <div className="complaint-info-item">
            <span>Last Updated</span>
            <strong>{formatDate(complaint.updatedAt)}</strong>
          </div>
        </div>

        <div className="complaint-description-block">
          <span>Description</span>
          <p>{complaint.description}</p>
        </div>
      </section>

      {/* LOCATION */}

      <section className="complaint-detail-card">
        <div className="complaint-detail-section-heading">
          <MapPin size={21} />
          <h2>Complaint Location</h2>
        </div>

        <div className="complaint-location-box">
          <strong>Address</strong>
          <p>{complaint.address}</p>

          {complaint.latitude != null &&
            complaint.longitude != null && (
              <div className="complaint-coordinates">
                <span>Latitude: {complaint.latitude}</span>
                <span>Longitude: {complaint.longitude}</span>
              </div>
            )}
        </div>
      </section>

      <div className="complaint-detail-footer">
        <CalendarDays size={17} />
        Keep your complaint number safe for future reference.
      </div>

      <ResolutionEvidence complaintId={id} />

      <ComplaintTimeline complaintId={id} />

    </div>
  );
}

export default ComplaintDetails;
