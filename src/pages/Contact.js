import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from "react-icons/fa";

function Contact() {
  return (
    <Container className="py-5">
      <Row className="text-center mb-5">
        <Col>
          <h1 className="display-4 mb-4">Contact Us</h1>
          <p className="lead">
            Get in touch with our team. We'd love to hear from you.
          </p>
        </Col>
      </Row>

      <Row>
        <Col lg={8} className="mb-5">
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-5">
              <h3 className="mb-4">Send us a Message</h3>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your first name" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your last name" />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control type="text" placeholder="What's this about?" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control as="textarea" rows={5} placeholder="Tell us more..." />
                </Form.Group>
                <Button variant="primary" size="lg">
                  Send Message
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="p-4">
              <h4 className="mb-4">Get in Touch</h4>
              
              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <FaEnvelope className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Email</h6>
                    <p className="text-muted mb-0">support@taskmaster.com</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaPhone className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Phone</h6>
                    <p className="text-muted mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-3">
                  <FaMapMarkerAlt className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Address</h6>
                    <p className="text-muted mb-0">123 Productivity St.<br />Tech City, TC 12345</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center">
                  <FaClock className="text-primary me-3" />
                  <div>
                    <h6 className="mb-0">Business Hours</h6>
                    <p className="text-muted mb-0">Mon - Fri: 9:00 AM - 6:00 PM<br />Sat - Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Contact;
