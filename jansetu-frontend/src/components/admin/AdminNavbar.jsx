
import { Bell, UserCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function AdminNavbar() {

  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="admin-navbar">

      <div>
        <h3>Admin Dashboard</h3>
        <p>Manage civic complaints and city operations</p>
      </div>

      <div className="admin-navbar-right">

        <button
          className="notification-btn"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <div className="admin-profile">
          <UserCircle size={30} />

          <div>
            <strong>{user?.fullName || 'Administrator'}</strong>
            <span>{user?.role || 'Admin'}</span>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={19} />
          Logout
        </button>

      </div>

    </header>
  );
}

export default AdminNavbar;
