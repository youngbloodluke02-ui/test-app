const STORAGE_KEY = "workout-exercises";
const THEME_KEY = "workout-theme";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const filtersEl = document.getElementById("filters");
const filterThumb = document.getElementById("filter-thumb");
const taskCount = document.getElementById("task-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const themeToggle = document.getElementById("theme-toggle");
const ringFill = document.getElementById("ring-fill");
const ringLabel = document.getElementById("ring-label");
const ringCircumference = ringFill.getTotalLength();

let tasks = loadTasks();
let filter = "all";
let renderedIds = new Set();

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function render() {
  const visible = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  list.innerHTML = "";
  visible.forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "") + (renderedIds.has(task.id) ? "" : " enter");

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "check";
    checkbox.setAttribute("aria-label", task.completed ? "Mark as not done" : "Mark as done");
    checkbox.setAttribute("aria-pressed", String(task.completed));
    checkbox.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    checkbox.addEventListener("click", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;
    text.tabIndex = 0;
    text.setAttribute("role", "button");
    text.setAttribute("aria-label", "Edit exercise name");
    text.addEventListener("click", () => beginEdit(li, task, text));
    text.addEventListener("keydown", (e) => {
      if (e.key === "Enter") beginEdit(li, task, text);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Delete exercise");
    deleteBtn.addEventListener("click", () => deleteTask(task.id));

    li.append(checkbox, text, deleteBtn);
    list.appendChild(li);
  });

  renderedIds = new Set(tasks.map((t) => t.id));

  emptyState.style.display = visible.length === 0 ? "flex" : "none";

  const activeCount = tasks.filter((t) => !t.completed).length;
  taskCount.textContent = `${activeCount} exercise${activeCount === 1 ? "" : "s"} remaining`;

  const pct = tasks.length ? Math.round(((tasks.length - activeCount) / tasks.length) * 100) : 0;
  const offset = ringCircumference * (1 - pct / 100);
  ringFill.style.strokeDasharray = `${ringCircumference}`;
  ringFill.style.strokeDashoffset = `${offset}`;
  ringLabel.textContent = `${pct}%`;
  document.getElementById("ring").setAttribute("aria-label", `${pct} percent complete`);
}

function beginEdit(li, task, textEl) {
  if (li.querySelector(".task-text-input")) return;

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.className = "task-text-input";
  inputEl.value = task.text;
  textEl.replaceWith(inputEl);
  inputEl.focus();
  inputEl.select();

  const commit = () => {
    const value = inputEl.value.trim();
    task.text = value || task.text;
    saveTasks();
    render();
  };

  inputEl.addEventListener("blur", commit);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") inputEl.blur();
    if (e.key === "Escape") {
      inputEl.removeEventListener("blur", commit);
      render();
    }
  });
}

function addTask(text) {
  tasks.push({ id: crypto.randomUUID(), text, completed: false });
  saveTasks();
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  saveTasks();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  render();
}

function clearCompleted() {
  tasks = tasks.filter((t) => !t.completed);
  saveTasks();
  render();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTask(text);
  input.value = "";
  input.focus();
});

const filterButtons = Array.from(filtersEl.querySelectorAll(".filter-btn"));

function moveThumb() {
  const index = filterButtons.findIndex((b) => b.dataset.filter === filter);
  filterThumb.style.transform = `translateX(${index * 100}%)`;
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filter = btn.dataset.filter;
  filterButtons.forEach((b) => {
    const isActive = b === btn;
    b.classList.toggle("active", isActive);
    b.setAttribute("aria-selected", String(isActive));
  });
  moveThumb();
  render();
});

clearCompletedBtn.addEventListener("click", clearCompleted);

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
});

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) applyTheme(savedTheme);

moveThumb();
render();
