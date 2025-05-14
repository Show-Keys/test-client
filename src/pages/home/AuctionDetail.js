import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getProductDetails } from '../../features/ProductSlice';
import { getBids, placeBid, resetBidState } from '../../features/bidSlice';
import Swal from "sweetalert2";
import axios from 'axios';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import './AuctionDetail.css';

const AuctionDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product } = useSelector((state) => state.products);
  const { bidList, isLoading: bidLoading, isError: bidError, message: bidMessage, isSuccess: bidSuccess } = useSelector((state) => state.bids);
  const { user } = useSelector((state) => state.users);

  const [selectedImage, setSelectedImage] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [minBidAmount, setMinBidAmount] = useState(0);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
      dispatch(getBids(id));
    }
    return () => {
      dispatch(resetBidState());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.imageUrl) {
      setSelectedImage(product.imageUrl);
    }
  }, [product]);

  // Check auction end time and update status
  useEffect(() => {
    if (product?.endTime) {
      const checkAuctionStatus = () => {
        const now = new Date();
        const endTime = new Date(product.endTime);
        const timeLeft = endTime - now;

        if (timeLeft <= 0) {
          setIsAuctionEnded(true);
          setTimeRemaining('Auction has ended');
        } else {
          setIsAuctionEnded(false);
          // Calculate time remaining
          const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
          const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
          
          setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s remaining`);
        }
      };

      checkAuctionStatus();
      const timer = setInterval(checkAuctionStatus, 1000);
      return () => clearInterval(timer);
    }
  }, [product]);

  // Calculate minimum bid amount whenever bidList changes
  useEffect(() => {
    if (bidList.length > 0) {
      const highestBid = Math.max(...bidList.map(bid => bid.bidAmount));
      setMinBidAmount(highestBid + 1);
    } else {
      setMinBidAmount(product?.startingPrice || 0);
    }
  }, [bidList, product]);

  const handleBid = () => {
    if (isAuctionEnded) {
      return Swal.fire("Auction Ended", "This auction has ended. Bidding is no longer allowed.", "info");
    }

    const amount = parseFloat(bidAmount);
    if (!user) return Swal.fire("Login Required", "Please login to place a bid.", "warning");
    if (!amount || amount < minBidAmount) {
      return Swal.fire("Invalid Bid", `Your bid must be at least $${minBidAmount}`, "error");
    }

    dispatch(placeBid({
      productId: id,
      userId: user._id,
      bidderName: user.fullName,
      bidAmount: amount,
    }));
  };

  useEffect(() => {
    if (bidSuccess) {
      setBidAmount('');
    }
  }, [bidSuccess]);

  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  };

  if (!product) return <div className="container">Loading...</div>;

  // Sort bids from highest to lowest
  const sortedBids = [...bidList].sort((a, b) => b.bidAmount - a.bidAmount);

  return (
    <>
      <main className="container">
        <button onClick={() => window.history.back()} style={{ marginBottom: '1.5rem' }}>← Back</button>

        <div className="auction-detail">
          {/* Admin Edit/Delete Buttons at the top */}
          {user && user.role === "admin" && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', justifyContent: 'flex-end' }}>
              <Button
                color="primary"
                size="md"
                tag={Link}
                to={`/editAuction/${product._id}`}
                style={{ minWidth: 110, fontWeight: 600 }}
              >
                <i className="fas fa-edit me-2"></i> Edit Auction
              </Button>
              <Button
                color="danger"
                size="md"
                style={{ minWidth: 110, fontWeight: 600 }}
                onClick={() => {
                  Swal.fire({
                    title: 'Are you sure?',
                    text: 'This will permanently delete the auction.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, delete it!',
                    cancelButtonText: 'Cancel',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                      try {
                        await axios.delete(`https://test-server-j0t3.onrender.com/products/${product._id}`);
                        Swal.fire('Deleted!', 'Auction has been deleted.', 'success').then(() => {
                          navigate('/AdminDashboard');
                        });
                      } catch (err) {
                        Swal.fire('Error', 'Failed to delete auction. Please try again.', 'error');
                      }
                    }
                  });
                }}
              >
                <i className="fas fa-trash me-2"></i> Delete Auction
              </Button>
            </div>
          )}

          <div>
            <div 
              className="main-image" 
              style={{ backgroundImage: `url('${selectedImage}')` }}
            ></div>
            <div className="thumbnail-container">
              {Array.isArray(product.imageGallery) && product.imageGallery.length > 0 ? (
                product.imageGallery.map((img, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                    style={{ backgroundImage: `url('${img}')` }}
                    onClick={() => setSelectedImage(img)}
                  ></div>
                ))
              ) : (
                <div
                  className="thumbnail active"
                  style={{ backgroundImage: `url('${selectedImage}')` }}
                ></div>
              )}
            </div>
          </div>

          <div className="auction-info">
            <h1>{product.name}</h1>
            <p className="description">{product.description}</p>
            
            <div className="auction-status">
              <div className={`status-badge ${isAuctionEnded ? 'ended' : 'active'}`}>
                {isAuctionEnded ? 'Auction Ended' : 'Auction Active'}
              </div>
              <div className="time-remaining">{timeRemaining}</div>
            </div>

            <div className="price-info">
              <div className="current-price">
                <span>Current Highest Bid:</span>
                <span className="price">
                  ${sortedBids.length > 0 ? sortedBids[0].bidAmount : product.startingPrice}
                </span>
              </div>
              <div className="starting-price">
                <span>Starting Price:</span>
                <span className="price">${product.startingPrice}</span>
              </div>
            </div>

            {product.latitude && product.longitude && (
              <div className="location-section">
                <h3>Location</h3>
                <div className="map-container">
                  <iframe
                    title="Auction Location"
                    width="100%"
                    height="300"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={getGoogleMapsUrl(product.latitude, product.longitude)}
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {!isAuctionEnded && (
              <div className="bid-section">
                <div className="bid-input">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Minimum bid: $${minBidAmount}`}
                    min={minBidAmount}
                    step="0.01"
                  />
                  <button 
                    onClick={handleBid}
                    disabled={bidLoading || !user}
                    className="bid-button"
                  >
                    {bidLoading ? 'Placing Bid...' : 'Place Bid'}
                  </button>
                </div>
                {!user && (
                  <p className="login-prompt">Please login to place a bid</p>
                )}
              </div>
            )}

            <div className="bid-history">
              <h3>Bid History</h3>
              {sortedBids.length > 0 ? (
                <div className="bid-list">
                  {sortedBids.map((bid, index) => (
                    <div key={index} className="bid-item">
                      <span className="bidder">{bid.bidderName}</span>
                      <span className="bid-amount">${bid.bidAmount}</span>
                      <span className="bid-time">
                        {new Date(bid.bidTime).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No bids yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AuctionDetail;
