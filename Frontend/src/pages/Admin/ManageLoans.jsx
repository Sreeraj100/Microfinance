import React, { useCallback, useEffect, useState } from 'react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import Pagination from '../../components/Pagination';

const ITEMS_PER_PAGE = 10;

const ManageLoans = () => {
  const [users, setUsers] = useState([]);               // non-admin users for dropdown
  const [loans, setLoans] = useState([]);               // all loan overview
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userLedger, setUserLedger] = useState(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [txSubmitting, setTxSubmitting] = useState(false);

  // Pagination state
  const [overviewPage, setOverviewPage] = useState(1);
  const [ledgerPage, setLedgerPage] = useState(1);

  // Fetch all users (to pick from when no loan data exists)
  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      // Non-critical; just used for fallback dropdown
    }
  }, []);

  const fetchLoansOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/loans');
      setLoans(response.data);
    } catch (error) {
      toast.error('Failed to load loans overview: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoansOverview();
    fetchUsers();
  }, [fetchLoansOverview, fetchUsers]);

  const fetchUserLedger = async (userId) => {
    setLedgerLoading(true);
    setSelectedUserId(userId);
    setUserLedger(null);
    setLedgerPage(1);
    try {
      const response = await api.get(`/admin/loans/${userId}`);
      setUserLedger(response.data);
    } catch (error) {
      toast.error('Failed to fetch user ledger: ' + (error.response?.data?.message || error.message));
      setSelectedUserId(null);
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleTxSubmit = async (data) => {
    setTxSubmitting(true);
    try {
      await api.post(`/admin/loans/${selectedUserId}/transaction`, {
        type: data.type,
        amount: parseFloat(data.amount),
        date: data.date,
        note: data.note || '',
      });
      toast.success('Transaction recorded successfully');
      reset();
      // Refresh both
      fetchUserLedger(selectedUserId);
      fetchLoansOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add transaction');
    } finally {
      setTxSubmitting(false);
    }
  };

  const goBack = () => {
    setSelectedUserId(null);
    setUserLedger(null);
    setOverviewPage(1);
  };

  if (loading) return <div className="spinner"></div>;

  // Merge: show all users even those with no loan transactions
  const allMembers = users.map(u => {
    const loanRow = loans.find(l => String(l.userId) === String(u._id));
    return loanRow || {
      userId: u._id,
      name: u.name,
      email: u.email,
      totalLoan: 0,
      totalRepayment: 0,
      totalInterest: 0,
      totalFine: 0,
      currentBalance: 0,
    };
  });

  const paginatedMembers = allMembers.slice(
    (overviewPage - 1) * ITEMS_PER_PAGE,
    overviewPage * ITEMS_PER_PAGE
  );

  const transactions = userLedger?.transactions || [];
  const paginatedTx = transactions.slice(
    (ledgerPage - 1) * ITEMS_PER_PAGE,
    ledgerPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex-between mb-4">
        <h2>Manage Loans</h2>
        {selectedUserId && (
          <button className="btn btn-secondary" onClick={goBack}>
            ← Back to Overview
          </button>
        )}
      </div>

      {!selectedUserId ? (
        <>
          {allMembers.length === 0 ? (
            <div className="card">
              <p style={{ color: '#64748b' }}>No members found. Add users first via User Management.</p>
            </div>
          ) : (
            <div className="table-container">
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Total Loan</th>
                      <th>Repaid</th>
                      <th>Interest + Fine</th>
                      <th>Current Balance</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedMembers.map(member => (
                      <tr key={member.userId}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{member.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{member.email}</div>
                        </td>
                        <td>₹{(member.totalLoan || 0).toFixed(2)}</td>
                        <td style={{ color: 'var(--primary-color)' }}>₹{(member.totalRepayment || 0).toFixed(2)}</td>
                        <td style={{ color: '#f59e0b' }}>₹{((member.totalInterest || 0) + (member.totalFine || 0)).toFixed(2)}</td>
                        <td style={{ color: member.currentBalance > 0 ? 'var(--danger)' : '#10b981', fontWeight: 600 }}>
                          ₹{(member.currentBalance || 0).toFixed(2)}
                        </td>
                        <td>
                          <button
                            className="btn btn-primary"
                            style={{ padding: '0.4rem 0.9rem', fontSize: '0.875rem' }}
                            onClick={() => fetchUserLedger(member.userId)}
                          >
                            View / Add
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={overviewPage}
                totalItems={allMembers.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setOverviewPage}
              />
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          {/* Ledger Section */}
          <div style={{ flex: 2, minWidth: '300px' }}>
            {ledgerLoading ? (
              <div className="spinner"></div>
            ) : userLedger ? (
              <>
                <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '1.5rem' }}>
                  <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-title">Current Balance</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: userLedger.summary.currentBalance > 0 ? 'var(--danger)' : '#10b981' }}>
                      ₹{userLedger.summary.currentBalance.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-title">Total Repaid</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}>
                      ₹{userLedger.summary.totalRepayment.toFixed(2)}
                    </div>
                  </div>
                  <div className="stat-card" style={{ padding: '1rem' }}>
                    <div className="stat-title">Total Loaned</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                      ₹{userLedger.summary.totalLoan.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="table-container">
                  <h3 style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', margin: 0 }}>
                    Ledger — {userLedger.user.name}
                  </h3>
                  {transactions.length === 0 ? (
                    <p style={{ padding: '1.5rem', color: '#64748b' }}>No transactions yet. Add one using the form.</p>
                  ) : (
                    <>
                      <div className="table-scroll">
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Type</th>
                              <th>Amount</th>
                              <th>Recorded By</th>
                              <th>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedTx.map(tx => (
                              <tr key={tx._id}>
                                <td>{moment(tx.date).format('MMM Do YYYY')}</td>
                                <td>
                                  <span style={{
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    background:
                                      tx.type === 'loan' ? '#fee2e2' :
                                      tx.type === 'repayment' ? '#dcfce7' :
                                      tx.type === 'interest' ? '#fef3c7' : '#e0e7ff',
                                    color:
                                      tx.type === 'loan' ? '#991b1b' :
                                      tx.type === 'repayment' ? '#166534' :
                                      tx.type === 'interest' ? '#92400e' : '#3730a3',
                                  }}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</td>
                                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{tx.recordedBy?.name || 'Auto'}</td>
                                <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{tx.note || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination
                        currentPage={ledgerPage}
                        totalItems={transactions.length}
                        itemsPerPage={ITEMS_PER_PAGE}
                        onPageChange={setLedgerPage}
                      />
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="card"><p style={{ color: '#ef4444' }}>Could not load ledger. Please try again.</p></div>
            )}
          </div>

          {/* Add Transaction Form */}
          <div className="card" style={{ flex: 1, minWidth: '280px', alignSelf: 'flex-start' }}>
            <h3 className="mb-4">Add Transaction</h3>
            <form onSubmit={handleSubmit(handleTxSubmit)}>
              <div className="input-group">
                <label className="input-label">Transaction Type</label>
                <select className="input-field" {...register('type', { required: true })}>
                  <option value="">— Select Type —</option>
                  <option value="loan">New Loan (Disbursement)</option>
                  <option value="repayment">Repayment</option>
                  <option value="fine">Fine / Penalty</option>
                  <option value="interest">Manual Interest</option>
                </select>
                {errors.type && <p className="error-text">Please select a type</p>}
              </div>

              <div className="input-group">
                <label className="input-label">Amount (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  className="input-field"
                  placeholder="0.00"
                  {...register('amount', { required: true, min: 0.01 })}
                />
                {errors.amount && <p className="error-text">Enter a valid amount</p>}
              </div>

              <div className="input-group">
                <label className="input-label">Date</label>
                <input
                  type="date"
                  className="input-field"
                  defaultValue={moment().format('YYYY-MM-DD')}
                  {...register('date', { required: true })}
                />
                {errors.date && <p className="error-text">Date is required</p>}
              </div>

              <div className="input-group">
                <label className="input-label">Note (Optional)</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. Initial loan disbursement"
                  {...register('note')}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={txSubmitting}>
                {txSubmitting ? 'Recording...' : 'Record Transaction'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageLoans;
