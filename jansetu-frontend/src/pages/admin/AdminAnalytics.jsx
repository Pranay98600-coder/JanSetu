
import { useEffect, useState } from "react";
import {
  RefreshCw,
  TrendingUp,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart as PieIcon,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

import api from "../../services/api";
// import "./AdminAnalytics.css";

const COLORS = [
  "#0D47A1",
  "#16A34A",
  "#F97316",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#EAB308",
  "#64748B",
];

const PRIORITY_COLORS = {
  LOW: "#16A34A",
  MEDIUM: "#EAB308",
  HIGH: "#F97316",
  CRITICAL: "#DC2626",
};

const STATUS_COLORS = {
  SUBMITTED: "#3B82F6",
  UNDER_REVIEW: "#F59E0B",
  ASSIGNED: "#8B5CF6",
  IN_PROGRESS: "#06B6D4",
  RESOLVED: "#16A34A",
  REJECTED: "#DC2626",
  REOPENED: "#F97316",
  CLOSED: "#64748B",
};

const formatLabel = (value = "") =>
  value.replaceAll("_", " ");

const numberFormat = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}) => (
  <div className="analytics-stat-card">
    <div
      className="analytics-stat-icon"
      style={{
        background: `${color}15`,
        color,
      }}
    >
      <Icon size={22} />
    </div>

    <div className="analytics-stat-content">
      <span>{title}</span>
      <strong>{numberFormat(value)}</strong>
      <small>{subtitle}</small>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, icon: Icon }) => (
  <div className="analytics-chart-card">
    <div className="analytics-chart-header">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      {Icon && (
        <div className="analytics-chart-icon">
          <Icon size={19} />
        </div>
      )}
    </div>

    <div className="analytics-chart-body">
      {children}
    </div>
  </div>
);

