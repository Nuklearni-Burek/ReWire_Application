import React, { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://88.200.63.148:6361/api/admin/metrics', { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized or failed to load administrative insights.');
        return res.json();
      })
      .then(data => {
        setMetrics(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center mt-5"><h4>Compiling management audit trails...</h4></div>;
  if (error) return <div className="alert alert-danger mt-4 text-center">{error}</div>;

  const totalRevenue = metrics.transactions.reduce((sum, t) => sum + parseFloat(t.price), 0);

  return (
    <div className="mt-4">
      <h2 className="fw-bold mb-4 text-warning">🛡️ Systems Administration Panel</h2>
      
      {/* METRIC CARDS ROW */}
      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card bg-primary text-white h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h6 className="text-uppercase fw-bold opacity-75 small mb-2">Registered Clients</h6>
              <h1 className="fw-black display-5 m-0">{metrics.totalUsers}</h1>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-success text-white h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h6 className="text-uppercase fw-bold opacity-75 small mb-2">Total Platform Listings</h6>
              <h1 className="fw-black display-5 m-0">{metrics.totalItems}</h1>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card bg-dark text-white h-100 shadow-sm border-0 border-top border-warning border-3">
            <div className="card-body d-flex flex-column justify-content-center text-center py-4">
              <h6 className="text-uppercase fw-bold text-warning small mb-2">Gross Volume Managed</h6>
              <h1 className="fw-black display-5 m-0">€{totalRevenue.toFixed(2)}</h1>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}