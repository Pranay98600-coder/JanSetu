
import { useEffect, useState } from 'react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

import { LoaderCircle, AlertCircle } from 'lucide-react';

import api from '../../services/api';

function formatMonth(value) {
  const [year, month] = value.split('-');

  return new Date(
    Number(year),
    Number(month) - 1
  ).toLocaleDateString('en-IN', {
    month: 'short',
    year: '2-digit'
  });
}

function MonthlyTrends() {

  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {

    const fetchMonthlyData = async () => {

      try {

        setLoading(true);
        setError('');

        const response = await api.get(
          '/admin/dashboard/monthly'
        );

        const formattedData = response.data.map(item => ({
          ...item,
          label: formatMonth(item.month)
        }));

        setMonthlyData(formattedData);

      } catch (err) {

        console.error('Monthly analytics error:', err);

        setError('Unable to load monthly complaint trends.');

      } finally {

        setLoading(false);

      }
    };

    fetchMonthlyData();

  }, []);

  return (
    <section className="monthly-trends-section">

      <div className="monthly-trends-heading">
        <div>
          <h2>Monthly Complaint Trends</h2>
          <p>Track how complaint submissions change over time.</p>
        </div>
      </div>

      <div className="monthly-trends-card">

        {loading ? (

          <div className="analytics-loading">
            <LoaderCircle size={30} className="loading-icon" />
            <p>Loading monthly trends...</p>
          </div>

        ) : error ? (

          <div className="analytics-error">
            <AlertCircle size={25} />
            <p>{error}</p>
          </div>

        ) : monthlyData.length === 0 ? (

          <p className="analytics-empty">
            No monthly complaint data available.
          </p>

        ) : (

          <div className="monthly-chart-container">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={monthlyData}
                margin={{
                  top: 15,
                  right: 20,
                  left: 0,
                  bottom: 5
                }}
              >

                <defs>
                  <linearGradient
                    id="complaintGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#0D47A1"
                      stopOpacity={0.3}
                    />

                    <stop
                      offset="95%"
                      stopColor="#0D47A1"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    'Complaints'
                  ]}
                />

                <Area
                  type="monotone"
                  dataKey="count"
                  name="Complaints"
                  stroke="#0D47A1"
                  strokeWidth={3}
                  fill="url(#complaintGradient)"
                  activeDot={{ r: 6 }}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        )}

      </div>

    </section>
  );
}

export default MonthlyTrends;
