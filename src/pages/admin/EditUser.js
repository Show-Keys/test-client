import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
//import './EditUser.css'; // Create your own styling as needed

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullName: '',
    email: '',
    role: '',
    nationalId: '',
    profilepic: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`https://test-server-j0t3.onrender.com/users/${id}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert('Failed to fetch user');
        navigate('/ManageUsers');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://test-server-j0t3.onrender.com/users/${id}`, user);
      alert('User updated successfully');
      navigate('/ManageUsers');
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <main className="container">
      <h2>Edit User</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <label>Full Name:
            <input type="text" name="fullName" value={user.fullName} onChange={handleChange} required />
          </label>
          <label>Email:
            <input type="email" name="email" value={user.email} onChange={handleChange} required />
          </label>
          <label>National ID:
            <input type="text" name="nationalId" value={user.nationalId} onChange={handleChange} />
          </label>
          <label>Profile Picture URL:
            <input type="text" name="profilepic" value={user.profilepic} onChange={handleChange} />
          </label>
          <label>Role:
            <select name="role" value={user.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </label>

          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => navigate('/ManageUsers')}>Cancel</button>
        </form>
      )}
    </main>
  );
};

export default EditUser;
