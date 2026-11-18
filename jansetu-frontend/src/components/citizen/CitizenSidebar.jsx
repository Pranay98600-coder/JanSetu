import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  ClipboardList,
  MapPin,
  Home
} from 'lucide-react';

function CitizenSidebar() {
  return (
    <aside className="citizen-sidebar">
      <div className="citizen-sidebar-brand">
        <div className="citizen-brand-icon">J</div>
        <div>
          <h2>JanSetu</h2>
          <span>Citizen Portal</span>
        </div>
      </div>

      <div className="citizen-menu-label">MAIN MENU</div>

      <nav className="citizen-nav">
        <NavLink to="/citizen/dashboard" className={({ isActive }) => isActive ? 'citizen-nav-link active' : 'citizen-nav-link'}>
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/citizen/submit-complaint" className={({ isActive }) => isActive ? 'citizen-nav-link active' : 'citizen-nav-link'}>
          <FilePlus size={19} />
          <span>Submit Complaint</span>
        </NavLink>

        <NavLink to="/citizen/complaints" className={({ isActive }) => isActive ? 'citizen-nav-link active' : 'citizen-nav-link'}>
          <ClipboardList size={19} />
          <span>My Complaints</span>
        </NavLink>

        <NavLink to="/citizen/track" className={({ isActive }) => isActive ? 'citizen-nav-link active' : 'citizen-nav-link'}>
          <MapPin size={19} />
          <span>Track Complaint</span>
        </NavLink>
      </nav>

      <div className="citizen-sidebar-bottom">
        <NavLink to="/" className="citizen-nav-link">
          <Home size={19} />
          <span>Back to Home</span>
        </NavLink>
      </div>
    </aside>
  );
}

export default CitizenSidebar;