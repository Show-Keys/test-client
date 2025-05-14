import React, { useState, useEffect } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetUserState } from "../../features/UserSlice";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2"; // <-- Add this import

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isError, isSuccess, message, user } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.user) {
        if (formData.remember) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        if (result.user.role === "admin") {
          await Swal.fire({
            title: "Admin Activated!",
            text: "Welcome, admin. You have full access.",
            icon: "success",
            showConfirmButton: false,
            timer: 1800,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          navigate("/AdminDashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      Swal.fire("Login failed", error.message || "Invalid credentials", "error");
    }
  };

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Only auto-navigate if not already on the dashboard/home
      if (window.location.pathname === "/login") {
        if (userData.role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/home");
        }
      }
    }
  }, [navigate]);

  return (
    <div>
      {/* Login Form */}
      <main className="container">
        <div className="auth-container">
          <h1 className="auth-title">Login to Your Account</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">Remember me</label>
            </div>

            <button type="submit" className="auth-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {isError && <p className="error-message">{message}</p>}

            <div className="auth-links">
              <Link to="/registerUser">Create account</Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Auction. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
