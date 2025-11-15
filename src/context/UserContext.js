import React, { createContext, useState, useContext, useEffect } from 'react';

import {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByStatus,
  getTasksStatistics,
  searchTasks,
  getTasksByPriority,
  getOverdueTasks,
  bulkUpdateTasks,
  exportUserTasks,
  importUserTasks,
  TASK_STATUS,
  TASK_PRIORITY
} from '../api/tasksApi';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState(() => {
    // Load users from localStorage on initialization
    const savedUsers = localStorage.getItem('taskmaster_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Invalid user data:', error);
        localStorage.removeItem('current_user');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // Save users to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('taskmaster_users', JSON.stringify(users));
  }, [users]);

  const login = (userData) => {
    try {
      localStorage.setItem('current_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = (userData) => {
    try {
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email);
      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString(),
        tasks: [],
        notifications: [] // Initialize empty notifications array
      };

      // Add user to users array
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);

      // Login the new user
      localStorage.setItem('current_user', JSON.stringify(newUser));
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({ ...prevUser, ...userData }));
  };

  const updateUserProfile = (userId, userData) => {
    try {
      // Handle joinDate field specifically
      let processedUserData = { ...userData };

      if (userData.joinDate) {
        // Convert joinDate to createdAt format
        processedUserData.createdAt = new Date(userData.joinDate).toISOString();
        // Remove joinDate from the update data to avoid conflicts
        delete processedUserData.joinDate;
      }

      // Update users array in localStorage
      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, ...processedUserData } : u
      );
      setUsers(updatedUsers);

      // Update localStorage directly
      localStorage.setItem('taskmaster_users', JSON.stringify(updatedUsers));

      // Update current user if it's the same user
      if (user && user.id === userId) {
        const updatedUser = { ...user, ...processedUserData };
        setUser(updatedUser);
        localStorage.setItem('current_user', JSON.stringify(updatedUser));
        console.log('Updated user data:', updatedUser);
      }

      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Update failed' };
    }
  };

  const deleteUser = (userId) => {
    try {
      const updatedUsers = users.filter(u => u.id !== userId);
      setUsers(updatedUsers);

      // If current user is deleted, logout
      if (user && user.id === userId) {
        logout();
      }

      return { success: true };
    } catch (error) {
      console.error('Delete user error:', error);
      return { success: false, error: 'Delete failed' };
    }
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId);
  };

  const getAllUsers = () => {
    return users;
  };

  // Task management functions
  const createUserTask = async (taskData) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await createTask({
        ...taskData,
        userId: user.id,
        userEmail: user.email
      });

      if (result.success) {
        // Update user's tasks array
        const updatedUsers = users.map(u =>
          u.id === user.id ? { ...u, tasks: [...(u.tasks || []), result.task] } : u
        );
        setUsers(updatedUsers);
        setUser(prevUser => ({ ...prevUser, tasks: [...(prevUser.tasks || []), result.task] }));
      }

      return result;
    } catch (error) {
      console.error('Error creating user task:', error);
      return { success: false, error: 'Failed to create task' };
    }
  };

  const getCurrentUserTasks = async () => {
    try {
      if (!user) {
        return [];
      }
      return await getUserTasks(user.id, user.email);
    } catch (error) {
      console.error('Error getting current user tasks:', error);
      return [];
    }
  };

  const getTaskByIdForUser = async (taskId) => {
    try {
      if (!user) {
        return null;
      }
      return await getTaskById(taskId);
    } catch (error) {
      console.error('Error getting task by ID:', error);
      return null;
    }
  };

  const updateUserTask = async (taskId, updates) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await updateTask(taskId, updates);

      if (result.success) {
        // Update user's tasks array
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            const updatedTasks = u.tasks.map(task =>
              task.id === taskId ? result.task : task
            );
            return { ...u, tasks: updatedTasks };
          }
          return u;
        });
        setUsers(updatedUsers);
        setUser(prevUser => ({
          ...prevUser,
          tasks: prevUser.tasks.map(task =>
            task.id === taskId ? result.task : task
          )
        }));
      }

      return result;
    } catch (error) {
      console.error('Error updating user task:', error);
      return { success: false, error: 'Failed to update task' };
    }
  };

  const deleteUserTask = async (taskId) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await deleteTask(taskId);

      if (result.success) {
        // Update user's tasks array
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            const updatedTasks = u.tasks.filter(task => task.id !== taskId);
            return { ...u, tasks: updatedTasks };
          }
          return u;
        });
        setUsers(updatedUsers);
        setUser(prevUser => ({
          ...prevUser,
          tasks: prevUser.tasks.filter(task => task.id !== taskId)
        }));
      }

      return result;
    } catch (error) {
      console.error('Error deleting user task:', error);
      return { success: false, error: 'Failed to delete task' };
    }
  };

  const getUserTasksByStatus = async (status) => {
    try {
      if (!user) {
        return [];
      }
      return await getTasksByStatus(user.id, user.email, status);
    } catch (error) {
      console.error('Error getting user tasks by status:', error);
      return [];
    }
  };

  const getUserTasksStatistics = async () => {
    try {
      if (!user) {
        return {
          total: 0,
          completed: 0,
          pending: 0,
          inProgress: 0,
          cancelled: 0,
          overdue: 0,
          completionRate: 0
        };
      }
      return await getTasksStatistics(user.id, user.email);
    } catch (error) {
      console.error('Error getting user tasks statistics:', error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0,
        cancelled: 0,
        overdue: 0,
        completionRate: 0
      };
    }
  };

  const searchUserTasks = async (searchTerm) => {
    try {
      if (!user) {
        return [];
      }
      return await searchTasks(user.id, user.email, searchTerm);
    } catch (error) {
      console.error('Error searching user tasks:', error);
      return [];
    }
  };

  const getUserTasksByPriority = async (priority) => {
    try {
      if (!user) {
        return [];
      }
      return await getTasksByPriority(user.id, user.email, priority);
    } catch (error) {
      console.error('Error getting user tasks by priority:', error);
      return [];
    }
  };

  const getUserOverdueTasks = async () => {
    try {
      if (!user) {
        return [];
      }
      return await getOverdueTasks(user.id, user.email);
    } catch (error) {
      console.error('Error getting user overdue tasks:', error);
      return [];
    }
  };

  const bulkUpdateUserTasks = async (taskIds, updates) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await bulkUpdateTasks(taskIds, updates);

      if (result.success) {
        // Update user's tasks array
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            const updatedTasks = u.tasks.map(task => {
              if (taskIds.includes(task.id)) {
                return { ...task, ...updates, updatedAt: new Date().toISOString() };
              }
              return task;
            });
            return { ...u, tasks: updatedTasks };
          }
          return u;
        });
        setUsers(updatedUsers);
        setUser(prevUser => ({
          ...prevUser,
          tasks: prevUser.tasks.map(task => {
            if (taskIds.includes(task.id)) {
              return { ...task, ...updates, updatedAt: new Date().toISOString() };
            }
            return task;
          })
        }));
      }

      return result;
    } catch (error) {
      console.error('Error bulk updating user tasks:', error);
      return { success: false, error: 'Failed to bulk update tasks' };
    }
  };

  const exportCurrentUserTasks = async () => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }
      return await exportUserTasks(user.id, user.email);
    } catch (error) {
      console.error('Error exporting user tasks:', error);
      return { success: false, error: 'Failed to export tasks' };
    }
  };

  const importTasksForUser = async (tasksData) => {
    try {
      if (!user) {
        return { success: false, error: 'User not authenticated' };
      }

      const result = await importUserTasks(user.id, user.email, tasksData);

      if (result.success) {
        // Update user's tasks array
        const updatedUsers = users.map(u => {
          if (u.id === user.id) {
            return { ...u, tasks: [...(u.tasks || []), ...tasksData] };
          }
          return u;
        });
        setUsers(updatedUsers);
        setUser(prevUser => ({
          ...prevUser,
          tasks: [...(prevUser.tasks || []), ...tasksData]
        }));
      }

      return result;
    } catch (error) {
      console.error('Error importing tasks for user:', error);
      return { success: false, error: 'Failed to import tasks' };
    }
  };

  // Notification management functions
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      message: notification.message,
      type: notification.type || 'info',
      read: false,
      createdAt: new Date().toISOString(),
      ...notification
    };

    setUser(prevUser => {
      const updatedUser = {
        ...prevUser,
        notifications: [...(prevUser.notifications || []), newNotification]
      };
      // Update users array as well
      const updatedUsers = users.map(u =>
        u.id === prevUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      return updatedUser;
    });
  };

  const markNotificationAsRead = (notificationId) => {
    setUser(prevUser => {
      const updatedNotifications = prevUser.notifications.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      );
      const updatedUser = {
        ...prevUser,
        notifications: updatedNotifications
      };
      // Update users array as well
      const updatedUsers = users.map(u =>
        u.id === prevUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      return updatedUser;
    });
  };

  const markAllNotificationsAsRead = () => {
    setUser(prevUser => {
      const updatedNotifications = prevUser.notifications.map(notif => ({
        ...notif,
        read: true
      }));
      const updatedUser = {
        ...prevUser,
        notifications: updatedNotifications
      };
      // Update users array as well
      const updatedUsers = users.map(u =>
        u.id === prevUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      return updatedUser;
    });
  };

  const deleteNotification = (notificationId) => {
    setUser(prevUser => {
      const updatedNotifications = prevUser.notifications.filter(notif =>
        notif.id !== notificationId
      );
      const updatedUser = {
        ...prevUser,
        notifications: updatedNotifications
      };
      // Update users array as well
      const updatedUsers = users.map(u =>
        u.id === prevUser.id ? updatedUser : u
      );
      setUsers(updatedUsers);
      return updatedUser;
    });
  };

  const getUnreadNotificationsCount = () => {
    return user?.notifications?.filter(notif => !notif.read).length || 0;
  };

  const value = {
    user,
    loading,
    users,
    login,
    logout,
    register,
    updateUser,
    updateUserProfile,
    deleteUser,
    getUserById,
    getAllUsers,
    isAuthenticated: !!user,
    // Task management functions
    createUserTask,
    getCurrentUserTasks,
    getTaskByIdForUser,
    updateUserTask,
    deleteUserTask,
    getUserTasksByStatus,
    getUserTasksStatistics,
    searchUserTasks,
    getUserTasksByPriority,
    getUserOverdueTasks,
    bulkUpdateUserTasks,
    exportCurrentUserTasks,
    importTasksForUser,
    // Task constants
    TASK_STATUS,
    TASK_PRIORITY,
    // Notification functions
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    getUnreadNotificationsCount
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};



export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
