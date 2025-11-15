import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaTasks, FaChartLine, FaUsers, FaClock, FaCheckCircle, FaRocket } from "react-icons/fa";
import { ThemeContext } from "../context/ThemeContext";
import "./Home.css";

function Home() {
  const { darkMode } = useContext(ThemeContext);

  const features = [
    {
      icon: <FaTasks className="feature-icon" />,
      title: "Task Management",
      description: "Organize your tasks easily with advanced categorization system"
    },
    {
      icon: <FaChartLine className="feature-icon" />,
      title: "Detailed Reports",
      description: "Get comprehensive statistics about your performance"
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Team Collaboration",
      description: "Collaborate with your team efficiently"
    },
    {
      icon: <FaClock className="feature-icon" />,
      title: "Smart Reminders",
      description: "Never miss an important deadline with our reminder system"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "50K+", label: "Completed Tasks" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className={`home-page ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6} className="hero-content">
              <Badge bg={darkMode ? "light" : "primary"} className="hero-badge mb-3 shadow">
                <FaRocket className="me-2" />
                Leading Task Management Platform
              </Badge>
              
              <h1 className="hero-title">
                <span className="fs-3"> Unleash Your Potential with </span> <span className="text-primary">TaskMaster</span>
              </h1>
              
              <p className="hero-description">
                A comprehensive task and project management platform that helps you organize your work and boost productivity. 
                Join thousands of users who trust TaskMaster for their daily task management.
              </p>
              
              <div className="hero-buttons">
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  size="lg" 
                  className="me-3 hero-btn"
                >
                  Get Started Free
                </Button>
                <Button 
                  as={Link} 
                  to="/tasks" 
                  variant={darkMode ? "outline-light" : "outline-primary"} 
                  size="lg"
                  className="hero-btn"
                >
                  Try Now
                </Button>
              </div>
            </Col>
            
            <Col lg={6} className="hero-image">
              <div className="hero-illustration">
                <div className="floating-card card-1">
                  <FaCheckCircle className="text-success" />
                  <span>Task Completed</span>
                </div>
                <div className="floating-card card-2">
                  <FaClock className="text-warning" />
                  <span>In Progress</span>
                </div>
                <div className="floating-card card-3">
                  <FaTasks className="text-primary" />
                  <span>New Task</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <Container>
          <Row className="text-center">
            {stats.map((stat, index) => (
              <Col md={3} key={index} className="mb-4">
                <div className="stat-item">
                  <h3 className="stat-number">{stat.number}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why TaskMaster?</h2>
              <p className="section-subtitle">
                Discover the features that make TaskMaster the perfect choice for managing your tasks
              </p>
            </Col>
          </Row>
          
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index} className="mb-4">
                <Card className={`feature-card h-100 ${darkMode ? 'dark' : 'light'}`}>
                  <Card.Body className="text-center">
                    <div className="feature-icon-wrapper">
                      {feature.icon}
                    </div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col>
              <Card className={`cta-card ${darkMode ? 'dark' : 'light'}`}>
                <Card.Body className="py-5">
                  <h2 className="cta-title">Ready to Get Started?</h2>
                  <p className="cta-description">
                    Join thousands of users who trust TaskMaster for their task management
                  </p>
                  <Button 
                    as={Link} 
                    to="/register" 
                    variant="primary" 
                    size="lg"
                    className="cta-button"
                  >
                    Start Your Journey Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;
