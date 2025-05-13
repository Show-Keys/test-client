import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from 'axios';
import {
  Container, Row, Col,
  FormGroup, Label, Button,
  Card, CardBody, CardTitle
} from 'reactstrap';

import { registerValidationSchema } from '../../validations/RegValidation';

const AddUser = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(registerValidationSchema)
  });

  const onSubmit = async (data) => {
    try {
      const defaultPic = "https://cdn.vectorstock.com/i/500p/97/32/man-silhouette-profile-picture-vector-2139732.jpg";
      const userData = {
        ...data,
        profilepic: data.profilepic || defaultPic,
        role: 'User'
      };

      await axios.post('http://localhost:3002/registerUser', userData);
      alert('User created successfully!');
      navigate('/ManageUsers');
    } catch (err) {
      alert('Error creating user: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h3" className="text-center mb-4">
                  Add New User
                </CardTitle>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormGroup>
                    <Label>Full Name</Label>
                    <input className="form-control" {...register("fullName")} />
                    <p className="text-danger">{errors.fullName?.message}</p>
                  </FormGroup>

                  <FormGroup>
                    <Label>Email</Label>
                    <input type="email" className="form-control" {...register("email")} />
                    <p className="text-danger">{errors.email?.message}</p>
                  </FormGroup>

                  <FormGroup>
                    <Label>Profile Picture URL</Label>
                    <input className="form-control" {...register("profilepic")} />
                  </FormGroup>

                  <FormGroup>
                    <Label>National ID</Label>
                    <input className="form-control" {...register("nationalId")} />
                    <p className="text-danger">{errors.nationalId?.message}</p>
                  </FormGroup>

                  <FormGroup>
                    <Label>Password</Label>
                    <input type="password" className="form-control" {...register("password")} />
                    <p className="text-danger">{errors.password?.message}</p>
                  </FormGroup>

                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <input type="password" className="form-control" {...register("confirmPassword")} />
                    <p className="text-danger">{errors.confirmPassword?.message}</p>
                  </FormGroup>

                  <Button color="primary" block type="submit">Create User</Button>
                  <Button color="secondary" block type="button" onClick={() => navigate('/ManageUsers')}>Cancel</Button>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>&copy; 2025 AuctionHub. All rights reserved.</Container>
      </footer>
    </div>
  );
};

export default AddUser;
