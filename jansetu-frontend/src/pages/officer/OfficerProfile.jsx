
import { UserCircle, Mail, Phone, ShieldCheck, Hash } from "lucide-react";
import authService from "../../services/authService";

function OfficerProfile() {
  const user = authService.getUser();

  return (
    <div className="officer-profile-page">
      <div className="officer-profile-heading">
        <span className="officer-dashboard-tag">ACCOUNT</span>
        <h1>My Profile</h1>
        <p>View your JanSetu officer account information.</p>
      </div>

      <div className="officer-profile-card">
        <div className="officer-profile-banner">
          <div className="officer-profile-avatar">
            <UserCircle size={58} />
          </div>

          <div>
            <h2>{user?.fullName || "Officer"}</h2>
            <span>JanSetu Field Officer</span>
          </div>
        </div>

        <div className="officer-profile-information">
          <h3>Personal Information</h3>

          <div className="officer-profile-field">
            <Hash size={19} />
            <div>
              <span>Officer ID</span>
              <strong>{user?.id ?? "Not available"}</strong>
            </div>
          </div>

          <div className="officer-profile-field">
            <UserCircle size={19} />
            <div>
              <span>Full Name</span>
              <strong>{user?.fullName || "Not available"}</strong>
            </div>
          </div>

          <div className="officer-profile-field">
            <Mail size={19} />
            <div>
              <span>Email Address</span>
              <strong>{user?.email || "Not available"}</strong>
            </div>
          </div>

          <div className="officer-profile-field">
            <Phone size={19} />
            <div>
              <span>Phone Number</span>
              <strong>{user?.phone || "Not provided"}</strong>
            </div>
          </div>

          <div className="officer-profile-field">
            <ShieldCheck size={19} />
            <div>
              <span>Account Role</span>
              <strong>{user?.role || "OFFICER"}</strong>
            </div>
          </div>
        </div>

        <div className="officer-profile-note">
          <ShieldCheck size={19} />
          Your account is registered with the JanSetu Officer Portal.
        </div>
      </div>
    </div>
  );
}

export default OfficerProfile;
