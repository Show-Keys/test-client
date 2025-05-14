import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert
} from 'reactstrap';
import { addProduct, reset } from '../../features/ProductSlice';
import Swal from "sweetalert2";
import './AddProduct.css';

const AddProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startingPrice: '',
    endTime: '',
    imageUrl: '',
    latitude: '',
    longitude: ''
  });
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ lat: null, lng: null });

  // Reset state when component mounts
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          Swal.fire("Location Error", "Unable to get your location. Please enter coordinates manually.", "error");
        }
      );
    } else {
      Swal.fire("Not Supported", "Geolocation is not supported by your browser. Please enter coordinates manually.", "warning");
    }
  }, []);

  // Handle success and error states
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        dispatch(reset());
        navigate('/AdminDashboard');
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (isError) {
      setError(message);
    }
  }, [isSuccess, isError, message, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.description || !formData.startingPrice || !formData.imageUrl || !formData.endTime) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    // Validate location
    if (!formData.latitude || !formData.longitude) {
      Swal.fire("Error", "Please provide location coordinates", "error");
      return;
    }

    // Convert startingPrice to number
    const productData = {
      ...formData,
      startingPrice: parseFloat(formData.startingPrice)
    };

    dispatch(addProduct(productData));
  };

  const getGoogleMapsUrl = (lat, lng) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  };

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
            <li>
              <a href="/ManageUsers">
                <i className="fas fa-users"></i> Users
              </a>
            </li>
            <li className="active">
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
          <h1>Add New Auction</h1>
          <p>Create a new auction listing</p>
        </header>

        <Container fluid className="px-4">
          <Row>
            <Col lg={8} className="mx-auto">
              <Card className="shadow-sm">
                <CardBody className="p-4">
                  {error && (
                    <Alert color="danger" className="mb-4">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {isSuccess && (
                    <Alert color="success" className="mb-4">
                      <i className="fas fa-check-circle me-2"></i>
                      Product created successfully! Redirecting...
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <FormGroup className="mb-4">
                      <Label for="name">Product Name</Label>
                      <Input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter product name"
                      />
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <Label for="description">Description</Label>
                      <Input
                        type="textarea"
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter product description"
                        rows="4"
                      />
                    </FormGroup>

                    <Row>
                      <Col md={6}>
                        <FormGroup className="mb-4">
                          <Label for="startingPrice">Starting Price (﷼)</Label>
                          <Input
                            type="number"
                            name="startingPrice"
                            id="startingPrice"
                            value={formData.startingPrice}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            placeholder="Enter starting price"
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup className="mb-4">
                          <Label for="endTime">End Time</Label>
                          <Input
                            type="datetime-local"
                            name="endTime"
                            id="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <FormGroup className="mb-4">
                      <Label for="imageUrl">Main Image URL</Label>
                      <Input
                        type="url"
                        name="imageUrl"
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                        placeholder="Enter main image URL"
                      />
                    </FormGroup>

                    <FormGroup className="mb-4">
                      <Label>Location</Label>
                      <Row>
                        <Col md={6}>
                          <Input
                            type="number"
                            name="latitude"
                            placeholder="Latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            step="any"
                            required
                            readOnly
                          />
                        </Col>
                        <Col md={6}>
                          <Input
                            type="number"
                            name="longitude"
                            placeholder="Longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            step="any"
                            required
                            readOnly
                          />
                        </Col>
                      </Row>
                      {formData.latitude && formData.longitude && (
                        <div className="mt-3">
                          <iframe
                            title="Location Map"
                            width="100%"
                            height="200"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={getGoogleMapsUrl(formData.latitude, formData.longitude)}
                            allowFullScreen
                          />
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex gap-3">
                      <Button
                        color="primary"
                        type="submit"
                        className="px-4"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-plus me-2"></i>
                            Create Auction
                          </>
                        )}
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          dispatch(reset());
                          navigate('/AdminDashboard');
                        }}
                        className="px-4"
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default AddProduct;