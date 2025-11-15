import React from "react";
import { Container, Row, Col, Card, ProgressBar, Badge } from "react-bootstrap";
import { FaTasks, FaCheckCircle, FaClock, FaExclamationTriangle, FaChartLine, FaCalendarAlt } from "react-icons/fa";

function Dashboard() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalTasks: 24,
    completedTasks: 18,
    pendingTasks: 4,
    overdueTasks: 2
  };

  const recentTasks = [
    { id: 1, title: "Complete project proposal", status: "completed", priority: "high" },
    { id: 2, title: "Review team feedback", status: "in-progress", priority: "medium" },
    { id: 3, title: "Update documentation", status: "pending", priority: "low" },
    { id: 4, title: "Schedule team meeting", status: "overdue", priority: "high" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      case 'overdue': return 'danger';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 mb-3">Dashboard</h1>
          <p className="text-muted">Welcome back! Here's an overview of your tasks.</p>
        </Col>
      </Row>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaTasks className="text-primary mb-2" size={32} />
              <h4 className="mb-1">{stats.totalTasks}</h4>
              <p className="text-muted mb-0">Total Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaCheckCircle className="text-success mb-2" size={32} />
              <h4 className="mb-1">{stats.completedTasks}</h4>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaClock className="text-warning mb-2" size={32} />
              <h4 className="mb-1">{stats.pendingTasks}</h4>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow-sm">
            <Card.Body>
              <FaExclamationTriangle className="text-danger mb-2" size={32} />
              <h4 className="mb-1">{stats.overdueTasks}</h4>
              <p className="text-muted mb-0">Overdue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Progress Overview */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <FaChartLine className="me-2" />
                Progress Overview
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Task Completion</span>
                  <span>{Math.round((stats.completedTasks / stats.totalTasks) * 100)}%</span>
                </div>
                <ProgressBar 
                  now={(stats.completedTasks / stats.totalTasks) * 100} 
                  variant="success" 
                  style={{ height: '8px' }}
                />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>On Time Delivery</span>
                  <span>{Math.round(((stats.completedTasks - stats.overdueTasks) / stats.totalTasks) * 100)}%</span>
                </div>
                <ProgressBar 
                  now={((stats.completedTasks - stats.overdueTasks) / stats.totalTasks) * 100} 
                  variant="info" 
                  style={{ height: '8px' }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col lg={4} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">
                <FaCalendarAlt className="me-2" />
                Quick Actions
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <button className="btn btn-primary">Create New Task</button>
                <button className="btn btn-outline-primary">View All Tasks</button>
                <button className="btn btn-outline-secondary">Generate Report</button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Tasks */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-white border-0">
              <h5 className="mb-0">Recent Tasks</h5>
            </Card.Header>
            <Card.Body>
              <div className="list-group list-group-flush">
                {recentTasks.map((task) => (
                  <div key={task.id} className="list-group-item border-0 px-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{task.title}</h6>
                        <div className="d-flex gap-2">
                          <Badge bg={getStatusColor(task.status)} className="text-capitalize">
                            {task.status.replace('-', ' ')}
                          </Badge>
                          <Badge bg={getPriorityColor(task.priority)} className="text-capitalize">
                            {task.priority} Priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
