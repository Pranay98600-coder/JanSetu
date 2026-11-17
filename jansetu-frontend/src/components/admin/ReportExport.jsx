
import { useState } from 'react';
import { Download, FileSpreadsheet, LoaderCircle } from 'lucide-react';
import api from '../../services/api';

function ReportExport() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleExport = async () => {

    try {

      setLoading(true);
      setError('');
      setSuccess('');

      const response = await api.get(
        '/admin/complaints/export',
        {
          responseType: 'blob'
        }
      );

      const blob = new Blob(
        [response.data],
        { type: 'text/csv;charset=utf-8;' }
      );

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = url;
      link.download = 'jansetu-complaints.csv';

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess('Complaint report downloaded successfully.');

    } catch (err) {

      console.error('CSV export error:', err);

      setError('Unable to download complaint report.');

    } finally {

      setLoading(false);

    }
  };

  return (
    <section className="report-export-section">

      <div className="report-export-card">

        <div className="report-export-info">

          <div className="report-export-icon">
            <FileSpreadsheet size={27} />
          </div>

          <div>
            <h3>Complaint Reports</h3>
            <p>
              Download all complaint records in CSV format
              for reporting and analysis.
            </p>
          </div>

        </div>

        <button
          className="export-btn"
          onClick={handleExport}
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={18} className="loading-icon" />
              Preparing...
            </>
          ) : (
            <>
              <Download size={18} />
              Export CSV
            </>
          )}
        </button>

      </div>

      {success && (
        <p className="export-success">{success}</p>
      )}

      {error && (
        <p className="export-error">{error}</p>
      )}

    </section>
  );
}

export default ReportExport;
