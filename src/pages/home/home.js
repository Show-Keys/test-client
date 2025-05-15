import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/ProductSlice';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import animationData from "../../assets/loadingAnimation.json";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading, isError, message } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
  const isAdmin = user?.role === 'Admin';

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // SweetAlert welcome dialog on mount (only if not logged in)
  useEffect(() => {
    if (!user) {
      Swal.fire({
        title: 'Welcome to the Ultimate Auction Platform!',
        text: 'Would you like to login or continue as a guest?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Continue as Guest',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
        // If cancelled, do nothing (continue as guest)
      });
    }
  }, [navigate, user]);

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle card click with SweetAlert
  const handleCardClick = (productId) => {
    if (!user) {
      Swal.fire({
        title: "Guest Mode",
        text: "You can view the bids, but you must login to place a bid.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Continue",
        allowOutsideClick: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        } else {
          navigate(`/AuctionDetail/${productId}`);
        }
      });
    } else {
      navigate(`/AuctionDetail/${productId}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to the Ultimate Auction Platform</h1>
          <p>Bid and win amazing items at the best prices</p>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for auctions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>Search</button>
          </div>
        </div>
      </section>

      {/* Auctions Section */}
      <main className="container">
        <h2>Featured Auctions</h2>

        {isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '3rem 0' }}>
            <div style={{ width: 120, height: 120, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', boxShadow: '0 2px 16px #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lottie animationData={animationData} loop={true} style={{ width: 100, height: 100 }} />
            </div>
            <div style={{ marginTop: 18, color: '#7c4dff', fontWeight: 600, fontSize: 20, letterSpacing: 1 }}>
              Loading Auctions...
            </div>
            <div style={{ color: '#888', fontSize: 15, marginTop: 6 }}>
              Please wait while we connect you to the best deals online!
            </div>
          </div>
        )}
        {!isLoading && isError && <p>Error: {message}</p>}

        <div className="auctions-grid">
          {filteredProducts.map((product) => (
            <div
              className="auction-card"
              key={product._id}
              style={{ cursor: 'pointer', position: 'relative' }}
              onClick={() => handleCardClick(product._id)}
            >
              <div
                className="auction-img"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              ></div>
              <div className="auction-info">
                <h3 className="auction-title">{product.name}</h3>
                <div className="auction-price">{product.startingPrice} ﷼</div>
                <div className="auction-time">
                  Ends: {new Date(product.endTime).toLocaleString()}
                </div>
              </div>
              {isAdmin && (
                <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 2 }} onClick={e => e.stopPropagation()}>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/edit-auction/${product._id}`)}
                    style={{ marginRight: 4 }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={async () => {
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
                          const res = await fetch(`https://test-server-j0t3.onrender.com/products/${product._id}`, {
                            method: 'DELETE',
                          });
                          const data = await res.json();
                          if (data.success) {
                            Swal.fire('Deleted!', 'Auction has been deleted.', 'success');
                            dispatch(getProducts());
                          } else {
                            Swal.fire('Error', data.message || 'Failed to delete auction.', 'error');
                          }
                        } catch (err) {
                          Swal.fire('Error', 'Failed to delete auction. Please try again.', 'error');
                        }
                      }
                    }}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
