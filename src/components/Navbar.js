import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import {
  FaSun,
  FaMoon,
  FaUser,
  FaSignOutAlt,
  FaTasks,
  FaBell,
  FaHome,
  FaChartBar,
} from "react-icons/fa";
import "./Navbar.css";

const AppNavbar = () => {
  const { user, logout, isAuthenticated, users, getUnreadNotificationsCount } = useUser();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const unreadNotificationsCount = getUnreadNotificationsCount();

  return (
    <Navbar
      expand="lg"
      className={`custom-navbar shadow-sm ${darkMode ? "dark" : "light"}`}
      style={{ backgroundColor: darkMode ? "#1e1f29" : "#87CEEB" }}
      sticky="top"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold d-flex align-items-center"
        >
          <span className="navbar-brand-text">TaskMaster</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-light" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto pb-2 pb-lg-0">
            <Nav.Link as={Link} to="/" className="nav-link-custom">
              <FaHome className="me-1" />
              Home
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/tasks" className="nav-link-custom">
                  <FaTasks className="me-1" />
                  Tasks
                </Nav.Link>
                <Nav.Link as={Link} to="/profile?tab=dashboard" className="nav-link-custom">
                  <FaChartBar className="me-1" />
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/profile" className="nav-link-custom">
                  <FaUser className="me-1" />
                  Profile
                </Nav.Link>
              </>
            )}
          </Nav>

          <div className="ms-3 d-flex gap-2 align-items-center">
            {isAuthenticated ? (
              <>
                <Dropdown>
                  <Dropdown.Toggle
                    variant={darkMode ? "outline-info" : "outline-warning"}
                    size="sm"
                    className="position-relative"
                    id="notifications-dropdown"
                    title="Notifications"
                  >
                    <FaBell />
                    {unreadNotificationsCount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{ fontSize: '0.6em' }}
                      >
                        {unreadNotificationsCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={darkMode ? "bg-black" : ""} style={{ minWidth: '300px' }}>
                    <Dropdown.Header className="d-flex justify-content-between align-items-center">
                      <span>Notifications</span>
                      {unreadNotificationsCount > 0 && (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-muted"
                          onClick={() => {
                            // Mark all as read functionality can be added here
                          }}
                        >
                          Mark all read
                        </Button>
                      )}
                    </Dropdown.Header>
                    <Dropdown.Divider />

                    {user?.notifications && user.notifications.length > 0 ? (
                      user.notifications.slice(0, 5).map((notification) => (
                        <Dropdown.Item
                          key={notification.id}
                          className={`d-flex justify-content-between align-items-start ${!notification.read ? 'bg-light' : ''}`}
                          style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}
                        >
                          <div className="flex-grow-1">
                            <div className="fw-bold small">{notification.message}</div>
                            <div className="text-muted small">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="bg-primary rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                          )}
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}>
                        <div className="text-center text-muted">
                          No notifications
                        </div>
                      </Dropdown.Item>
                    )}

                    {user?.notifications && user.notifications.length > 5 && (
                      <>
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-center" style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}>
                          View all notifications
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant={darkMode ? "light" : "dark"}
                  onClick={toggleTheme}
                  className="toggle-btn"
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? <FaSun /> : <FaMoon />}
                </Button>

                <Dropdown>
                  <Dropdown.Toggle
                    variant={darkMode ? "outline-light" : "outline-primary"}
                    className="d-flex align-items-center"
                    id="user-dropdown"
                  >
                    <div className="me-2 d-flex flex-column align-items-end">
                      <span className="small fw-bold">
                        {user?.name || "User"}
                      </span>
                      <span className="small text-muted">{user?.email}</span>
                    </div>
                    <FaUser />
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={darkMode ? "bg-black" : ""}>
                    <Dropdown.Item
                      as={Link}
                      to="/profile?tab=dashboard"
                      style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}
                    >
                      <FaChartBar className="me-2" />
                      Dashboard
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}
                    >
                      <FaUser className="me-2" />
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/tasks"
                      style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}
                    >
                      <FaTasks className="me-2" />
                      Tasks
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      style={darkMode ? { color: "rgb(5, 229, 197)" } : {}}
                    >
                      <FaSignOutAlt className="me-2" />
                      Sign Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant={darkMode ? "outline-success" : "outline-dark"}
                  size="sm"
                  className="auth-btn align-self-center py-2 px-2"
                >
                  Sign In
                </Button>

                <Button
                  as={Link}
                  to="/register"
                  variant={darkMode ? "success" : "warning"}
                  size="sm"
                  className="auth-btn align-self-center py-2 px-2"
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
