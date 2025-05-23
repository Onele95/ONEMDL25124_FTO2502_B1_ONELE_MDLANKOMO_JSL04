const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
  },
  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
  },
  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
  },
];

/** @type {HTMLElement} Button to create new tasks */
const createTaskButton = document.getElementById("createTaskButton");
/**
 * Task column containers grouped by status
 * @type {Object<string, HTMLElement>}
 */
const taskColumns = {
  todo: document.querySelector('.column[data-status="todo"] .task-list'),

  doing: document.querySelector('.column[data-status="doing"] .task-list'),

  done: document.querySelector('.column[data-status="done"] .task-list'),
};
/** @type {HTMLElement} Modal dialog for task details */
const modal = document.getElementById("taskModal");

/** @type {HTMLElement} Button to close the modal */
const closeModalButton = document.querySelector(".close-button");

/** @type {HTMLElement} Container for task details in modal */
const taskDetailsContainer = document.getElementById("taskDetails");

/** @type {HTMLElement} Button to save task changes */
const saveChangesButton = document.getElementById("saveChangesButton");
/** @type {HTMLElement} Button to delete current task */
const deleteTaskButton = document.getElementById("deleteTaskButton");

let currentTask = null;

// --- Task Rendering ---
/**
 * Creates a DOM element for a task card
 * @param {Object} task - The task object to render
 * @returns {HTMLElement} The created task card element
 */
function createTaskElement(task) {
  const taskElement = document.createElement("div");

  taskElement.classList.add("task-card");

  taskElement.dataset.taskId = task.id;

  const taskTitle = document.createElement("h3");

  taskTitle.classList.add("task-title-only");

  taskTitle.textContent = task.title;

  taskElement.appendChild(taskTitle);
  // When clicked, open the modal for this task
  taskElement.addEventListener("click", () => openTaskModal(task.id));

  return taskElement;
}

/**
 * Renders all tasks to their appropriate columns
 * @param {Array<Object>} tasks - Array of task objects to render
 */
function renderTasks(tasks) {
  Object.values(taskColumns).forEach((column) => (column.innerHTML = ""));
  tasks.forEach((task) => {
    const taskElement = createTaskElement(task);

    if (taskColumns[task.status]) {
      taskColumns[task.status].appendChild(taskElement);
    } else {
      console.warn(`Unknown task status: ${task.status}`, task);
    }
  });
}

// --- Modal Functionality ---
/**
 * Opens the task modal in edit mode for a specific task
 * @param {number|string} taskId - ID of the task to edit
 */
function openTaskModal(taskId) {
  currentTask = initialTasks.find((task) => task.id === parseInt(taskId));
  if (currentTask) {
    populateModalForEdit(currentTask);

    if (deleteTaskButton) {
      deleteTaskButton.style.display = "inline-block";
    }

    modal.style.display = "block";
  }
}

/**
 * Opens the task modal in create mode for a new task
 */
function openCreateTaskModal() {
  currentTask = null;
  // Fill the modal with empty fields for a new task
  populateModalForCreate();

  if (deleteTaskButton) {
    deleteTaskButton.style.display = "none";
  }
  // Show the modal
  modal.style.display = "block";
}

/**
 * Populates the modal with fields for editing an existing task
 * @param {Object} task - The task object to edit
 */
function populateModalForEdit(task) {
  taskDetailsContainer.innerHTML = `
    <h3>Edit Task</h3>
    <label for="editTaskTitle">Title:</label>
    <input type="text" id="editTaskTitle" value="${task.title}"><br><br>
    <label for="editTaskDescription">Description:</label>
    <textarea id="editTaskDescription">${task.description}</textarea><br><br>
    <label for="editTaskStatus">Status:</label>
    <select id="editTaskStatus">
      <option value="todo" ${
        task.status === "todo" ? "selected" : ""
      }>To Do</option>
      <option value="doing" ${
        task.status === "doing" ? "selected" : ""
      }>In Progress</option>
      <option value="done" ${
        task.status === "done" ? "selected" : ""
      }>Done</option>
    </select><br><br>
  `; // Dynamically create the HTML content for editing a task in the modal
}

/**
 * Populates the modal with empty fields for creating a new task
 */
