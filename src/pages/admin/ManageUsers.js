import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ManageUsers.css';

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get('http://localhost:3002/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3002/users/${id}`);
        setUsers(prev => prev.filter(user => user._id !== id));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error('Error deleting user:', err);
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <a href="/AdminDashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className="active">
              <a href="/ManageUsers">
                <i className="fas fa-users"></i> Users
              </a>
            </li>
            <li>
              <a href="/addProduct">
                <i className="fas fa-gavel"></i> Add Auctions
              </a>
            </li>
            <li>
              <a href="/ManageBids">
                <i className="fas fa-money-bill-wave"></i> Manage Bids
              </a>
            </li>

          </ul>
        </nav>
      </aside>

      <main className="main-content">
        <header className="admin-header">
          <h1>Manage Users</h1>
          <p>View and manage all registered users</p>
        </header>

        <div className="container">
          <button onClick={() => navigate('/add-user')} className="add-user-btn">
            <i className="fas fa-user-plus"></i> Add New User
          </button>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              <i className="fas fa-spinner fa-spin"></i> Loading users...
            </div>
          ) : (
            <div className="table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr key={user._id}>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role?.toLowerCase()}`}>
                            {user.role || 'User'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${user.status?.toLowerCase() || 'active'}`}>
                            {user.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => navigate(`/edit-user/${user._id}`)}
                            className="edit-btn"
                          >
                            <i className="fas fa-edit"></i> Edit
                          </button>
                          <button 
                            onClick={() => deleteUser(user._id)}
                            className="delete-btn"
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">
                        <i className="fas fa-users"></i>
                        <p>No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageUsers;
