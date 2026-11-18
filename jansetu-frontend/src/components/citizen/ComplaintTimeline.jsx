
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, History, AlertCircle } from 'lucide-react';
import api from '../../services/api';

function ComplaintTimeline({ complaintId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(
          `/citizen/complaints/${complaintId}/history`
        );

        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error('History loading failed:', err);
        console.error('Backend response:', err.response?.data);
        setError('Unable to load complaint history.');
      } finally {
        setLoading(false);
      }
    };

    if (complaintId) {
      fetchHistory();
    }
  }, [complaintId]);

  const formatStatus = (status) =>
    status ? status.replaceAll('_', ' ') : 'Unknown';

  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="timeline-message">
        Loading complaint history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="timeline-error">
        <AlertCircle size={18} />
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="timeline-empty">
        No status history is available yet.
      </div>
    );
  }

  return (
    <section className="complaint-timeline-card">
      <div className="timeline-heading">
        <History size={21} />
        <div>
          <h2>Status History</h2>
          <p>Track every recorded update to your complaint.</p>
        </div>
      </div>

      <div className="timeline-list">
        {history.map((item, index) => (
          <div className="timeline-item" key={item.id ?? index}>
            <div className="timeline-marker">
              <CheckCircle size={21} />
            </div>

            <div className="timeline-content">
              <div className="timeline-status">
                {item.previousStatus
                  ? `${formatStatus(item.previousStatus)} → ${formatStatus(item.newStatus)}`
                  : formatStatus(item.newStatus)}
              </div>

              {item.description && (
                <p>{item.description}</p>
              )}

              {item.remarks && (
                <p>{item.remarks}</p>
              )}

              <span className="timeline-date">
                <Clock size={14} />
                {formatDate(item.changedAt || item.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ComplaintTimeline;
