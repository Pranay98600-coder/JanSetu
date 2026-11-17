
import { useEffect, useState } from 'react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

import { LoaderCircle, AlertCircle } from 'lucide-react';

import api from '../../services/api';

const STATUS_COLORS = {
  SUBMITTED: '#F59E0B',
  UNDER_REVIEW: '#8B5CF6',
  ASSIGNED: '#0EA5E9',
  IN_PROGRESS: '#2563EB',
  RESOLVED: '#16A34A',
  REJECTED: '#DC2626',
  REOPENED: '#F97316',
  CLOSED: '#64748B'
};

const PRIORITY_COLORS = {
  LOW: '#16A34A',
  MEDIUM: '#EAB308',
  HIGH: '#F97316',
  CRITICAL: '#DC2626'
};

function formatLabel(value) {
  return value
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, char => char.toUpperCase());
}

function ComplaintAnalytics() {

  const [statusData, setStatusData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        setLoading(true);
        setError('');

        const [statusResponse, priorityResponse] =
          await Promise.all([
            api.get('/admin/dashboard/status'),
            api.get('/admin/dashboard/priorities')
          ]);

        setStatusData(
          statusResponse.data.map(item => ({
            ...item,
            label: formatLabel(item.status),
            color: STATUS_COLORS[item.status] || '#64748B'
          }))
        );

        setPriorityData(
          priorityResponse.data.map(item => ({
            ...item,
            label: formatLabel(item.priority),
            color: PRIORITY_COLORS[item.priority] || '#64748B'
          }))
        );

      } catch (err) {

        console.error('Analytics API error:', err);

        setError('Unable to load complaint analytics.');

      } finally {

        setLoading(false);

      }
    };

    fetchAnalytics();

  }, []);

  if (loading) {
    return (
      <div className="analytics-loading">
        <LoaderCircle size={30} className="loading-icon" />
        <p>Loading complaint analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <AlertCircle size={25} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="analytics-section">

      <div className="analytics-heading">
        <h2>Complaint Analytics</h2>
        <p>Understand complaint status and priority distribution.</p>
      </div>

      <div className="analytics-grid">

        {/* Complaint Status Chart */}
        <div className="analytics-card">

          <div className="analytics-card-heading">
            <h3>Complaints by Status</h3>
            <span>Status Overview</span>
          </div>

          {statusData.length === 0 ? (
            <p className="analytics-empty">No status data available.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 55 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Complaints"
                    radius={[6, 6, 0, 0]}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Bar>

                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>

        {/* Complaint Priority Chart */}
        <div className="analytics-card">

          <div className="analytics-card-heading">
            <h3>Complaints by Priority</h3>
            <span>Priority Distribution</span>
          </div>

          {priorityData.length === 0 ? (
            <p className="analytics-empty">No priority data available.</p>
          ) : (
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>

                  <Pie
                    data={priorityData}
                    dataKey="count"
                    nameKey="label"
                    cx="50%"
                    cy="45%"
                    outerRadius={105}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`priority-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />

                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}

export default ComplaintAnalytics;
