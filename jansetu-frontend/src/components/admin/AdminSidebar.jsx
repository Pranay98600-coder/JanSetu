
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  ChartColumn,
  Download,
  Settings,
  Landmark
} from 'lucide-react';

import { NavLink } from 'react-router-dom';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'Complaints',
    path: '/admin/complaints',
    icon: ClipboardList
  },
  {
    name: 'Officers',
    path: '/admin/officers',
    icon: Users
  },
  {
    name: 'Analytics',
    path: '/admin/analytics',
    icon: ChartColumn
  },
  {
    name: 'Reports',
    path: '/admin/reports',
    icon: Download
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: Settings
  }
];

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <div className="admin-brand">
        <Landmark size={27} />
        <div>
          <h2>JanSetu</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-heading">MAIN MENU</p>

        <nav className="sidebar-menu">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link active' : 'sidebar-link'
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <p>Connecting Citizens.</p>
        <p>Creating Better Communities.</p>
        <span>© 2026 JanSetu</span>
      </div>

    </aside>
  );
}

export default AdminSidebar;
