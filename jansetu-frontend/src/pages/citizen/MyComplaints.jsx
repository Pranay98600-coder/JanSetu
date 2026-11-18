
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  RefreshCw,
  Eye,
  CalendarDays
} from 'lucide-react';
import api from '../../services/api';

function MyComplaints() {
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/citizen/complaints');

      setComplaints(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      console.error('Backend response:', err.response?.data);

      setError(
        err.response?.data?.message ||
        'Unable to load your complaints. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const getStatusClass = (status) => {
    const statusClasses = {
      SUBMITTED: 'status-submitted',
      UNDER_REVIEW: 'status-review',
      ASSIGNED: 'status-assigned',
      IN_PROGRESS: 'status-progress',
      RESOLVED: 'status-resolved',
      REJECTED: 'status-rejected',
      REOPENED: 'status-reopened',
      CLOSED: 'status-closed'
    };

    return statusClasses[status] || '';
  };

  const formatStatus = (status) => {
    return status
      ? status.replaceAll('_', ' ')
      : 'Unknown';
  };

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="my-complaints-page">

      <div className="my-complaints-heading">
        <div>
          <h1>My Complaints</h1>
          <p>View and monitor the civic complaints you have submitted.</p>
        </div>

        <button
          className="my-complaints-refresh"
          onClick={fetchComplaints}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="complaints-overview">
        <div>
          <span>Total Complaints</span>
          <h2>{complaints.length}</h2>
        </div>

        <div>
          <span>In Progress</span>
          <h2>
            {complaints.filter(c =>
              c.status === 'IN_PROGRESS' ||
              c.status === 'ASSIGNED' ||
              c.status === 'UNDER_REVIEW'
            ).length}
          </h2>
        </div>

        <div>
          <span>Resolved</span>
          <h2>
            {complaints.filter(c => c.status === 'RESOLVED').length}
          </h2>
        </div>
      </div>

      <div className="my-complaints-list-heading">
        <h2>Complaint History</h2>
        <span>{complaints.length} records</span>
      </div>

      {loading ? (
        <div className="complaints-message">
          Loading your complaints...
        </div>
      ) : error ? (
        <div className="complaints-error">
          {error}
          <button onClick={fetchComplaints}>Try Again</button>
        </div>
      ) : complaints.length === 0 ? (
        <div className="complaints-empty">
          <div className="complaints-empty-icon">
            <FileText size={35} />
          </div>

          <h2>No Complaints Yet</h2>

          <p>
            You haven't submitted any civic complaints.
            Report an issue to help improve your community.
          </p>

          <button
            className="citizen-submit-btn"
            onClick={() => navigate('/citizen/submit-complaint')}
          >
            <PlusCircle size={18} />
            Submit Your First Complaint
          </button>
        </div>
      ) : (
        <div className="complaints-table-wrapper">
          <table className="citizen-complaints-table">
            <thead>
              <tr>
                <th>Complaint Details</th>
                <th>Category</th>
                <th>Date Submitted</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id}>
                  <td>
                    <strong>{complaint.title}</strong>
                    <span className="complaint-number">
                      {complaint.complaintNumber}
                    </span>
                  </td>

                  <td>{complaint.category}</td>

                  <td>
                    <span className="complaint-date">
                      <CalendarDays size={15} />
                      {formatDate(complaint.createdAt)}
                    </span>
                  </td>

                  <td>
                    <span className={`priority-badge priority-${(complaint.priority || 'MEDIUM').toLowerCase()}`}>
                      {complaint.priority || 'MEDIUM'}
                    </span>
                  </td>

                  <td>
                    <span className={`complaint-status-badge ${getStatusClass(complaint.status)}`}>
                      {formatStatus(complaint.status)}
                    </span>
                  </td>

                  <td>
                    <button
                      className="complaint-view-btn"
                      onClick={() =>
                        navigate(`/citizen/complaints/${complaint.id}`)
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyComplaints;
