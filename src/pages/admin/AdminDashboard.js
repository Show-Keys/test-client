import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardStats, getProducts } from '../../features/ProductSlice';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardStats, isLoading, isError, message, productList } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getProducts()); // Fetch all products for admin list
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the auction.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`https://test-server-j0t3.onrender.com/products/${id}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (data.success) {
          Swal.fire('Deleted!', 'Auction has been deleted.', 'success');
          dispatch(getProducts()); // Refresh list
        } else {
          Swal.fire('Error', data.message || 'Failed to delete auction.', 'error');
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to delete auction. Please try again.', 'error');
      }
    }
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
            <li>
              <Link to="/ManageBids">
                <i className="fas fa-money-bill-wave"></i> Manage Bids
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

        <section className="admin-auctions-list mt-5">
          <h2>All Auctions</h2>
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i> Loading auctions...
            </div>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Start Price</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList && productList.length > 0 ? productList.map(product => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>${product.startingPrice}</td>
                    <td>{new Date(product.endTime).toLocaleString()}</td>
                    <td>
                      {isAdmin ? (
                        <>
                          <Link to={`/editAuction/${product._id}`} className="btn btn-primary btn-sm me-2">
                            <i className="fas fa-edit"></i> Edit
                          </Link>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4">No auctions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
