import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, Button, Alert, Container, Spinner, Badge, Row, Col, Nav, Tab } from "react-bootstrap";
import { FaUser, FaEnvelope, FaCalendarAlt, FaEdit, FaTasks, FaCheckCircle, FaClock, FaPlayCircle, FaChartBar, FaUsers, FaTrophy, FaStar } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserTasksStatistics } from "../api/tasksApi";
import TaskList from "../components/TaskList";
import "./Profile.css";

const Profile = () => {
  const { user, updateUserProfile, users, getUserTasksStatistics: getStats } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });

  // Get the active tab from URL parameters
  const getActiveTabFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') === 'dashboard' ? 'dashboard' : 'profile';
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromURL());

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveTabFromURL());
  }, [location.search]);

  // Load statistics when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      const stats = await getStats();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  // Handle tab change with URL update
  const handleTabChange = (key) => {
    setActiveTab(key);
    // Update URL without causing page reload
    const newURL = key === 'dashboard' ? '/profile?tab=dashboard' : '/profile';
    navigate(newURL, { replace: true });
  };

  const initialValues = {
    name: user?.name || "",
    email: user?.email || "",
    joinDate: user?.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "",
  };

  // Debug logging to track user data changes
  useEffect(() => {
    console.log('Profile component - User data updated:', user);
    console.log('Profile component - Join date value:', user?.createdAt);
  }, [user]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must not exceed 50 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .test('unique-email', 'Email is already in use', function(value) {
        if (!user) return true;
        const existingUser = users.find(u => u.email === value && u.id !== user.id);
        return !existingUser;
      })
  });

  const handleSubmit = async (values) => {
    // Check if edit mode is active
    if (!editMode) {
      setError("Please click 'Edit Profile' button first to enable editing.");
      return;
    }

    // Check if any values have actually changed
    const currentJoinDate = user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : "";
    const hasChanges = values.name !== user.name ||
                      values.email !== user.email ||
                      values.joinDate !== currentJoinDate;

    if (!hasChanges) {
      setError("No changes detected. Please modify the fields before saving.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      console.log("Updating profile with values:", values);
      console.log("Current user:", user);

      const result = await updateUserProfile(user.id, values);

      console.log("Update result:", result);

      if (result.success) {
        setEditMode(false);
        setSuccess("Profile updated successfully!");

        // Force re-render by updating local state
        setTimeout(() => {
          // Clear success message after 3 seconds
          setSuccess("");
        }, 3000);
      } else {
        setError(result.error || "An error occurred while updating");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <Container className="mt-5">
          <Alert variant="warning">Please log in to view your profile.</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 mb-3">👤 Profile</h1>
            <p className="text-muted">Manage your account settings and personal preferences.</p>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          <Row>
            <Col>
              <Nav variant="tabs" className="mb-4 border-0">
                <Nav.Item>
                  <Nav.Link
                    eventKey="dashboard"
                    className="border-0 rounded-0"
                    style={{ fontWeight: '600' }}
                  >
                    <FaChartBar className="me-2" />
                    Dashboard
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    eventKey="profile"
                    className="border-0 rounded-0"
                    style={{ fontWeight: '600' }}
                  >
                    <FaUser className="me-2" />
                    Profile
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>

          <Tab.Content>
            {/* Dashboard Tab */}
            <Tab.Pane eventKey="dashboard">
              <Row>
                {/* Profile Info Sidebar */}
                <Col lg={4} className="mb-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center p-4">
                      <div className="mb-3">
                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px' }}>
                          <FaUser className="text-white" size={32} />
                        </div>
                      </div>
                      <h4 className="mb-1">{user.name}</h4>
                      <p className="text-muted mb-3">{user.email}</p>

                      <div className="text-start">
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-muted me-2" />
                          <span className="small">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : "Not specified"}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Quick Stats */}
                  <Card className="border-0 shadow-sm mt-3">
                    <Card.Header className="bg-white border-0">
                      <h6 className="mb-0">📊 Quick Stats</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Total Tasks</span>
                        <Badge bg="primary">
                          <FaTasks className="me-1" />
                          {statistics.total}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Completed</span>
                        <Badge bg="success">
                          <FaCheckCircle className="me-1" />
                          {statistics.completed}
                        </Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Success Rate</span>
                        <Badge bg={statistics.completionRate >= 80 ? "success" : statistics.completionRate >= 60 ? "warning" : "danger"}>
                          <FaTrophy className="me-1" />
                          {statistics.completionRate}%
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Dashboard Content */}
                <Col lg={8}>
                  {/* Statistics Cards */}
                  <Row className="mb-4">
                    <Col md={3}>
                      <Card className="text-center p-4 border-0 shadow-sm h-100 stats-card">
                        <div className="mb-3">
                          <FaTasks className="text-primary card-icon" size={24} />
                        </div>
                        <h3 className="text-primary mb-1">{statistics.total}</h3>
                        <p className="mb-0 small text-muted">Total Tasks</p>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center p-4 border-0 shadow-sm h-100 stats-card">
                        <div className="mb-3">
                          <FaCheckCircle className="text-success card-icon" size={24} />
                        </div>
                        <h3 className="text-success mb-1">{statistics.completed}</h3>
                        <p className="mb-0 small text-muted">Completed</p>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center p-4 border-0 shadow-sm h-100 stats-card">
                        <div className="mb-3">
                          <FaClock className="text-warning card-icon" size={24} />
                        </div>
                        <h3 className="text-warning mb-1">{statistics.pending}</h3>
                        <p className="mb-0 small text-muted">Pending</p>
                      </Card>
                    </Col>
                    <Col md={3}>
                      <Card className="text-center p-4 border-0 shadow-sm h-100 stats-card">
                        <div className="mb-3">
                          <FaPlayCircle className="text-info card-icon" size={24} />
                        </div>
                        <h3 className="text-info mb-1">{statistics.inProgress}</h3>
                        <p className="mb-0 small text-muted">In Progress</p>
                      </Card>
                    </Col>
                  </Row>

                  {/* Tasks Overview */}
                  <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-0">
                      <h6 className="mb-0">
                        <FaTasks className="me-2" />
                        Recent Tasks
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <TaskList />
                    </Card.Body>
                  </Card>

                  {/* System Information */}
                  <Card className="border-0 shadow-sm system-info-card">
                    <Card.Header className="bg-white border-0">
                      <h6 className="mb-0">
                        <FaUsers className="me-2" />
                        System Information
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Total Users</span>
                            <Badge bg="secondary">{users.length}</Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Account Status</span>
                            <Badge bg="success">Active</Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Overdue Tasks</span>
                            <Badge bg={statistics.overdue > 0 ? "danger" : "success"}>
                              {statistics.overdue}
                            </Badge>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Last Updated</span>
                            <span className="small text-muted">{new Date().toLocaleDateString('en-US')}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Performance</span>
                            <Badge bg="success">
                              <FaStar className="me-1" />
                              Excellent
                            </Badge>
                          </div>
                          <div className="d-flex justify-content-between mb-3">
                            <span className="small">Completion Rate</span>
                            <Badge bg={statistics.completionRate >= 80 ? "success" : statistics.completionRate >= 60 ? "warning" : "danger"}>
                              {statistics.completionRate}%
                            </Badge>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Profile Tab */}
            <Tab.Pane eventKey="profile">
              <Row>
                {/* Profile Info Sidebar */}
                <Col lg={4} className="mb-4">
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="text-center p-4">
                      <div className="mb-3">
                        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                            style={{ width: '80px', height: '80px' }}>
                          <FaUser className="text-white" size={32} />
                        </div>
                      </div>
                      <h4 className="mb-1">{user.name}</h4>
                      <p className="text-muted mb-3">{user.email}</p>

                      <div className="text-start">
                        <div className="d-flex align-items-center mb-2">
                          <FaCalendarAlt className="text-muted me-2" />
                          <span className="small">Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : "Not specified"}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  {/* Account Status */}
                  <Card className="border-0 shadow-sm mt-3">
                    <Card.Header className="bg-white border-0">
                      <h6 className="mb-0">📊 Account Status</h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Status</span>
                        <Badge bg="success">Active</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Total Tasks</span>
                        <Badge bg="primary">{statistics.total}</Badge>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">Completed Tasks</span>
                        <Badge bg="success">{statistics.completed}</Badge>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="small">Success Rate</span>
                        <Badge bg={statistics.completionRate >= 80 ? "success" : statistics.completionRate >= 60 ? "warning" : "danger"}>
                          {statistics.completionRate}%
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Edit Profile Form */}
                <Col lg={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-0">
                      <h5 className="mb-0">
                        <FaEdit className="me-2" />
                        Edit Profile
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      {success && <Alert variant="success">{success}</Alert>}
                      {error && <Alert variant="danger">{error}</Alert>}

                      {!editMode && (
                        <Alert variant="info" className="mb-3">
                          <FaEdit className="me-2" />
                          Click "Edit Profile" button to modify your information
                        </Alert>
                      )}

                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                      >
                        {({ isSubmitting, values }) => (
                          <Form>
                            <Row>
                              <Col md={12}>
                                <div className="mb-3">
                                  <label className="form-label">
                                    Full Name
                                    {editMode && <span className="text-danger ms-1">*</span>}
                                  </label>
                                  <Field
                                    type="text"
                                    name="name"
                                    className={`form-control ${!editMode ? 'bg-light' : ''}`}
                                    disabled={!editMode}
                                    placeholder={editMode ? "Enter your full name" : "Click Edit Profile to modify"}
                                  />
                                  <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                                </div>
                              </Col>
                            </Row>

                            <div className="mb-3">
                              <label className="form-label">
                                Email Address
                                {editMode && <span className="text-danger ms-1">*</span>}
                              </label>
                              <Field
                                type="email"
                                name="email"
                                className={`form-control ${!editMode ? 'bg-light' : ''}`}
                                disabled={!editMode}
                                placeholder={editMode ? "Enter your email address" : "Click Edit Profile to modify"}
                              />
                              <ErrorMessage name="email" component="div" className="text-danger small mt-1" />
                            </div>

                            <div className="mb-3">
                              <label className="form-label">
                                Join Date
                                {editMode && <span className="text-danger ms-1">*</span>}
                              </label>
                              <Field
                                type="date"
                                name="joinDate"
                                className={`form-control ${!editMode ? 'bg-light' : ''}`}
                                disabled={!editMode}
                                value={user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : ""}
                              />
                              <ErrorMessage name="joinDate" component="div" className="text-danger small mt-1" />
                            </div>

                            <div className="d-flex gap-2 mt-4">
                              {!editMode ? (
                                <Button
                                  variant="primary"
                                  onClick={() => setEditMode(true)}
                                  disabled={loading}
                                  className="edit-profile-btn"
                                >
                                  <FaEdit className="me-2" />
                                  Edit Profile
                                </Button>
                              ) : (
                                <>
                                  <Button
                                    type="submit"
                                    variant="success"
                                    disabled={isSubmitting || loading}
                                  >
                                    {loading ? (
                                      <>
                                        <Spinner animation="border" size="sm" className="me-2" />
                                        Saving...
                                      </>
                                    ) : (
                                      '💾 Save Changes'
                                    )}
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    onClick={() => {
                                      setEditMode(false);
                                      setError("");
                                    }}
                                    disabled={loading}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Profile;
