import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container, Row, Col, Badge } from "react-bootstrap";
import { FaTasks, FaPlus, FaChartBar, FaCheckCircle, FaClock, FaPlayCircle, FaUser } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import TaskList from "../components/TaskList";
import TaskManager from "../components/TaskManager";
import "./Tasks.css";

const Tasks = () => {
  const { user, getUserTasksStatistics } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (user) {
      loadStatistics();
    }
  }, [user]);

  const loadStatistics = async () => {
    try {
      const stats = await getUserTasksStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleTaskCreated = () => {
    loadStatistics();
    setShowCreateModal(false);
  };

  if (!user) {
    return (
      <div className="tasks-page">
        <Container className="mt-5">
          <Alert variant="warning">Please log in to view your tasks.</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h1 className="display-5 mb-3">
              <FaTasks className="me-2" />
              Task Management
            </h1>
            <p className="text-muted">Manage your tasks, track progress, and stay organized.</p>
          </Col>
        </Row>

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

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center p-4">
                <h5 className="mb-3">Quick Actions</h5>
                <Button
                  variant="outline-secondary"
                  size="lg"
                  onClick={() => window.location.href = '/profile?tab=dashboard'}
                  className="me-3"
                >
                  <FaChartBar className="me-2" />
                  View Dashboard
                </Button>
                <Button
                  variant="info"
                  size="lg"
                  onClick={() => window.location.href = '/profile'}
                >
                  <FaUser className="me-2" />
                  Go to Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Performance Overview */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h6 className="mb-0">📊 Performance Overview</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="small">Completion Rate</span>
                      <Badge bg={statistics.completionRate >= 80 ? "success" : statistics.completionRate >= 60 ? "warning" : "danger"}>
                        {statistics.completionRate}%
                      </Badge>
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
                      <span className="small">Active Tasks</span>
                      <Badge bg="info">
                        {statistics.inProgress + statistics.pending}
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="small">Success Rate</span>
                      <Badge bg={statistics.completionRate >= 80 ? "success" : statistics.completionRate >= 60 ? "warning" : "danger"}>
                        {statistics.completionRate >= 80 ? "Excellent" : statistics.completionRate >= 60 ? "Good" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Tasks List */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <h6 className="mb-0">
                  <FaTasks className="me-2" />
                  Your Tasks
                </h6>
              </Card.Header>
              <Card.Body>
                <TaskList
                  showCreateModal={showCreateModal}
                  onCreateModalClose={() => setShowCreateModal(false)}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Create Task Modal */}
        <TaskManager
          show={showCreateModal}
          onHide={() => setShowCreateModal(false)}
          task={null}
          onTaskSaved={handleTaskCreated}
        />
      </Container>
    </div>
  );
};

export default Tasks;
