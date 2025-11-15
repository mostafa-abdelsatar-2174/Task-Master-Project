import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";

function NotFound() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center text-center">
        <Col lg={8}>
          <div className="mb-5">
            <h1 className="display-1 text-primary mb-3">404</h1>
            <h2 className="display-5 mb-4">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              Oops! The page you're looking for doesn't exist. 
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center mb-5">
            <Button 
              as={Link} 
              to="/" 
              variant="primary" 
              size="lg"
              className="d-flex align-items-center justify-content-center"
            >
              <FaHome className="me-2" />
              Go Home
            </Button>
            
            <Button 
              variant="outline-primary" 
              size="lg"
              className="d-flex align-items-center justify-content-center"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft className="me-2" />
              Go Back
            </Button>
            
            <Button 
              as={Link} 
              to="/tasks" 
              variant="outline-secondary" 
              size="lg"
              className="d-flex align-items-center justify-content-center"
            >
              <FaSearch className="me-2" />
              Browse Tasks
            </Button>
          </div>

          <div className="text-muted">
            <p className="mb-2">Need help? Try these popular pages:</p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/" className="text-decoration-none">Home</Link>
              <Link to="/tasks" className="text-decoration-none">Tasks</Link>
              <Link to="/dashboard" className="text-decoration-none">Dashboard</Link>
              <Link to="/about" className="text-decoration-none">About</Link>
              <Link to="/contact" className="text-decoration-none">Contact</Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
