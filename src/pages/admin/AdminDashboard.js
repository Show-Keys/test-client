import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats } from '../../features/ProductSlice';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, isLoading, isError, message } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className="active">
              <Link to="/AdminDashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/ManageUsers">
                <i className="fas fa-users"></i> Users
              </Link>
            </li>
            <li>
              <Link to="/addProduct">
                <i className="fas fa-gavel"></i> Add Auctions
              </Link>
            </li>


          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="admin-header">
          <h1>Dashboard</h1>
          <p>Welcome back, <strong>Admin</strong></p>
        </header>

        {isError && (
          <div className="alert alert-danger" role="alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            {message}
          </div>
        )}

        <section className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            {isLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <p>{formatNumber(dashboardStats.totalUsers)}</p>
            )}
          </div>
          <div className="stat-card">
            <h3>Active Auctions</h3>
            {isLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <p>{formatNumber(dashboardStats.activeAuctions)}</p>
            )}
          </div>
          <div className="stat-card">
            <h3>Total Bids</h3>
            {isLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <p>{formatNumber(dashboardStats.totalBids)}</p>
            )}
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            {isLoading ? (
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : (
              <p>{formatCurrency(dashboardStats.totalRevenue)}</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
