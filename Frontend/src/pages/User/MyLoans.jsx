import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import moment from 'moment';

const MyLoans = () => {
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await api.get('/users/loans/me');
        setLoanData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch loan information');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  if (loading) return <div className="spinner"></div>;
  if (error) return <div className="card" style={{ color: 'var(--danger)' }}>{error}</div>;
  if (!loanData) return <div className="card">No loan data available.</div>;

  return (
    <div>
      <div className="flex-between mb-4">
        <h2>My Loan Summaries</h2>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-title">Total Loan Taken</div>
          <div className="stat-value">₹{loanData.totalLoanTaken?.toFixed(2) || '0.00'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Current Balance</div>
          <div className="stat-value" style={{ color: loanData.currentBalance > 0 ? 'var(--danger)' : 'var(--secondary-color)' }}>
            ₹{loanData.currentBalance?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Total Paid</div>
          <div className="stat-value" style={{ color: 'var(--primary-color)' }}>
            ₹{loanData.totalPaid?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      <div className="table-container mt-4">
        <h3 style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', margin: 0 }}>Repayment History</h3>
        {loanData.repayments && loanData.repayments.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount Paid</th>
              </tr>
            </thead>
            <tbody>
              {loanData.repayments.map((repayment, index) => (
                <tr key={index}>
                  <td>{moment(repayment.date).format('MMMM Do YYYY')}</td>
                  <td style={{ color: 'var(--secondary-color)', fontWeight: 500 }}>
                    ₹{repayment.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ padding: '1.5rem', color: '#64748b' }}>No repayment history found.</p>
        )}
      </div>
    </div>
  );
};

export default MyLoans;
