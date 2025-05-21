// Task Manager class to handle all task operations
export default class TaskManager {
  constructor() {
    this.tasks = [];
    this.currentFilter = "all";
  }

  // Load tasks from localStorage
  loadTasks() {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks);
    }
  }

  // Save tasks to localStorage
  saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // Add a new task
  addTask(title, description, category, priority) {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      category,
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  // Delete a task by ID
  deleteTask(taskId) {
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
    this.saveTasks();
  }

  // Toggle task completion status
  toggleTaskComplete(taskId) {
    this.tasks = this.tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    this.saveTasks();
  }

  // Set current filter
  setFilter(filter) {
    this.currentFilter = filter;
  }

  // Get all tasks
  getAllTasks() {
    return [...this.tasks];
  }

  // Get filtered tasks based on current filter and search term
  getFilteredTasks(searchTerm = "") {
    let filteredTasks = [...this.tasks];

    // Apply category filter
    if (this.currentFilter !== "all") {
      filteredTasks = filteredTasks.filter(
        (task) => task.category === this.currentFilter
      );
    }

    // Apply search filter if search term exists
    if (searchTerm) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm) ||
          (task.description &&
            task.description.toLowerCase().includes(searchTerm))
      );
    }

    // Sort tasks by creation date (newest first)
    return filteredTasks.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }
}
