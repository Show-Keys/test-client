import React, { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  NavbarToggler,
  Collapse,
  Button
} from 'reactstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/UserSlice';
import './Navbar.css';
import defaultAvatar from '../assets/default-avatar.png'; // Optional: fallback image

const NavigationBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const isAdmin = user?.role === 'admin';

  const toggle = () => setIsOpen(!isOpen);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };

  return (
    <div className="navbar-wrapper">
      <Navbar 
        color="dark" 
        dark 
        expand="md" 
        className="custom-navbar"
      >
        <Container>
          {/* User profile image at the top left */}
          {user && (
            <div className="navbar-profile-img">
              <img
                src={user.profilepic || defaultAvatar}
                alt="Profile"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginRight: 16,
                  border: '2px solid #ffc107',
                  background: '#fff'
                }}
              />
            </div>
          )}
          <NavbarBrand tag={Link} to="/home" className="brand-text">
            <i className="fas fa-gavel me-2"></i>
            Auction App
          </NavbarBrand>
          <NavbarToggler onClick={toggle} className="custom-toggler" />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ms-auto" navbar>
              <NavItem>
                <NavLink 
                  tag={Link} 
                  to="/home"
                  className={`nav-link-custom ${isActive('/home') ? 'active' : ''}`}
                >
                  <i className="fas fa-home me-1"></i>
                  Home
                </NavLink>
              </NavItem>
              {!user ? (
                <>
                  <NavItem>
                    <NavLink 
                      tag={Link} 
                      to="/login"
                      className={`nav-link-custom ${isActive('/login') ? 'active' : ''}`}
                    >
                      <i className="fas fa-sign-in-alt me-1"></i>
                      Login
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink 
                      tag={Link} 
                      to="/registerUser"
                      className={`nav-link-custom ${isActive('/registerUser') ? 'active' : ''}`}
                    >
                      <i className="fas fa-user-plus me-1"></i>
                      Register
                    </NavLink>
                  </NavItem>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <NavItem>
                      <Button 
                        tag={Link} 
                        to="/AdminDashboard"
                        color="warning" 
                        className="admin-btn"
                      >
                        <i className="fas fa-user-shield me-1"></i>
                        Admin Dashboard
                      </Button>
                    </NavItem>
                  )}
                  <NavItem>
                    <NavLink 
                      onClick={handleLogout}
                      className="nav-link-custom logout-btn"
                    >
                      <i className="fas fa-sign-out-alt me-1"></i>
                      Logout
                    </NavLink>
                  </NavItem>
                </>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavigationBar;