import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Row, Col, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSearch, FaFilter, FaPlus, FaClock, FaCheckCircle, FaPlayCircle, FaPauseCircle, FaFlag, FaCalendarAlt } from 'react-icons/fa';
import { useUser } from '../context/UserContext';
import { TASK_STATUS, TASK_PRIORITY } from '../api/tasksApi';
import TaskManager from './TaskManager';

const TaskList = ({ showCreateModal = false, onCreateModalClose }) => {
  const {
    getCurrentUserTasks,
    deleteUserTask,
    getUserTasksByStatus,
    searchUserTasks,
    getUserTasksStatistics
  } = useUser();

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0,
    overdue: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadTasks();
    loadStatistics();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const userTasks = await getCurrentUserTasks();
      setTasks(userTasks);
    } catch (error) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await getUserTasksStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const result = await deleteUserTask(taskId);
        if (result.success) {
          await loadTasks();
          await loadStatistics();
        } else {
          setError(result.error || 'Failed to delete task');
        }
      } catch (error) {
        setError('Failed to delete task');
      }
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSaved = async () => {
    await loadTasks();
    await loadStatistics();
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.status === TASK_STATUS.COMPLETED) return false;
    return new Date(task.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center p-3 border-0 shadow-sm">
            <h4 className="text-primary mb-1">{statistics.total}</h4>
            <small className="text-muted">Total Tasks</small>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 border-0 shadow-sm">
            <h4 className="text-success mb-1">{statistics.completed}</h4>
            <small className="text-muted">Completed</small>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 border-0 shadow-sm">
            <h4 className="text-warning mb-1">{statistics.pending}</h4>
            <small className="text-muted">Pending</small>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center p-3 border-0 shadow-sm">
            <h4 className="text-danger mb-1">{statistics.overdue}</h4>
            <small className="text-muted">Overdue</small>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>
                  <FaSearch className="me-1" />
                  Search Tasks
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>
                  <FaFilter className="me-1" />
                  Status Filter
                </Form.Label>
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value={TASK_STATUS.PENDING}>Pending</option>
                  <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                  <option value={TASK_STATUS.COMPLETED}>Completed</option>
                  <option value={TASK_STATUS.CANCELLED}>Cancelled</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Priority Filter</Form.Label>
                <Form.Select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="all">All Priorities</option>
                  <option value={TASK_PRIORITY.LOW}>Low</option>
                  <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                  <option value={TASK_PRIORITY.HIGH}>High</option>
                  <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={2}>
              <Button
                variant="primary"
                onClick={handleCreateTask}
                className="w-100"
              >
                <FaPlus className="me-1" />
                New Task
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5">
            <FaClock size={48} className="text-muted mb-3" />
            <h5 className="text-muted">No tasks found</h5>
            <p className="text-muted">
              {tasks.length === 0
                ? "You haven't created any tasks yet. Click 'New Task' to get started!"
                : "No tasks match your current filters. Try adjusting your search criteria."
              }
            </p>
            {tasks.length === 0 && (
              <Button variant="primary" onClick={handleCreateTask}>
                <FaPlus className="me-1" />
                Create Your First Task
              </Button>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredTasks.map(task => (
            <Col lg={6} xl={4} key={task.id} className="mb-4">
              <Card className={`border-0 shadow-sm h-100 ${isOverdue(task) ? 'border-danger' : ''}`}>
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0 flex-grow-1 me-2">{task.title}</h6>
                    <div className="d-flex gap-1">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleEditTask(task)}
                        title="Edit task"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        title="Delete task"
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </div>

                  {task.description && (
                    <p className="text-muted small mb-2">{task.description}</p>
                  )}

                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>

                  <div className="small text-muted">
                    <div className="d-flex align-items-center mb-1">
                      <FaCalendarAlt className="me-1" />
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>

                    {task.estimatedHours > 0 && (
                      <div className="d-flex align-items-center mb-1">
                        <FaClock className="me-1" />
                        <span>Est: {task.estimatedHours}h</span>
                      </div>
                    )}

                    {task.tags.length > 0 && (
                      <div className="mb-1">
                        <small className="text-muted">Tags: </small>
                        {task.tags.map((tag, index) => (
                          <Badge key={index} bg="light" text="dark" className="me-1 small">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                    <small className="text-muted">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </small>
                    {isOverdue(task) && (
                      <Badge bg="danger" className="small">
                        Overdue
                      </Badge>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Task Manager Modal */}
      <TaskManager
        show={showTaskModal}
        onHide={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onTaskSaved={handleTaskSaved}
      />

      {/* Create Task Modal for external trigger */}
      {showCreateModal && (
        <TaskManager
          show={showCreateModal}
          onHide={onCreateModalClose}
          task={null}
          onTaskSaved={(task) => {
            loadTasks();
            loadStatistics();
            onCreateModalClose();
          }}
        />
      )}
    </div>
  );
};

export default TaskList;
