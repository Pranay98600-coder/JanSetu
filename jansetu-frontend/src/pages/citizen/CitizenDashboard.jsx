import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function CitizenDashboard() {
  const navigate = useNavigate();

  return (
    <div className="citizen-dashboard">
      <div className="citizen-welcome">
        <div>
          <h1>Welcome to JanSetu 👋</h1>
          <p>
            Your voice matters. Report civic issues and help make
            your community better.
          </p>
        </div>

        <button
          className="citizen-submit-btn"
          onClick={() => navigate('/citizen/submit-complaint')}
        >
          <PlusCircle size={19} />
          Submit Complaint
        </button>
      </div>

      <div className="citizen-stats-grid">
        <div className="citizen-stat-card">
          <div className="citizen-stat-icon blue">
            <FileText size={23} />
          </div>
          <div>
            <p>Total Complaints</p>
            <h2>--</h2>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="citizen-stat-icon orange">
            <Clock size={23} />
          </div>
          <div>
            <p>In Progress</p>
            <h2>--</h2>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="citizen-stat-icon green">
            <CheckCircle size={23} />
          </div>
          <div>
            <p>Resolved</p>
            <h2>--</h2>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="citizen-stat-icon red">
            <AlertCircle size={23} />
          </div>
          <div>
            <p>Pending</p>
            <h2>--</h2>
          </div>
        </div>
      </div>

      <div className="citizen-empty-card">
        <div className="citizen-empty-icon">
          <FileText size={35} />
        </div>

        <h2>Your complaints will appear here</h2>
        <p>
          Once you submit a civic complaint, you can monitor its
          progress from your dashboard.
        </p>

        <button
          className="citizen-submit-btn"
          onClick={() => navigate('/citizen/submit-complaint')}
        >
          <PlusCircle size={18} />
          Report an Issue
        </button>
      </div>
    </div>
  );
}

export default CitizenDashboard;