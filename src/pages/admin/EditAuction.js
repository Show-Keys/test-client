import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert
} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddProduct.css'; // Reuse AddProduct styles
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icon fix for React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationPicker({ setFormData }) {
  useMapEvents({
    click(e) {
      setFormData(prev => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
  });
  return null;
}

const EditAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startingPrice: '',
    endTime: '',
    imageUrl: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [hasBids, setHasBids] = useState(false); // <-- Track if there are bids

  // Fetch auction details and bids
  useEffect(() => {
    const fetchAuction = axios.get(`https://test-server-j0t3.onrender.com/products/${id}`);
    const fetchBids = axios.get(`https://test-server-j0t3.onrender.com/bids?productId=${id}`);

    Promise.all([fetchAuction, fetchBids])
      .then(([auctionRes, bidsRes]) => {
        // Defensive: handle error from backend
        if (auctionRes.data && auctionRes.data.success === false) {
          setError(auctionRes.data.message || 'Failed to fetch auction details.');
          setLoading(false);
          return;
        }
        // Ensure all fields are strings for controlled inputs
        const product = auctionRes.data;
        setFormData({
          name: product.name || '',
          description: product.description || '',
          startingPrice: product.startingPrice !== undefined ? String(product.startingPrice) : '',
          endTime: product.endTime ? product.endTime.slice(0, 16) : '', // for datetime-local
          imageUrl: product.imageUrl || '',
          latitude: product.latitude !== undefined ? String(product.latitude) : '',
          longitude: product.longitude !== undefined ? String(product.longitude) : '',
        });
        setHasBids(Array.isArray(bidsRes.data) && bidsRes.data.length > 0);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch auction details.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://test-server-j0t3.onrender.com/products/${id}`, formData);
      Swal.fire('Success!', 'Auction updated successfully!', 'success').then(() => {
        navigate('/AdminDashboard');
      });
    } catch (err) {
      Swal.fire('Error!', 'Failed to update auction. Please try again.', 'error');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire('Error', 'Geolocation is not supported by your browser.', 'error');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGeoLoading(false);
        Swal.fire('Success', 'Location fetched!', 'success');
      },
      (error) => {
        setGeoLoading(false);
        Swal.fire('Error', 'Unable to retrieve your location.', 'error');
      }
    );
  };

  return (
    <div className="admin-container">
      <main className="main-content">
        <header className="admin-header">
          <h1>Edit Auction</h1>
          <p>Update auction details</p>
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
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
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
                        />
                      </FormGroup>
                      <FormGroup className="mb-4">
                        <Label for="startingPrice">Starting Price</Label>
                        <Input
                          type="number"
                          name="startingPrice"
                          id="startingPrice"
                          value={formData.startingPrice}
                          onChange={handleChange}
                          required
                          disabled={hasBids} // <-- Disable if there are bids
                        />
                        {hasBids && (
                          <div style={{ color: '#dc3545', fontSize: '0.95em', marginTop: '0.25rem' }}>
                            Cannot edit starting price: there are active bids.
                          </div>
                        )}
                      </FormGroup>
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
                      <FormGroup className="mb-4">
                        <Label for="imageUrl">Image URL</Label>
                        <Input
                          type="text"
                          name="imageUrl"
                          id="imageUrl"
                          value={formData.imageUrl}
                          onChange={handleChange}
                        />
                        {formData.imageUrl && (
                          <img
                            src={formData.imageUrl}
                            alt="Auction"
                            style={{ width: '120px', marginTop: '10px', borderRadius: '8px' }}
                          />
                        )}
                      </FormGroup>
                      <FormGroup className="mb-4">
                        <Label for="latitude">Latitude</Label>
                        <Input
                          type="number"
                          name="latitude"
                          id="latitude"
                          value={formData.latitude}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <FormGroup className="mb-4">
                        <Label for="longitude">Longitude</Label>
                        <Input
                          type="number"
                          name="longitude"
                          id="longitude"
                          value={formData.longitude}
                          onChange={handleChange}
                        />
                      </FormGroup>
                      <Button
                        type="button"
                        color="info"
                        className="mb-3"
                        onClick={handleGetLocation}
                        disabled={geoLoading}
                      >
                        {geoLoading ? 'Getting Location...' : 'Use My Current Location'}
                      </Button>
                      <MapContainer
                        center={[formData.latitude || 0, formData.longitude || 0]}
                        zoom={formData.latitude && formData.longitude ? 13 : 2}
                        style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {formData.latitude && formData.longitude && (
                          <Marker position={[formData.latitude, formData.longitude]} />
                        )}
                        <LocationPicker setFormData={setFormData} />
                      </MapContainer>
                      <div className="d-flex gap-3">
                        <Button color="primary" type="submit" className="px-4">
                          <i className="fas fa-save me-2"></i>
                          Save Changes
                        </Button>
                        <Button
                          color="secondary"
                          onClick={() => navigate('/AdminDashboard')}
                          className="px-4"
                        >
                          <i className="fas fa-times me-2"></i>
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default EditAuction;