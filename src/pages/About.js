import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaUsers, FaRocket, FaHeart, FaGlobe } from "react-icons/fa";

function About() {
  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 mb-4">About TaskMaster</h1>
          <p className="lead">
            Empowering productivity through intelligent task management
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <h3 className="mb-4">Our Mission</h3>
              <p className="text-muted mb-4">
                At TaskMaster, we believe that effective task management is the foundation of productivity. 
                Our platform is designed to help individuals and teams organize, prioritize, and complete 
                their tasks efficiently, leading to better outcomes and reduced stress.
              </p>
              <p className="text-muted">
                We're committed to providing intuitive, powerful tools that adapt to your workflow, 
                whether you're managing personal projects or coordinating complex team initiatives.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="text-center">
        <Col md={3} className="mb-4">
          <div className="p-4">
            <FaUsers className="text-primary mb-3" size={48} />
            <h5>User-Focused</h5>
            <p className="text-muted">Built with user experience at the center</p>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="p-4">
            <FaRocket className="text-success mb-3" size={48} />
            <h5>Innovation</h5>
            <p className="text-muted">Cutting-edge features for modern productivity</p>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="p-4">
            <FaHeart className="text-danger mb-3" size={48} />
            <h5>Passion</h5>
            <p className="text-muted">Driven by our love for helping people succeed</p>
          </div>
        </Col>
        <Col md={3} className="mb-4">
          <div className="p-4">
            <FaGlobe className="text-info mb-3" size={48} />
            <h5>Global</h5>
            <p className="text-muted">Serving users worldwide with localized support</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
