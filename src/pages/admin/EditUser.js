import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import './EditUser.css';

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
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3002/users/${id}`)
      .then((res) => {
        setUser(res.data);
        setPreview(res.data.profilepic);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire('Error!', 'Failed to fetch user details.', 'error');
        navigate('/ManageUsers');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, profilepic: reader.result }));
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3002/users/${id}`, user);
      Swal.fire('Success!', 'User updated successfully!', 'success').then(() => {
        navigate('/ManageUsers');
      });
    } catch (err) {
      Swal.fire('Error!', 'Failed to update user. Please try again.', 'error');
    }
  };

  return (
    <main className="container">
      <h2>Edit User</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <form className="edit-user-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name:</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nationalId">National ID:</label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={user.nationalId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Profile Picture:</label>
            <div
              {...getRootProps()}
              className="dropzone"
              style={{
                border: '2px dashed #007bff',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                borderRadius: '6px',
                backgroundColor: '#f8f9fa',
              }}
            >
              <input {...getInputProps()} />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
              ) : (
                <p>Drag & drop a file here, or click to select one</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              name="role"
              value={user.role}
              onChange={handleChange}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/ManageUsers')}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
};

export default EditUser;
