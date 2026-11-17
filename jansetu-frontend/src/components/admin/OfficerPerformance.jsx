
import { useEffect, useState } from 'react';

import {
  Users,
  CheckCircle,
  Clock,
  ClipboardList,
  LoaderCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import api from '../../services/api';

function OfficerPerformance() {

  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOfficerPerformance = async () => {

    try {

      setLoading(true);
      setError('');

      const response = await api.get(
        '/admin/dashboard/officer-performance'
      );

      setOfficers(response.data);

    } catch (err) {

      console.error('Officer performance API error:', err);

      setError('Unable to load officer performance data.');

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOfficerPerformance();
  }, []);

  return (
    <section className="officer-performance-section">

      <div className="officer-performance-heading">

        <div>
          <h2>Officer Performance</h2>
          <p>Monitor complaint handling by assigned officers.</p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchOfficerPerformance}
          disabled={loading}
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      <div className="officer-performance-card">

        {loading ? (

          <div className="analytics-loading">
            <LoaderCircle size={30} className="loading-icon" />
            <p>Loading officer performance...</p>
          </div>

        ) : error ? (

          <div className="analytics-error">
            <AlertCircle size={25} />
            <p>{error}</p>
          </div>

        ) : officers.length === 0 ? (

          <div className="officer-empty">
            <Users size={35} />
            <h3>No Assigned Officers Yet</h3>
            <p>Officer performance will appear after complaints are assigned.</p>
          </div>

        ) : (

          <div className="officer-table-wrapper">

            <table className="officer-table">

              <thead>
                <tr>
                  <th>Officer</th>
                  <th>Assigned</th>
                  <th>Resolved</th>
                  <th>In Progress</th>
                  <th>Resolution Rate</th>
                </tr>
              </thead>

              <tbody>

                {officers.map((officer) => {

                  const resolutionRate =
                    officer.assignedComplaints > 0
                      ? Math.round(
                          officer.resolvedComplaints /
                          officer.assignedComplaints * 100
                        )
                      : 0;

                  return (

                    <tr key={officer.officerId}>

                      <td>
                        <div className="officer-name-cell">
                          <div className="officer-avatar">
                            {officer.officerName?.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <strong>{officer.officerName}</strong>
                            <span>
                              Officer #{officer.officerId}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="officer-count assigned-count">
                          <ClipboardList size={15} />
                          {officer.assignedComplaints}
                        </span>
                      </td>

                      <td>
                        <span className="officer-count resolved-count">
                          <CheckCircle size={15} />
                          {officer.resolvedComplaints}
                        </span>
                      </td>

                      <td>
                        <span className="officer-count progress-count">
                          <Clock size={15} />
                          {officer.inProgressComplaints}
                        </span>
                      </td>

                      <td>
                        <div className="resolution-rate">
                          <strong>{resolutionRate}%</strong>

                          <div className="rate-progress">
                            <div
                              style={{ width: `${resolutionRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </section>
  );
}

export default OfficerPerformance;
