// Main application file
import TaskManager from "./taskManager.js";
import { debounce, throttle } from "./utils.js";

// Initialize the task manager
const taskManager = new TaskManager();

// DOM Elements
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDescriptionInput = document.getElementById("task-description");
const taskCategorySelect = document.getElementById("task-category");
const taskPrioritySelect = document.getElementById("task-priority");
const tasksContainer = document.getElementById("tasks-container");
const searchInput = document.getElementById("search-input");
const filterButtons = document.querySelectorAll(".filter-btn");
const backToTopButton = document.getElementById("back-to-top");

// Load and render tasks on page load
document.addEventListener("DOMContentLoaded", () => {
  taskManager.loadTasks();
  renderTasks();
  initBackToTop();
});

// Handle form submission
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get form values
  const title = taskTitleInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const category = taskCategorySelect.value;
  const priority = taskPrioritySelect.value;

  // Add new task
  taskManager.addTask(title, description, category, priority);

  // Clear form
  taskForm.reset();

  // Render updated tasks
  renderTasks();
});

// Handle search with debounce
searchInput.addEventListener(
  "input",
  debounce(() => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    renderTasks(searchTerm);
  }, 300)
);

// Handle filter buttons
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    filterButtons.forEach((btn) => btn.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Get filter value
    const filter = button.dataset.filter;

    // Apply filter
    taskManager.setFilter(filter);
    renderTasks();
  });
});

// Handle task actions (complete and delete)
tasksContainer.addEventListener("click", (e) => {
  const taskItem = e.target.closest(".task-item");
  if (!taskItem) return;

  const taskId = taskItem.dataset.id;

  // Handle complete button
  if (e.target.closest(".btn-complete")) {
    taskManager.toggleTaskComplete(taskId);
    renderTasks();
  }

  // Handle delete button
  if (e.target.closest(".btn-delete")) {
    taskManager.deleteTask(taskId);
    renderTasks();
  }
});

// Initialize back to top button
function initBackToTop() {
  // Show/hide back to top button based on scroll position
  window.addEventListener(
    "scroll",
    throttle(() => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }, 200)
  );

  // Scroll to top when button is clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Render tasks to the DOM
function renderTasks(searchTerm = "") {
  // Clear tasks container
  tasksContainer.innerHTML = "";

  // Get filtered tasks
  const tasks = taskManager.getFilteredTasks(searchTerm);

  if (tasks.length === 0) {
    tasksContainer.innerHTML = '<p class="no-tasks">No tasks found.</p>';
    return;
  }

  // Get task template
  const taskTemplate = document.getElementById("task-template");

  // Create and append task elements
  tasks.forEach((task) => {
    // Clone template
    const taskElement = document.importNode(taskTemplate.content, true);

    // Set task data
    const taskItem = taskElement.querySelector(".task-item");
    taskItem.dataset.id = task.id;
    taskItem.dataset.category = task.category;

    if (task.completed) {
      taskItem.classList.add("completed");
    }

    // Set task content
    taskElement.querySelector(".task-title").textContent = task.title;
    taskElement.querySelector(".task-description").textContent =
      task.description || "No description";

    // Set category
    const categoryElement = taskElement.querySelector(".task-category");
    categoryElement.textContent =
      task.category.charAt(0).toUpperCase() + task.category.slice(1);

    // Set priority
    const priorityElement = taskElement.querySelector(".task-priority");
    priorityElement.textContent =
      task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    priorityElement.dataset.priority = task.priority;

    // Append to container
    tasksContainer.appendChild(taskElement);
  });
}