function populateModalForCreate() {
  taskDetailsContainer.innerHTML = `
    <h3>Create New Task</h3>
    <label for="newTaskTitle">Title:</label>
    <input type="text" id="newTaskTitle"><br><br>
    <label for="newTaskDescription">Description:</label>
    <textarea id="newTaskDescription"></textarea><br><br>
    <label for="newTaskStatus">Status:</label>
    <select id="newTaskStatus">
      <option value="todo">To Do</option>
      <option value="doing">In Progress</option>
      <option value="done">Done</option>
    </select><br><br>
  `;
}

/**
 * Closes the task modal and resets current task
 */
function closeTaskModal() {
  // Hide the modal
  modal.style.display = "none";
  // Reset the currently open task
  currentTask = null;
}

/**
 * Deletes a task from the initialTasks array
 * @param {number} taskId - ID of the task to delete
 */
function deleteTask(taskId) {
  // Find the index of the task to delete
  const index = initialTasks.findIndex((task) => task.id === taskId);
  if (index > -1) {
    // Remove the task from the array
    initialTasks.splice(index, 1);
    // Re-render the tasks on the board
    renderTasks(initialTasks);
    // Close the modal
    closeTaskModal();
  }
}

/**
 * Saves changes to either a new or existing task
 * Handles validation and updates the task list
 */
function saveTaskChanges() {
  // Editing existing task
  if (currentTask) {
    const updatedTitle = document.getElementById("editTaskTitle").value;
    const updatedDescription = document.getElementById(
      "editTaskDescription"
    ).value;
    const updatedStatus = document.getElementById("editTaskStatus").value;

    if (updatedTitle) {
      // Find the index of the task being edited
      const taskIndex = initialTasks.findIndex(
        (task) => task.id === currentTask.id
      );
      if (taskIndex > -1) {
        initialTasks[taskIndex].title = updatedTitle;

        initialTasks[taskIndex].description = updatedDescription;

        initialTasks[taskIndex].status = updatedStatus;

        renderTasks(initialTasks);

        closeTaskModal();
      }
    } else {
      // Simple validation
      alert("Title cannot be empty.");
    }
  } else {
    // Creating a new task
    const newTaskTitle = document.getElementById("newTaskTitle").value;
    const newTaskDescription =
      document.getElementById("newTaskDescription").value;
    const newTaskStatus = document.getElementById("newTaskStatus").value;

    if (newTaskTitle) {
      // Generate a new unique ID
      const newId =
        initialTasks.length > 0
          ? Math.max(...initialTasks.map((task) => task.id)) + 1
          : 1;
      const newTask = {
        id: newId,
        title: newTaskTitle,
        description: newTaskDescription,
        status: newTaskStatus,
      };
      // Add the new task to the array
      initialTasks.push(newTask);

      renderTasks(initialTasks);

      closeTaskModal();
    } else {
      alert("Title cannot be empty.");
    }
  }
}

// --- Event Listeners ---
// Open the create task modal on button click
createTaskButton.addEventListener("click", openCreateTaskModal);

closeModalButton.addEventListener("click", closeTaskModal);

// Close the modal if the user clicks outside of it
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeTaskModal();
  }
});

// Save changes when the save button is clicked
saveChangesButton.addEventListener("click", saveTaskChanges);

if (deleteTaskButton) {
  // Delete the current task when the delete button is clicked
  deleteTaskButton.addEventListener("click", () => {
    if (currentTask) {
      deleteTask(currentTask.id);
    }
  });
}

// Get the theme toggle button
const themeButton = document.getElementById("themeButton");

const body = document.body;

// Toggles the dark theme on the body and saves the preference to localStorage
function toggleTheme() {
  // Toggle the dark-theme class on the body
  body.classList.toggle("dark-theme");
  // Store the current theme in local storage for persistence
  localStorage.setItem(
    "theme",
    body.classList.contains("dark-theme") ? "dark" : "light"
  );
}

// Event listener for the theme button
themeButton.addEventListener("click", toggleTheme);

// Check for saved theme on page load
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-theme");
}

// --- Initial Render ---
// Display the all the initial tasks when the page loads
renderTasks(initialTasks);
