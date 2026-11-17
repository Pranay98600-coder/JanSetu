
import { useEffect, useState } from 'react';

import {
  ClipboardList,
  Clock,
  UserCheck,
  LoaderCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import ComplaintAnalytics from '../../components/admin/ComplaintAnalytics';
import api from '../../services/api';
import MonthlyTrends from '../../components/admin/MonthlyTrends';
import OfficerPerformance from '../../components/admin/OfficerPerformance';
import ReportExport from '../../components/admin/ReportExport';

const dashboardCards = [
  {
    title: 'Total Complaints',
    key: 'totalComplaints',
    icon: ClipboardList,
    color: '#0D47A1',
    background: '#E3F2FD'
  },
  {
    title: 'Submitted',
    key: 'submitted',
    icon: Clock,
    color: '#D97706',
    background: '#FEF3C7'
  },
  {
    title: 'Assigned',
    key: 'assigned',
    icon: UserCheck,
    color: '#7C3AED',
    background: '#EDE9FE'
  },
  {
    title: 'In Progress',
    key: 'inProgress',
    icon: RefreshCw,
    color: '#2563EB',
    background: '#DBEAFE'
  },
  {
    title: 'Resolved',
    key: 'resolved',
    icon: CheckCircle,
    color: '#16A34A',
    background: '#DCFCE7'
  },
  {
    title: 'Rejected',
    key: 'rejected',
    icon: XCircle,
    color: '#DC2626',
    background: '#FEE2E2'
  }
];

function AdminDashboard() {

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardSummary = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get('/admin/dashboard/summary');

      setSummary(response.data);

    } catch (err) {

      console.error('Dashboard API error:', err);

      setError(
        err.response?.status === 401
          ? 'Your session has expired. Please log in again.'
          : err.response?.status === 403
            ? 'You do not have permission to view this dashboard.'
            : 'Unable to load dashboard statistics.'
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoaderCircle className="loading-icon" size={35} />
        <p>Loading dashboard statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <AlertCircle size={35} />
        <h3>Dashboard Loading Failed</h3>
        <p>{error}</p>

        <button onClick={fetchDashboardSummary}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      <div className="dashboard-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>Here's what's happening with JanSetu today.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchDashboardSummary}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="dashboard-stats-grid">

        {dashboardCards.map((card) => {

          const Icon = card.icon;

          return (
            <div className="stat-card" key={card.key}>

              <div
                className="stat-icon"
                style={{
                  color: card.color,
                  background: card.background
                }}
              >
                <Icon size={23} />
              </div>

              <div className="stat-details">
                <p>{card.title}</p>

                <h2>
                  {summary?.[card.key] ?? 0}
                </h2>
              </div>

            </div>
          );
        })}

      </div>

      <ComplaintAnalytics />

<MonthlyTrends />

<OfficerPerformance />

<ReportExport />

      <div className="dashboard-welcome">
        <h2>Welcome to JanSetu Admin Panel</h2>

        <p>
          Monitor complaints, manage officers and
          improve civic services through JanSetu.
        </p>
      </div>

    </div>
  );
}

export default AdminDashboard;
