
import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
  Download,
  ClipboardList,
  CheckCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
  Calendar,
} from "lucide-react";

import api from "../../services/api";
// import "./AdminReports.css";

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

const PRIORITY_COLORS = {
  LOW: "#16A34A",
  MEDIUM: "#EAB308",
  HIGH: "#F97316",
  CRITICAL: "#DC2626",
};

const formatLabel = (value = "") =>
  value.replaceAll("_", " ");

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-IN");

const formatDate = (date = new Date()) =>
  date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

function ReportStatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
}) {
  return (
    <div className="report-stat-card">
      <div
        className="report-stat-icon"
        style={{
          color,
          background: `${color}15`,
        }}
      >
        <Icon size={22} />
      </div>

      <div className="report-stat-content">
        <span>{title}</span>
        <strong>{formatNumber(value)}</strong>
        <small>{description}</small>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [statusData, setStatusData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [exportMessage, setExportMessage] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      setExportMessage("");

      const [
        summaryResponse,
        statusResponse,
        categoryResponse,
        priorityResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard/summary"),
        api.get("/admin/dashboard/status"),
        api.get("/admin/dashboard/categories"),
        api.get("/admin/dashboard/priorities"),
      ]);

      setSummary(summaryResponse.data);
      setStatusData(statusResponse.data || []);
      setCategoryData(categoryResponse.data || []);
      setPriorityData(priorityResponse.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load report data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      setExportMessage("");
      setError("");

      const response = await api.get("/admin/complaints/export", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "text/csv;charset=utf-8;",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = `JanSetu_Complaints_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(downloadUrl);

      setExportMessage("CSV report downloaded successfully.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to export report. Please try again."
      );
    } finally {
      setExporting(false);
    }
  };

  const total = summary?.totalComplaints || 0;

  const resolved =
    (summary?.resolved || 0) + (summary?.closed || 0);

  const pending =
    (summary?.submitted || 0) + (summary?.underReview || 0);

  const active =
    (summary?.assigned || 0) + (summary?.inProgress || 0);

  const resolutionRate =
    total > 0 ? ((resolved / total) * 100).toFixed(1) : "0.0";

  const priorityTotal = priorityData.reduce(
    (acc, item) => acc + Number(item.count || 0),
    0
  );

  const generatedAt = formatDate();

  if (loading) {
    return (
      <div className="admin-reports-page">
        <div className="reports-loading">
          <RefreshCw className="reports-spin" size={30} />
          <h3>Generating reports...</h3>
          <p>Collecting JanSetu complaint statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-reports-page">
      {/* HEADER */}
      <div className="admin-reports-header">
        <div>
          <div className="reports-title-row">
            <FileText size={27} />
            <h1>Reports</h1>
          </div>

          <p>
            Complaint reports, statistics and downloadable records.
          </p>
        </div>

        <div className="reports-header-actions">
          <button
            className="reports-refresh-btn"
            onClick={fetchReports}
            disabled={loading || exporting}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          <button
            className="reports-export-btn"
            onClick={handleExportCSV}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <RefreshCw className="reports-spin" size={17} />
                Exporting...
              </>
            ) : (
              <>
                <Download size={17} />
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* GENERATED DATE */}
      <div className="reports-generated-info">
        <Calendar size={16} />
        <span>Report data generated on {generatedAt}</span>
      </div>

      {/* ERROR */}
      {error && (
        <div className="reports-error">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={fetchReports}>Retry</button>
        </div>
      )}

      {/* SUCCESS */}
      {exportMessage && (
        <div className="reports-success">
          <CheckCircle size={18} />
          {exportMessage}
        </div>
      )}

      {/* OVERVIEW */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <h2>Complaint Overview</h2>
          <p>Summary of complaint handling across JanSetu</p>
        </div>

        <div className="reports-stats-grid">
          <ReportStatCard
            title="Total Complaints"
            value={total}
            description="All registered complaints"
            icon={ClipboardList}
            color="#0D47A1"
          />

          <ReportStatCard
            title="Pending"
            value={pending}
            description="Awaiting review"
            icon={Clock}
            color="#F97316"
          />

          <ReportStatCard
            title="Active"
            value={active}
            description="Assigned or in progress"
            icon={BarChart3}
            color="#8B5CF6"
          />

          <ReportStatCard
            title="Resolved"
            value={resolved}
            description={`${resolutionRate}% resolution rate`}
            icon={CheckCircle}
            color="#16A34A"
          />
        </div>
      </section>

      {/* STATUS REPORT */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <h2>
            <BarChart3 size={20} />
            Status Report
          </h2>
          <p>Breakdown of complaints by current status</p>
        </div>

        <div className="reports-data-card">
          {statusData.length === 0 ? (
            <div className="reports-empty">
              No status data available.
            </div>
          ) : (
            statusData.map((item) => {
              const percentage =
                total > 0
                  ? (item.count / total) * 100
                  : 0;

              return (
                <div className="report-progress-row" key={item.status}>
                  <div className="report-progress-label">
                    <div className="report-label-left">
                      <span
                        className="report-color-dot"
                        style={{
                          background:
                            STATUS_COLORS[item.status] || "#64748B",
                        }}
                      />
                      <span>{formatLabel(item.status)}</span>
                    </div>

                    <div className="report-progress-value">
                      <strong>{formatNumber(item.count)}</strong>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </div>

                  <div className="report-progress-track">
                    <div
                      className="report-progress-fill"
                      style={{
                        width: `${percentage}%`,
                        background:
                          STATUS_COLORS[item.status] || "#64748B",
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* CATEGORY REPORT */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <h2>
            <PieChart size={20} />
            Category Report
          </h2>
          <p>Most commonly reported civic issues</p>
        </div>

        <div className="reports-category-grid">
          {categoryData.length === 0 ? (
            <div className="reports-empty">
              No category data available.
            </div>
          ) : (
            categoryData.map((item, index) => {
              const percentage =
                total > 0
                  ? (item.count / total) * 100
                  : 0;

              return (
                <div
                  className="reports-category-card"
                  key={item.category}
                >
                  <div className="reports-category-top">
                    <div
                      className="reports-category-number"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <span>{formatLabel(item.category)}</span>
                  </div>

                  <strong>{formatNumber(item.count)}</strong>

                  <div className="reports-category-progress">
                    <div
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  <small>
                    {percentage.toFixed(1)}% of total complaints
                  </small>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* PRIORITY REPORT */}
      <section className="reports-section">
        <div className="reports-section-heading">
          <h2>
            <AlertTriangle size={20} />
            Priority Report
          </h2>
          <p>Complaint urgency and priority classification</p>
        </div>

        <div className="reports-priority-grid">
          {priorityData.map((item) => {
            const percentage =
              priorityTotal > 0
                ? (item.count / priorityTotal) * 100
                : 0;

            return (
              <div
                className="reports-priority-card"
                key={item.priority}
              >
                <div className="reports-priority-heading">
                  <span
                    className="report-color-dot"
                    style={{
                      background:
                        PRIORITY_COLORS[item.priority] || "#64748B",
                    }}
                  />
                  {item.priority}
                </div>

                <strong>{formatNumber(item.count)}</strong>

                <div className="reports-priority-track">
                  <div
                    style={{
                      width: `${percentage}%`,
                      background:
                        PRIORITY_COLORS[item.priority] || "#64748B",
                    }}
                  />
                </div>

                <small>
                  {percentage.toFixed(1)}% of complaints
                </small>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXPORT SECTION */}
      <section className="reports-export-section">
        <div className="reports-export-icon">
          <Download size={25} />
        </div>

        <div className="reports-export-content">
          <h3>Download Full Complaint Report</h3>
          <p>
            Export complaint records into a CSV file for offline analysis,
            documentation or further reporting.
          </p>
        </div>

        <button
          className="reports-export-btn"
          onClick={handleExportCSV}
          disabled={exporting}
        >
          {exporting ? (
            <>
              <RefreshCw size={17} className="reports-spin" />
              Preparing...
            </>
          ) : (
            <>
              <Download size={17} />
              Download CSV
            </>
          )}
        </button>
      </section>
    </div>
  );
}
