import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Badge, Alert, Card, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaClock, FaCheckCircle, FaPlayCircle, FaPauseCircle, FaFlag } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { TASK_STATUS, TASK_PRIORITY } from '../api/tasksApi';

const TaskManager = ({ show, onHide, task = null, onTaskSaved }) => {
  const { createUserTask, updateUserTask } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    tags: '',
    estimatedHours: 0,
    notes: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUS.PENDING,
        priority: task.priority || TASK_PRIORITY.MEDIUM,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : '',
        estimatedHours: task.estimatedHours || 0,
        notes: task.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.PENDING,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '',
        tags: '',
        estimatedHours: 0,
        notes: ''
      });
    }
  }, [task]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        estimatedHours: parseInt(formData.estimatedHours) || 0
      };

      let result;
      if (task) {
        result = await updateUserTask(task.id, taskData);
      } else {
        result = await createUserTask(taskData);
      }

      if (result.success) {
        onTaskSaved && onTaskSaved(result.task);
        onHide();
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [TASK_STATUS.PENDING]: { variant: 'warning', icon: FaClock, text: 'Pending' },
      [TASK_STATUS.IN_PROGRESS]: { variant: 'info', icon: FaPlayCircle, text: 'In Progress' },
      [TASK_STATUS.COMPLETED]: { variant: 'success', icon: FaCheckCircle, text: 'Completed' },
      [TASK_STATUS.CANCELLED]: { variant: 'danger', icon: FaPauseCircle, text: 'Cancelled' }
    };

    const config = statusConfig[status] || statusConfig[TASK_STATUS.PENDING];
    const IconComponent = config.icon;

    return (
      <Badge bg={config.variant}>
        <IconComponent className="me-1" />
        {config.text}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      [TASK_PRIORITY.LOW]: { variant: 'secondary', text: 'Low' },
      [TASK_PRIORITY.MEDIUM]: { variant: 'primary', text: 'Medium' },
      [TASK_PRIORITY.HIGH]: { variant: 'warning', text: 'High' },
      [TASK_PRIORITY.URGENT]: { variant: 'danger', text: 'Urgent' }
    };

    const config = priorityConfig[priority] || priorityConfig[TASK_PRIORITY.MEDIUM];

    return (
      <Badge bg={config.variant}>
        <FaFlag className="me-1" />
        {config.text}
      </Badge>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="task-modal">
      <Modal.Header closeButton className="task-modal-header">
        <Modal.Title className="task-modal-title">
          {task ? (
            <>
              <FaEdit className="me-2" />
              Edit Task
            </>
          ) : (
            <>
              <FaPlus className="me-2" />
              Create New Task
            </>
          )}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit} className="task-form">
        <Modal.Body className="task-modal-body">
          {error && <Alert variant="danger" className="task-alert">{error}</Alert>}

          <Row className="task-form-row">
            <Col md={8}>
              <Form.Group className="mb-3 task-form-group">
                <Form.Label className="task-form-label">Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  required
                  className="task-form-control"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3 task-form-group">
                <Form.Label className="task-form-label">Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="task-form-select"
                >
                  <option value={TASK_PRIORITY.LOW}>Low</option>
                  <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TASK_PRIORITY.HIGH}>High</option>
                  <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 task-form-group">
            <Form.Label className="task-form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              className="task-form-control task-textarea"
            />
          </Form.Group>

          <Row className="task-form-row">
            <Col md={4}>
              <Form.Group className="mb-3 task-form-group">
                <Form.Label className="task-form-label">Status</Form.Label>
                <Form.Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="task-form-select"
                >
                  <option value={TASK_STATUS.PENDING}>Pending</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  <option value={TASK_STATUS.CANCELLED}>Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3 task-form-group">
                <Form.Label className="task-form-label">Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="task-form-control"
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3 task-form-group">
                <Form.Label className="task-form-label">Estimated Hours</Form.Label>
                <Form.Control
                  type="number"
                  name="estimatedHours"
                  value={formData.estimatedHours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="task-form-control"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3 task-form-group">
            <Form.Label className="task-form-label">Tags (comma separated)</Form.Label>
            <Form.Control
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g., urgent, frontend, bug"
              className="task-form-control"
            />
          </Form.Group>

          <Form.Group className="mb-3 task-form-group">
            <Form.Label className="task-form-label">Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes"
              className="task-form-control task-textarea"
            />
          </Form.Group>

          {task && (
            <Card className="mt-3 task-info-card">
              <Card.Body className="p-3 task-info-body">
                <Row className="text-center task-info-row">
                  <Col>
                    <div className="task-info-item">
                      <strong>Current Status:</strong>
                      {getStatusBadge(task.status)}
                    </div>
                  </Col>
                  <Col>
                    <div className="task-info-item">
                      <strong>Priority:</strong>
                      {getPriorityBadge(task.priority)}
                    </div>
                  </Col>
                  <Col>
                    <div className="task-info-item">
                      <strong>Created:</strong>
                      <br />
                      <small>{new Date(task.createdAt).toLocaleDateString()}</small>
                    </div>
                  </Col>
                  <Col>
                    <div className="task-info-item">
                      <strong>Updated:</strong>
                      <br />
                      <small>{new Date(task.updatedAt).toLocaleDateString()}</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>

        <Modal.Footer className="task-modal-footer">
          <Button variant="secondary" onClick={onHide} disabled={loading} className="task-btn-secondary">
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="task-btn-primary">
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {task ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {task ? 'Update Task' : 'Create Task'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default TaskManager;
