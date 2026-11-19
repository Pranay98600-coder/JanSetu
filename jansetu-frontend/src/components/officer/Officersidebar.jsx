
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  UserCircle,
  Home,
} from "lucide-react";

function OfficerSidebar() {
  return (
    <aside className="officer-sidebar">
      <div className="officer-sidebar-brand">
        <span className="officer-brand-icon">J</span>
        <div>
          <h2>JanSetu</h2>
          <span>Officer Portal</span>
        </div>
      </div>

      <div className="officer-sidebar-section">
        <p className="officer-menu-label">WORKSPACE</p>

        <nav className="officer-sidebar-nav">
          <NavLink
            to="/officer/dashboard"
            className={({ isActive }) =>
              isActive ? "officer-nav-link active" : "officer-nav-link"
            }
          >
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink
            to="/officer/complaints"
            className={({ isActive }) =>
              isActive ? "officer-nav-link active" : "officer-nav-link"
            }
          >
            <ClipboardList size={19} />
            Assigned Complaints
          </NavLink>

          <NavLink
            to="/officer/profile"
            className={({ isActive }) =>
              isActive ? "officer-nav-link active" : "officer-nav-link"
            }
          >
            <UserCircle size={19} />
            My Profile
          </NavLink>

          <NavLink to="/" className="officer-nav-link">
            <Home size={19} />
            Back to Home
          </NavLink>
        </nav>
      </div>

      <div className="officer-sidebar-footer">
        <span>JANSETU OFFICER PANEL</span>
        <p>Serving citizens, building better communities.</p>
      </div>
    </aside>
  );
}

export default OfficerSidebar;
