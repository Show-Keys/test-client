import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert
} from 'reactstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AddProduct.css'; // Reuse AddProduct styles

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

  // Fetch auction details
  useEffect(() => {
    axios.get(`https://test-server-j0t3.onrender.com/products/${id}`)
      .then(res => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch(() => {
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
                        />
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