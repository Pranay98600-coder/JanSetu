
import { Outlet } from "react-router-dom";
import OfficerSidebar from "../components/officer/OfficerSidebar";
import OfficerNavbar from "../components/officer/OfficerNavbar";

function OfficerLayout() {
  return (
    <div className="officer-layout">
      <OfficerSidebar />

      <div className="officer-main">
        <OfficerNavbar />

        <main className="officer-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default OfficerLayout;
