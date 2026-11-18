import { Bell, LogOut, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function CitizenNavbar() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="citizen-navbar">
      <div>
        <h3>Citizen Portal</h3>
        <p>Report problems. Improve your community.</p>
      </div>

      <div className="citizen-navbar-actions">
        <button className="citizen-icon-btn" title="Notifications">
          <Bell size={20} />
        </button>

        <div className="citizen-profile">
          <UserCircle size={30} />
          <div>
            <strong>{user?.fullName || 'Citizen'}</strong>
            <span>Citizen</span>
          </div>
        </div>

        <button className="citizen-logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default CitizenNavbar;