import React, { useState, useEffect } from "react";
import "./Login.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetUserState } from "../../features/UserSlice";
import { useNavigate, Link } from "react-router-dom";

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
      alert("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.user) {
        // Store user data in localStorage if remember is checked
        if (formData.remember) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        // Navigate based on role
        if (result.user.role === "admin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Check for stored user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      if (userData.role === "admin") {
        navigate("/AdminDashboard");
      } else {
        navigate("/home");
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