export default function AdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        summaryResponse,
        statusResponse,
        categoryResponse,
        priorityResponse,
        monthlyResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard/summary"),
        api.get("/admin/dashboard/status"),
        api.get("/admin/dashboard/categories"),
        api.get("/admin/dashboard/priorities"),
        api.get("/admin/dashboard/monthly"),
      ]);

      setSummary(summaryResponse.data);
      setStatusData(statusResponse.data || []);
      setCategoryData(categoryResponse.data || []);
      setPriorityData(priorityResponse.data || []);
      setMonthlyData(monthlyResponse.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load analytics data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const resolvedCount =
    (summary?.resolved || 0) + (summary?.closed || 0);

  const activeCount =
    (summary?.assigned || 0) + (summary?.inProgress || 0);

  const pendingCount =
    (summary?.submitted || 0) + (summary?.underReview || 0);

  const resolutionRate =
    summary?.totalComplaints > 0
      ? ((resolvedCount / summary.totalComplaints) * 100).toFixed(1)
      : "0.0";

  const priorityTotal = priorityData.reduce(
    (sum, item) => sum + Number(item.count || 0),
    0
  );

  if (loading) {
    return (
      <div className="admin-analytics-page">
        <div className="analytics-loading">
          <RefreshCw className="analytics-spin" size={30} />
          <h3>Loading analytics...</h3>
          <p>Preparing your complaint insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-analytics-page">
      {/* Header */}
      <div className="admin-analytics-header">
        <div>
          <div className="analytics-title-row">
            <BarChart3 size={27} />
            <h1>Analytics & Insights</h1>
          </div>

          <p>
            Monitor complaint trends, distribution and resolution performance.
          </p>
        </div>

        <button
          className="analytics-refresh-btn"
          onClick={fetchAnalytics}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="analytics-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={fetchAnalytics}>Retry</button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="analytics-stats-grid">
        <StatCard
          title="Total Complaints"
          value={summary?.totalComplaints}
          subtitle="All registered complaints"
          icon={ClipboardList}
          color="#0D47A1"
        />

        <StatCard
          title="Pending Review"
          value={pendingCount}
          subtitle="Submitted / under review"
          icon={Clock}
          color="#F97316"
        />

        <StatCard
          title="Active Complaints"
          value={activeCount}
          subtitle="Assigned / in progress"
          icon={TrendingUp}
          color="#8B5CF6"
        />

        <StatCard
          title="Resolved Complaints"
          value={resolvedCount}
          subtitle={`${resolutionRate}% of total complaints`}
          icon={CheckCircle}
          color="#16A34A"
        />
      </div>

      {/* Status Chart */}
      <div className="analytics-charts-grid">
        <ChartCard
          title="Complaint Status Overview"
          subtitle="Current distribution by complaint status"
          icon={BarChart3}
        >
          {statusData.length === 0 ? (
            <div className="analytics-empty-chart">
              No status data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={statusData}
                margin={{
                  top: 15,
                  right: 15,
                  left: 0,
                  bottom: 45,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="status"
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                  tickFormatter={formatLabel}
                  tick={{ fontSize: 11 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [value, "Complaints"]}
                  labelFormatter={formatLabel}
                />

                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`status-${index}`}
                      fill={
                        STATUS_COLORS[entry.status] ||
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Category Chart */}
        <ChartCard
          title="Complaints by Category"
          subtitle="Identify the most reported civic issues"
          icon={BarChart3}
        >
          {categoryData.length === 0 ? (
            <div className="analytics-empty-chart">
              No category data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 25,
                  left: 20,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                <XAxis type="number" allowDecimals={false} />

                <YAxis
                  type="category"
                  dataKey="category"
                  width={100}
                  tickFormatter={formatLabel}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => [value, "Complaints"]}
                  labelFormatter={formatLabel}
                />

                <Bar
                  dataKey="count"
                  fill="#0D47A1"
                  radius={[0, 6, 6, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Priority Chart */}
        <ChartCard
          title="Priority Distribution"
          subtitle="Complaint urgency breakdown"
          icon={PieIcon}
        >
          {priorityData.length === 0 ? (
            <div className="analytics-empty-chart">
              No priority data available.
            </div>
          ) : (
            <div className="analytics-pie-wrapper">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="count"
                    nameKey="priority"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={58}
                    paddingAngle={3}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`priority-${index}`}
                        fill={
                          PRIORITY_COLORS[entry.priority] ||
                          COLORS[index % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      value,
                      formatLabel(name),
                    ]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    formatter={(value) => formatLabel(value)}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="analytics-pie-center">
                <strong>{numberFormat(priorityTotal)}</strong>
                <span>Complaints</span>
              </div>
            </div>
          )}
        </ChartCard>

        {/* Monthly Chart */}
        <ChartCard
          title="Monthly Complaint Trends"
          subtitle="Complaint registrations over time"
          icon={TrendingUp}
        >
          {monthlyData.length === 0 ? (
            <div className="analytics-empty-chart">
              No monthly data available.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart
                data={monthlyData}
                margin={{
                  top: 15,
                  right: 15,
                  left: 0,
                  bottom: 10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />

                <YAxis allowDecimals={false} />

                <Tooltip
                  formatter={(value) => [value, "Complaints"]}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0D47A1"
                  fill="#0D47A1"
                  fillOpacity={0.14}
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Status Summary */}
      <div className="analytics-status-summary">
        <div className="analytics-status-summary-header">
          <h3>Status Breakdown</h3>
          <span>Detailed complaint totals</span>
        </div>

        <div className="analytics-status-grid">
          {statusData.map((item, index) => (
            <div
              className="analytics-status-item"
              key={item.status}
            >
              <div className="analytics-status-item-label">
                <span
                  className="analytics-status-dot"
                  style={{
                    background:
                      STATUS_COLORS[item.status] ||
                      COLORS[index % COLORS.length],
                  }}
                />

                <span>{formatLabel(item.status)}</span>
              </div>

              <strong>{numberFormat(item.count)}</strong>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Summary */}
      <div className="analytics-priority-summary">
        <div className="analytics-status-summary-header">
          <h3>Priority Breakdown</h3>
          <span>Complaint urgency levels</span>
        </div>

        <div className="analytics-priority-grid">
          {priorityData.map((item) => (
            <div
              className="analytics-priority-item"
              key={item.priority}
            >
              <div className="analytics-priority-item-top">
                <span
                  className="analytics-priority-dot"
                  style={{
                    background:
                      PRIORITY_COLORS[item.priority] || "#64748B",
                  }}
                />

                <span>{item.priority}</span>
              </div>

              <strong>{numberFormat(item.count)}</strong>

              <div className="analytics-priority-progress">
                <div
                  style={{
                    width:
                      priorityTotal > 0
                        ? `${(item.count / priorityTotal) * 100}%`
                        : "0%",
                    background:
                      PRIORITY_COLORS[item.priority] || "#64748B",
                  }}
                />
              </div>

              <small>
                {priorityTotal > 0
                  ? `${((item.count / priorityTotal) * 100).toFixed(1)}%`
                  : "0%"}
                {" "}of complaints
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
