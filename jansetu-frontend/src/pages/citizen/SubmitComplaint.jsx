import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePlus, MapPin, Send, ArrowLeft } from "lucide-react";
import api from "../../services/api";
import LocationPicker from "../../components/citizen/LocationPicker";
function SubmitComplaint() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (latitude, longitude) => {
    setFormData((prev) => ({
      ...prev,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const hasLatitude = formData.latitude.trim() !== "";
    const hasLongitude = formData.longitude.trim() !== "";

    if (hasLatitude !== hasLongitude) {
      setError(
        "Please provide both latitude and longitude, or leave both empty.",
      );
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      address: formData.address.trim(),
      latitude: hasLatitude ? Number(formData.latitude) : null,
      longitude: hasLongitude ? Number(formData.longitude) : null,
    };

    if (
      hasLatitude &&
      (!Number.isFinite(payload.latitude) ||
        !Number.isFinite(payload.longitude) ||
        payload.latitude < -90 ||
        payload.latitude > 90 ||
        payload.longitude < -180 ||
        payload.longitude > 180)
    ) {
      setError("Please enter valid latitude and longitude coordinates.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/citizen/complaints", payload);

      setSuccess(
        `Complaint submitted successfully! Complaint Number: ${response.data.complaintNumber}`,
      );

      setFormData({
        title: "",
        description: "",
        category: "",
        address: "",
        latitude: "",
        longitude: "",
      });
    } catch (err) {
      console.error("Complaint submission failed:", err);
      console.log("Backend response:", err.response?.data);
      console.log("HTTP status:", err.response?.status);

      setError(
        JSON.stringify(err.response?.data) || "Unable to submit complaint.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="submit-complaint-page">
      <button
        className="complaint-back-btn"
        onClick={() => navigate("/citizen/dashboard")}
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="complaint-form-heading">
        <div className="complaint-form-icon">
          <FilePlus size={27} />
        </div>
        <div>
          <h1>Submit a Complaint</h1>
          <p>Tell us about the civic issue in your area.</p>
        </div>
      </div>

      <form className="complaint-form-card" onSubmit={handleSubmit}>
        <div className="complaint-form-section">
          <h3>Complaint Information</h3>

          <label>Complaint Title *</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Road damage near main market"
            maxLength={150}
            required
          />

          <label>Category *</label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select complaint category</option>
            <option value="ROADS">Roads & Potholes</option>
            <option value="WATER">Water Supply</option>
            <option value="SANITATION">Sanitation</option>
            <option value="STREETLIGHT">Street Lights</option>
            <option value="DRAINAGE">Drainage & Sewage</option>
            <option value="GARBAGE">Garbage & Waste</option>
            <option value="OTHER">Other</option>
          </select>

          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the issue, its location and how it affects residents..."
            rows={5}
            required
          />

          <label>Full Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter the complete location of the issue"
            rows={3}
            required
          />
        </div>

        <div className="complaint-form-section">
          <h3>
            <MapPin size={19} /> Location Coordinates
          </h3>

          <p className="complaint-coordinate-note">
            Select the complaint location on the map. Coordinates will be filled
            automatically. You can also enter them manually.
          </p>

          <LocationPicker
            latitude={formData.latitude}
            longitude={formData.longitude}
            onLocationSelect={handleLocationSelect}
          />

          <div className="complaint-coordinate-grid">
            <div>
              <label>Latitude</label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Select a location on the map"
                step="any"
                min="-90"
                max="90"
              />
            </div>

            <div>
              <label>Longitude</label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Select a location on the map"
                step="any"
                min="-180"
                max="180"
              />
            </div>
          </div>
        </div>

        {error && <div className="complaint-form-error">{error}</div>}
        {success && <div className="complaint-form-success">{success}</div>}

        <button
          type="submit"
          className="complaint-submit-btn"
          disabled={loading}
        >
          <Send size={18} />
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
}

export default SubmitComplaint;
