import React, { useEffect } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/UserSlice';

import { registerValidationSchema } from '../../validations/RegValidation';
import {
  Container, Row, Col,
  FormGroup, Label,
  Button, Card, CardBody, CardTitle,
  Alert
} from 'reactstrap';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access Redux state for loading, error, and message
  const { isLoading, isError, isSuccess, message } = useSelector((state) => state.users || {});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(registerValidationSchema) });

  // Effect hook to handle side effects after the registration attempt
  useEffect(() => {
    if (isSuccess && message) {
      alert(message);
      navigate("/login");
    }
  }, [isSuccess, message, navigate]);

  const onSubmit = (data) => {
    const defaultPic = "https://cdn.vectorstock.com/i/500p/97/32/man-silhouette-profile-picture-vector-2139732.jpg";
    const userData = {
      ...data,
      profilepic: data.profilepic || defaultPic,
      role: 'user',
    };

    dispatch(registerUser(userData));
  };

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-sm">
              <CardBody>
                <CardTitle tag="h3" className="text-center mb-4">
                  Create Your Account
                </CardTitle>

                {isError && (
                  <Alert color="danger" className="mb-4">
                    {message}
                  </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Full Name */}
                  <FormGroup>
                    <Label>Full Name</Label>
                    <input
                      className="form-control"
                      placeholder="Enter your Full Name"
                      {...register("fullName")}
                    />
                    <p className="text-danger">{errors.fullName?.message}</p>
                  </FormGroup>

                  {/* Email */}
                  <FormGroup>
                    <Label>Email</Label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      {...register("email")}
                    />
                    <p className="text-danger">{errors.email?.message}</p>
                  </FormGroup>

                  {/* Profile Image URL */}
                  <FormGroup>
                    <Label>Profile Image URL (optional)</Label>
                    <input
                      className="form-control"
                      placeholder="https://example.com/avatar.jpg"
                      {...register("profilepic")}
                    />
                  </FormGroup>

                  {/* National ID */}
                  <FormGroup>
                    <Label>National ID</Label>
                    <input
                      className="form-control"
                      placeholder="Enter your National ID"
                      {...register("nationalId")}
                    />
                    <p className="text-danger">{errors.nationalId?.message}</p>
                  </FormGroup>

                  {/* Password */}
                  <FormGroup>
                    <Label>Password</Label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter your password"
                      {...register("password")}
                    />
                    <p className="text-danger">{errors.password?.message}</p>
                  </FormGroup>

                  {/* Confirm Password */}
                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm your password"
                      {...register("confirmPassword")}
                    />
                    <p className="text-danger">{errors.confirmPassword?.message}</p>
                  </FormGroup>

                  {/* Register Button */}
                  <Button
                    color="primary"
                    block
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Register'}
                  </Button>

                  {/* Login Link */}
                  <div className="text-center mt-3">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary">
                      Login here
                    </a>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-4 mt-5">
        <Container>&copy; 2025 AuctionHub. All rights reserved.</Container>
      </footer>
    </div>
  );
};

export default Register;
