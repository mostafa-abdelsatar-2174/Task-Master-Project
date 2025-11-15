/**
 * Tasks API - Handles all task-related operations
 * This is a mock API that simulates backend functionality
 */

const TASKS_STORAGE_KEY = 'taskmaster_tasks';
const TASKS_COUNTER_KEY = 'taskmaster_tasks_counter';

// Helper function to get tasks from localStorage
const getTasksFromStorage = () => {
  try {
    const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
    return [];
  }
};

// Helper function to save tasks to localStorage
const saveTasksToStorage = (tasks) => {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
    throw new Error('Failed to save tasks');
  }
};

// Helper function to get next task ID
const getNextTaskId = () => {
  try {
    const counter = localStorage.getItem(TASKS_COUNTER_KEY);
    const nextId = counter ? parseInt(counter) + 1 : 1;
    localStorage.setItem(TASKS_COUNTER_KEY, nextId.toString());
    return nextId.toString();
  } catch (error) {
    console.error('Error getting next task ID:', error);
    return Date.now().toString();
  }
};

// Task status constants
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'done',
  CANCELLED: 'cancelled'
};

// Task priority constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const tasks = getTasksFromStorage();
    const newTask = {
      id: getNextTaskId(),
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || TASK_STATUS.PENDING,
      priority: taskData.priority || TASK_PRIORITY.MEDIUM,
      userId: taskData.userId,
      userEmail: taskData.userEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: taskData.dueDate || null,
      tags: taskData.tags || [],
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: 0,
      completedAt: null,
      notes: taskData.notes || ''
    };

    tasks.push(newTask);
    saveTasksToStorage(tasks);

    return { success: true, task: newTask };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
};

// Get all tasks for a specific user
export const getUserTasks = async (userId, userEmail) => {
  try {
    const tasks = getTasksFromStorage();
    return tasks.filter(task =>
      task.userId === userId || task.userEmail === userEmail
    );
  } catch (error) {
    console.error('Error getting user tasks:', error);
    return [];
  }
};

// Get task by ID
export const getTaskById = async (taskId) => {
  try {
    const tasks = getTasksFromStorage();
    return tasks.find(task => task.id === taskId) || null;
  } catch (error) {
    console.error('Error getting task by ID:', error);
    return null;
  }
};

// Update a task
export const updateTask = async (taskId, updates) => {
  try {
    const tasks = getTasksFromStorage();
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
      return { success: false, error: 'Task not found' };
    }

    const updatedTask = {
      ...tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // If status is being changed to completed, set completedAt
    if (updates.status === TASK_STATUS.COMPLETED && tasks[taskIndex].status !== TASK_STATUS.COMPLETED) {
      updatedTask.completedAt = new Date().toISOString();
    }

    tasks[taskIndex] = updatedTask;
    saveTasksToStorage(tasks);

    return { success: true, task: updatedTask };
  } catch (error) {
    console.error('Error updating task:', error);
    return { success: false, error: 'Failed to update task' };
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const tasks = getTasksFromStorage();
    const filteredTasks = tasks.filter(task => task.id !== taskId);

    if (filteredTasks.length === tasks.length) {
      return { success: false, error: 'Task not found' };
    }

    saveTasksToStorage(filteredTasks);
    return { success: true };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { success: false, error: 'Failed to delete task' };
  }
};

// Get tasks by status
export const getTasksByStatus = async (userId, userEmail, status) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);
    return userTasks.filter(task => task.status === status);
  } catch (error) {
    console.error('Error getting tasks by status:', error);
    return [];
  }
};

// Get tasks statistics for a user
export const getTasksStatistics = async (userId, userEmail) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);

    const stats = {
      total: userTasks.length,
      completed: userTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length,
      pending: userTasks.filter(task => task.status === TASK_STATUS.PENDING).length,
      inProgress: userTasks.filter(task => task.status === TASK_STATUS.IN_PROGRESS).length,
      cancelled: userTasks.filter(task => task.status === TASK_STATUS.CANCELLED).length,
      overdue: userTasks.filter(task =>
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== TASK_STATUS.COMPLETED
      ).length,
      completionRate: userTasks.length > 0 ?
        Math.round((userTasks.filter(task => task.status === TASK_STATUS.COMPLETED).length / userTasks.length) * 100) : 0
    };

    return stats;
  } catch (error) {
    console.error('Error getting tasks statistics:', error);
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

// Search tasks
export const searchTasks = async (userId, userEmail, searchTerm) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);
    const term = searchTerm.toLowerCase();

    return userTasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.tags.some(tag => tag.toLowerCase().includes(term))
    );
  } catch (error) {
    console.error('Error searching tasks:', error);
    return [];
  }
};

// Get tasks by priority
export const getTasksByPriority = async (userId, userEmail, priority) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);
    return userTasks.filter(task => task.priority === priority);
  } catch (error) {
    console.error('Error getting tasks by priority:', error);
    return [];
  }
};

// Get overdue tasks
export const getOverdueTasks = async (userId, userEmail) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);
    const now = new Date();

    return userTasks.filter(task =>
      task.dueDate &&
      new Date(task.dueDate) < now &&
      task.status !== TASK_STATUS.COMPLETED &&
      task.status !== TASK_STATUS.CANCELLED
    );
  } catch (error) {
    console.error('Error getting overdue tasks:', error);
    return [];
  }
};

// Bulk update tasks
export const bulkUpdateTasks = async (taskIds, updates) => {
  try {
    const tasks = getTasksFromStorage();
    let updatedCount = 0;

    const updatedTasks = tasks.map(task => {
      if (taskIds.includes(task.id)) {
        updatedCount++;
        return {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });

    if (updatedCount === 0) {
      return { success: false, error: 'No tasks found to update' };
    }

    saveTasksToStorage(updatedTasks);
    return { success: true, updatedCount };
  } catch (error) {
    console.error('Error bulk updating tasks:', error);
    return { success: false, error: 'Failed to bulk update tasks' };
  }
};

// Export tasks for a user
export const exportUserTasks = async (userId, userEmail) => {
  try {
    const userTasks = await getUserTasks(userId, userEmail);
    return {
      success: true,
      data: userTasks,
      exportDate: new Date().toISOString(),
      userId,
      userEmail,
      totalTasks: userTasks.length
    };
  } catch (error) {
    console.error('Error exporting tasks:', error);
    return { success: false, error: 'Failed to export tasks' };
  }
};

// Import tasks for a user
export const importUserTasks = async (userId, userEmail, tasksData) => {
  try {
    const existingTasks = getTasksFromStorage();
    const now = new Date().toISOString();

    // Add user info and timestamps to imported tasks
    const tasksToImport = tasksData.map(task => ({
      ...task,
      id: getNextTaskId(),
      userId,
      userEmail,
      createdAt: now,
      updatedAt: now
    }));

    const updatedTasks = [...existingTasks, ...tasksToImport];
    saveTasksToStorage(updatedTasks);

    return { success: true, importedCount: tasksToImport.length };
  } catch (error) {
    console.error('Error importing tasks:', error);
    return { success: false, error: 'Failed to import tasks' };
  }
};

export default {
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
};
