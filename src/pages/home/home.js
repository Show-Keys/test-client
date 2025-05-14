import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../features/ProductSlice';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productList, isLoading, isError, message } = useSelector((state) => state.products);
  const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage

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

        {isLoading && <p>Loading products...</p>}
        {isError && <p>Error: {message}</p>}

        <div className="auctions-grid">
          {filteredProducts.map((product) => (
            <div
              className="auction-card"
              key={product._id}
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(product._id)}
            >
              <div
                className="auction-img"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              ></div>
              <div className="auction-info">
                <h3 className="auction-title">{product.name}</h3>
                <div className="auction-price">${product.startingPrice}</div>
                <div className="auction-time">
                  Ends: {new Date(product.endTime).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
