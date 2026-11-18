
import { useEffect, useState } from 'react';
import { Image, FileCheck, CalendarDays, AlertCircle } from 'lucide-react';
import api from '../../services/api';

function ResolutionEvidence({ complaintId }) {
  const [evidence, setEvidence] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    let objectUrls = [];

    const fetchEvidence = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch evidence metadata
        const response = await api.get(
          `/citizen/complaints/${complaintId}/evidence`
        );

        const records = Array.isArray(response.data)
          ? response.data
          : [];

        if (!active) return;

        setEvidence(records);

        if (records.length === 0) {
          setImages([]);
          return;
        }

        // Fetch protected image files
        const imageResults = await Promise.all(
          records.map(async (item) => {
            const evidenceId = item.id;

            if (!evidenceId) return null;

            const imageResponse = await api.get(
              `/citizen/complaints/${complaintId}/evidence/${evidenceId}/image`,
              { responseType: 'blob' }
            );

            const imageUrl = URL.createObjectURL(imageResponse.data);
            objectUrls.push(imageUrl);

            return {
              ...item,
              imageUrl
            };
          })
        );

        if (active) {
          setImages(imageResults.filter(Boolean));
        }
      } catch (err) {
        console.error('Evidence loading failed:', err);
        console.error('Backend response:', err.response?.data);

        if (active) {
          setError('Unable to load resolution evidence.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    if (complaintId) {
      fetchEvidence();
    }

    return () => {
      active = false;
      objectUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [complaintId]);

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
      <div className="evidence-message">
        Loading resolution evidence...
      </div>
    );
  }

  if (error) {
    return (
      <div className="evidence-error">
        <AlertCircle size={19} />
        {error}
      </div>
    );
  }

  return (
    <section className="resolution-evidence-card">
      <div className="evidence-heading">
        <FileCheck size={22} />
        <div>
          <h2>Resolution Evidence</h2>
          <p>Photos and details submitted by the responsible officer.</p>
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="evidence-empty">
          <Image size={32} />
          <h3>No Evidence Available</h3>
          <p>
            Resolution photos will appear here when the assigned
            officer uploads them.
          </p>
        </div>
      ) : (
        <div className="evidence-list">
          {images.map((item) => (
            <article className="evidence-item" key={item.id}>
              <div className="evidence-image-wrapper">
                <a
                  href={item.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open full-size image"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.fileName || 'Complaint resolution evidence'}
                  />
                </a>
              </div>

              <div className="evidence-item-details">
                <h3>
                  {item.fileName || 'Resolution photograph'}
                </h3>

                {item.description && (
                  <p>{item.description}</p>
                )}

                <span>
                  <CalendarDays size={14} />
                  {formatDate(item.uploadedAt || item.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ResolutionEvidence;
