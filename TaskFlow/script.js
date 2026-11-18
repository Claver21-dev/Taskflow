const STORAGE_KEY = "taskflow_tasks_v1";
const THEME_KEY = "taskflow_theme_v1";

const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const modal = document.querySelector("#task-modal");
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const descriptionInput = document.querySelector("#task-description");
const dateInput = document.querySelector("#task-date");
const toast = document.querySelector("#toast");

let tasks = loadTasks();
let currentFilter = "all";
let editingId = null;
let toastTimer;

function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.warn("Impossible de lire les tâches sauvegardées.", error);
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    showToast("La sauvegarde locale est indisponible.");
    console.error(error);
  }
}

function createId() {
  return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(`${dateString}T00:00:00`);
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function isOverdue(task) {
  if (!task.date || task.completed) return false;
  return task.date < new Date().toISOString().slice(0, 10);
}

function renderTasks() {
  const filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  taskList.innerHTML = filtered.map(task => `
    <article class="task-card ${task.completed ? "is-completed" : ""}" data-id="${escapeHTML(task.id)}">
      <input class="task-check" type="checkbox" aria-label="Marquer comme terminée : ${escapeHTML(task.title)}" ${task.completed ? "checked" : ""}>
      <div class="task-content">
        <h3 class="task-title">${escapeHTML(task.title)}</h3>
        ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ""}
        <div class="task-meta">
          <span class="status-pill">${task.completed ? "Terminée" : "En cours"}</span>
          ${task.date ? `<span class="task-date ${isOverdue(task) ? "overdue" : ""}">◷ ${isOverdue(task) ? "En retard · " : ""}${formatDate(task.date)}</span>` : ""}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-action edit" aria-label="Modifier la tâche" title="Modifier">✎</button>
        <button class="task-action delete" aria-label="Supprimer la tâche" title="Supprimer">⌫</button>
      </div>
    </article>
  `).join("");

  emptyState.classList.toggle("visible", filtered.length === 0);
  taskList.style.display = filtered.length === 0 ? "none" : "grid";

  if (tasks.length === 0) {
    document.querySelector("#empty-title").textContent = "Votre espace est libre !";
    document.querySelector("#empty-message").textContent = "Ajoutez votre première tâche et commencez à avancer.";
  } else if (filtered.length === 0) {
    document.querySelector("#empty-title").textContent = "Aucune tâche ici";
    document.querySelector("#empty-message").textContent = "Changez de filtre ou ajoutez une nouvelle tâche.";
  }

  updateStats();
}

function updateStats() {
  const completed = tasks.filter(task => task.completed).length;
  const active = tasks.length - completed;
  document.querySelector("#total-count").textContent = tasks.length;
  document.querySelector("#active-count").textContent = active;
  document.querySelector("#completed-count").textContent = completed;
  document.querySelector("#nav-all-count").textContent = tasks.length;
  document.querySelector("#nav-active-count").textContent = active;
  document.querySelector("#nav-completed-count").textContent = completed;
}

function setFilter(filter) {
  currentFilter = filter;
  const labels = { all: "Mes tâches", active: "À faire", completed: "Terminées" };
  const headings = { all: "Toutes les tâches", active: "Tâches à faire", completed: "Tâches terminées" };
  document.querySelector("#breadcrumb-current").textContent = labels[filter];
  document.querySelector("#tasks-heading").textContent = headings[filter];
  document.querySelectorAll("[data-filter]").forEach(button => {
    button.classList.toggle("active", button.classList.contains("nav-item") && button.dataset.filter === filter);
    button.classList.toggle("selected", button.classList.contains("filter-tab") && button.dataset.filter === filter);
  });
  renderTasks();
}

function openModal(task = null) {
  editingId = task?.id ?? null;
  form.reset();
  document.querySelector("#modal-title").textContent = task ? "Modifier la tâche" : "Nouvelle tâche";
  document.querySelector("#save-task").textContent = task ? "Enregistrer" : "Ajouter la tâche";
  titleInput.value = task?.title ?? "";
  descriptionInput.value = task?.description ?? "";
  dateInput.value = task?.date ?? "";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => titleInput.focus(), 50);
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  editingId = null;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const title = titleInput.value.trim();
  if (!title) {
    titleInput.focus();
    return;
  }

  const taskData = {
    title,
    description: descriptionInput.value.trim(),
    date: dateInput.value
  };

  if (editingId) {
    tasks = tasks.map(task => task.id === editingId ? { ...task, ...taskData } : task);
    showToast("Tâche mise à jour !");
  } else {
    tasks.unshift({ id: createId(), ...taskData, completed: false, createdAt: new Date().toISOString() });
    showToast("Nouvelle tâche ajoutée !");
  }

  saveTasks();
  renderTasks();
  closeModal();
});

taskList.addEventListener("click", event => {
  const card = event.target.closest(".task-card");
  if (!card) return;
  const task = tasks.find(item => item.id === card.dataset.id);
  if (!task) return;

  if (event.target.matches(".task-check")) {
    task.completed = event.target.checked;
    saveTasks();
    renderTasks();
    showToast(task.completed ? "Bien joué, tâche terminée !" : "Tâche remise en cours.");
  } else if (event.target.closest(".edit")) {
    openModal(task);
  } else if (event.target.closest(".delete")) {
    if (window.confirm(`Supprimer la tâche « ${task.title} » ?`)) {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
      showToast("Tâche supprimée.");
    }
  }
});

document.querySelectorAll("[data-filter]").forEach(button => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelector("#open-task-modal").addEventListener("click", () => openModal());
document.querySelector("#empty-add-button").addEventListener("click", () => openModal());
document.querySelector("#close-task-modal").addEventListener("click", closeModal);
document.querySelector("#cancel-task").addEventListener("click", closeModal);
modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  document.querySelector("#theme-toggle").setAttribute(
    "aria-label", theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
  );
}
const savedTheme = localStorage.getItem(THEME_KEY);
const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));
document.querySelector("#theme-toggle").addEventListener("click", () => {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

const now = new Date();
document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long", day: "numeric", month: "long"
}).format(now);

setFilter("all");
