import { Outlet } from 'react-router-dom';
import CitizenSidebar from '../components/citizen/CitizenSidebar';
import CitizenNavbar from '../components/citizen/CitizenNavbar';

function CitizenLayout() {
  return (
    <div className="citizen-layout">
      <CitizenSidebar />

      <div className="citizen-main">
        <CitizenNavbar />

        <main className="citizen-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CitizenLayout;