
import { useEffect, useState } from "react";
import { Image, RefreshCw, ExternalLink } from "lucide-react";
import api from "../../services/api";

function OfficerEvidenceGallery({ complaintId }) {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrls = [];

    const fetchEvidence = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/officer/complaints/${complaintId}/evidence`
        );

        const records = Array.isArray(response.data)
          ? response.data
          : [];

        const results = await Promise.all(
          records.map(async (item) => {
            try {
              const imageResponse = await api.get(
                `/officer/complaints/${complaintId}/evidence/${item.id}/image`,
                { responseType: "blob" }
              );

              const imageUrl = URL.createObjectURL(
                imageResponse.data
              );

              objectUrls.push(imageUrl);

              return { ...item, imageUrl };
            } catch (imageError) {
              console.error(
                `Unable to load evidence image ${item.id}:`,
                imageError
              );

              return { ...item, imageUrl: null };
            }
          })
        );

        if (active) {
          setEvidence(results);
        }
      } catch (err) {
        console.error("Evidence loading failed:", err);

        if (active) {
          setError(
            err.response?.data?.message ||
            "Unable to load resolution evidence."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEvidence();

    return () => {
      active = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [complaintId]);

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : "—";
  };

  return (
    <section className="officer-evidence-gallery">
      <div className="officer-evidence-heading">
        <div>
          <h2>
            <Image size={21} />
            Resolution Evidence
          </h2>
          <p>Photographs submitted for this complaint.</p>
        </div>
      </div>

      {loading ? (
        <p className="officer-evidence-message">
          Loading resolution evidence...
        </p>
      ) : error ? (
        <div className="officer-evidence-error">
          {error}
        </div>
      ) : evidence.length === 0 ? (
        <div className="officer-evidence-empty">
          <Image size={35} />
          <p>No resolution evidence uploaded yet.</p>
        </div>
      ) : (
        <div className="officer-evidence-grid">
          {evidence.map((item) => (
            <article
              className="officer-evidence-item"
              key={item.id}
            >
              {item.imageUrl ? (
                <a
                  href={item.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="officer-evidence-image-link"
                  title="Open full image"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.originalFileName || "Resolution evidence"}
                  />
                  <span>
                    <ExternalLink size={17} />
                  </span>
                </a>
              ) : (
                <div className="officer-evidence-image-failed">
                  Image unavailable
                </div>
              )}

              <div className="officer-evidence-info">
                <strong>
                  {item.originalFileName || "Resolution photograph"}
                </strong>

                <p>{item.description || "No description provided."}</p>

                <span>
                  Uploaded: {formatDate(item.uploadedAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default OfficerEvidenceGallery;
