
import { LogOut, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function OfficerNavbar() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="officer-navbar">
      <div>
        <h3>Officer Workspace</h3>
        <p>Manage and resolve assigned civic complaints</p>
      </div>

      <div className="officer-navbar-user">
        <div className="officer-user-info">
          <strong>{user?.fullName || "Officer"}</strong>
          <span>Field Officer</span>
        </div>

        <UserCircle size={32} color="#0D47A1" />

        <button
          type="button"
          className="officer-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default OfficerNavbar;
