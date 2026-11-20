
import { useEffect, useState } from "react";
import {
  Settings,
  Bell,
  ShieldCheck,
  Server,
  Database,
  Lock,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
} from "lucide-react";

// import "./AdminSettings.css";

const DEFAULT_SETTINGS = {
  complaintUpdates: true,
  criticalAlerts: true,
  officerAssignments: true,
  weeklyReports: false,
};

function SettingToggle({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="admin-setting-item">
      <div className="admin-setting-text">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>

      <label className="admin-setting-toggle">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />

        <span className="admin-setting-slider" />
      </label>
    </div>
  );
}

export default function AdminSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem("jansetu_admin_settings");

    if (savedSettings) {
      try {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(savedSettings),
        });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));

    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(
      "jansetu_admin_settings",
      JSON.stringify(settings)
    );

    setSaved(true);
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("jansetu_admin_settings");
    setSaved(false);
  };

  return (
    <div className="admin-settings-page">
      {/* HEADER */}
      <div className="admin-settings-header">
        <div>
          <div className="admin-settings-title">
            <Settings size={27} />
            <h1>Settings</h1>
          </div>

          <p>
            Manage your JanSetu administrator preferences and
            platform information.
          </p>
        </div>
      </div>

      {/* SAVE MESSAGE */}
      {saved && (
        <div className="admin-settings-success">
          <CheckCircle size={18} />
          Your preferences have been saved successfully.
        </div>
      )}

      {/* NOTIFICATIONS */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <div className="admin-settings-section-icon notification-icon">
            <Bell size={21} />
          </div>

          <div>
            <h2>Notification Preferences</h2>
            <p>Control which notifications you prefer to receive.</p>
          </div>
        </div>

        <div className="admin-settings-card">
          <SettingToggle
            title="Complaint Updates"
            description="Receive updates when complaint records change."
            checked={settings.complaintUpdates}
            onChange={(e) =>
              updateSetting("complaintUpdates", e.target.checked)
            }
          />

          <SettingToggle
            title="Critical Complaint Alerts"
            description="Highlight high urgency and critical complaints."
            checked={settings.criticalAlerts}
            onChange={(e) =>
              updateSetting("criticalAlerts", e.target.checked)
            }
          />

          <SettingToggle
            title="Officer Assignment Notifications"
            description="Track officer assignment and reassignment activities."
            checked={settings.officerAssignments}
            onChange={(e) =>
              updateSetting("officerAssignments", e.target.checked)
            }
          />

          <SettingToggle
            title="Weekly Reports"
            description="Enable your preference for weekly report reminders."
            checked={settings.weeklyReports}
            onChange={(e) =>
              updateSetting("weeklyReports", e.target.checked)
            }
          />
        </div>
      </section>

      {/* SECURITY */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <div className="admin-settings-section-icon security-icon">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2>Security & Access</h2>
            <p>Information about your administrator access.</p>
          </div>
        </div>

        <div className="admin-settings-card">
          <div className="admin-settings-information-row">
            <div className="admin-settings-info-icon">
              <Lock size={19} />
            </div>

            <div className="admin-settings-info-content">
              <h4>Authentication</h4>
              <p>
                JanSetu uses authenticated access to protect
                administrator resources.
              </p>
            </div>

            <span className="settings-status-badge secure">
              Protected
            </span>
          </div>

          <div className="admin-settings-information-row">
            <div className="admin-settings-info-icon">
              <ShieldCheck size={19} />
            </div>

            <div className="admin-settings-info-content">
              <h4>Role-Based Access Control</h4>
              <p>
                Admin, Citizen and Officer access is separated
                according to assigned roles.
              </p>
            </div>

            <span className="settings-status-badge secure">
              Enabled
            </span>
          </div>

          <div className="admin-settings-security-note">
            <AlertTriangle size={18} />
            <span>
              Password management and active-session management
              are not configurable from this page yet.
            </span>
          </div>
        </div>
      </section>

      {/* SYSTEM INFORMATION */}
      <section className="admin-settings-section">
        <div className="admin-settings-section-header">
          <div className="admin-settings-section-icon system-icon">
            <Server size={21} />
          </div>

          <div>
            <h2>System Information</h2>
            <p>Technology and platform information.</p>
          </div>
        </div>

        <div className="admin-settings-system-grid">
          <div className="admin-settings-system-card">
            <div className="admin-settings-info-icon">
              <Server size={20} />
            </div>

            <span>Platform</span>
            <strong>JanSetu</strong>
            <small>Civic Issue Management System</small>
          </div>

          <div className="admin-settings-system-card">
            <div className="admin-settings-info-icon">
              <Database size={20} />
            </div>

            <span>Database</span>
            <strong>MySQL</strong>
            <small>Relational Database</small>
          </div>

          <div className="admin-settings-system-card">
            <div className="admin-settings-info-icon">
              <Lock size={20} />
            </div>

            <span>Authentication</span>
            <strong>JWT</strong>
            <small>Token-based authentication</small>
          </div>
        </div>
      </section>

      {/* PREFERENCES ACTIONS */}
      <section className="admin-settings-actions">
        <div>
          <h3>Save Preferences</h3>
          <p>
            Changes to notification preferences are stored in
            this browser.
          </p>
        </div>

        <div className="admin-settings-action-buttons">
          <button
            className="admin-settings-reset-btn"
            onClick={handleReset}
          >
            <RotateCcw size={17} />
            Reset
          </button>

          <button
            className="admin-settings-save-btn"
            onClick={handleSave}
          >
            <CheckCircle size={17} />
            Save Changes
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <div className="admin-settings-footer">
        <ShieldCheck size={16} />
        <span>
          JanSetu Administration Panel · Secure Administrative Access
        </span>
      </div>
    </div>
  );
}
