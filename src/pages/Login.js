// src/pages/Login.js
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

import "./Auth.css";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, users } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(1, "Password is required")
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/tasks";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setLoading(true);

    try {
      // Find user by email
      const user = users.find(u => u.email === values.email);

      if (!user) {
        setError("Email not registered in the system");
        setLoading(false);
        setSubmitting(false);
        return;
      }

      if (user.password !== values.password) {
        setError("Incorrect password");
        setLoading(false);
        setSubmitting(false);
        return;
      }

      // Login the user
      const loginResult = login(user);

      if (loginResult.success) {
        const from = location.state?.from?.pathname || "/tasks";
        navigate(from, { replace: true });
      } else {
        setError(loginResult.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };



  return (
    <Container className="page-container">
      <Card className="auth-card animate__animated animate__fadeInDown">
        <Card.Body>
          <h3 className="text-center mb-4">🔐 Sign In</h3>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label>Email Address</label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                </div>

                <div className="mb-3">
                  <label>Password</label>
                  <Field type="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger small mt-1" />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100"
                  disabled={loading || isSubmitting}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
