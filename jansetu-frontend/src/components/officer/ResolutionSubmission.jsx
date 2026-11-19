
import { useState } from "react";
import { Upload, ImagePlus, CheckCircle, X } from "lucide-react";
import api from "../../services/api";

function ResolutionSubmission({ complaintId, onSuccess }) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    setError("");
    setSuccess("");

    if (selectedImages.length > 5) {
      setError("You can upload a maximum of 5 images.");
      e.target.value = "";
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidImage = selectedImages.find(
      (image) => !validTypes.includes(image.type)
    );

    if (invalidImage) {
      setError("Only JPG, PNG and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    const oversizedImage = selectedImages.find(
      (image) => image.size > 5 * 1024 * 1024
    );

    if (oversizedImage) {
      setError("Each image must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setImages(selectedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!description.trim()) {
      setError("Please enter a resolution description.");
      return;
    }

    if (images.length < 1 || images.length > 5) {
      setError("Please select between 1 and 5 resolution images.");
      return;
    }

    const formData = new FormData();
    formData.append("description", description.trim());

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);

      await api.post(
        `/officer/complaints/${complaintId}/resolution-evidence`,
        formData
      );

      setSuccess("Resolution evidence submitted successfully!");

      setDescription("");
      setImages([]);

      // Refresh complaint details and history in the parent.
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      console.error("Resolution evidence submission failed:", err);

      setError(
        err.response?.data?.message ||
        "Unable to submit resolution evidence."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="officer-resolution-card">
      <div className="officer-resolution-heading">
        <ImagePlus size={23} />
        <div>
          <h2>Submit Resolution Evidence</h2>
          <p>Upload photographs showing the completed work.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Resolution Description *</label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the work completed to resolve this complaint..."
          rows={4}
          required
        />

        <label>Upload Resolution Images *</label>

        <div className="officer-upload-area">
          <Upload size={27} />

          <p>Select photographs of the completed work</p>

          <span>JPG, PNG or WEBP • Maximum 5 images • 5 MB each</span>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
          />
        </div>

        {images.length > 0 && (
          <div className="officer-selected-images">
            <strong>{images.length} image(s) selected</strong>

            {images.map((image, index) => (
              <div key={`${image.name}-${index}`}>
                <span>{image.name}</span>
                <span>{(image.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="officer-resolution-error">{error}</div>
        )}

        {success && (
          <div className="officer-resolution-success">
            <CheckCircle size={18} />
            {success}
          </div>
        )}

        <button
          type="submit"
          className="officer-resolve-btn"
          disabled={loading}
        >
          <CheckCircle size={18} />
          {loading ? "Submitting Evidence..." : "Submit Resolution"}
        </button>
      </form>
    </section>
  );
}

export default ResolutionSubmission;
