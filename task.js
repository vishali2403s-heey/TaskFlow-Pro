const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

const state = { tasks: [], projects: [] };

async function loadData() {
  const [tasksRes, projectsRes] = await Promise.all([
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } })
  ]);
  state.tasks = await tasksRes.json();
  state.projects = await projectsRes.json();
  populateProjects();
  renderTasks();
}

function populateProjects() {
  const select = document.getElementById('taskProject');
  select.innerHTML = state.projects.map(project => `<option value="${project.id}">${project.name}</option>`).join('');
}

function renderTasks() {
  const search = document.getElementById('taskSearch').value.toLowerCase();
  const status = document.getElementById('taskFilter').value;
  const priority = document.getElementById('priorityFilter').value;

  const filtered = state.tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search);
    const matchesStatus = status === 'all' || task.status === status;
    const matchesPriority = priority === 'all' || task.priority === priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  document.getElementById('tasksList').innerHTML = filtered.map(task => `
    <div class="col-md-6 col-xl-4">
      <div class="panel h-100">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5>${task.title}</h5>
          <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
        </div>
        <p class="text-muted small">${task.description || 'No description'}</p>
        <div class="small text-muted mb-2">Project: ${task.project_name || 'Unassigned'}</div>
        <div class="small text-muted mb-2">Due: ${task.due_date || 'TBD'}</div>
        <div class="progress mb-3"><div class="progress-bar bg-primary" style="width:${task.progress || 0}%"></div></div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-light" onclick="markComplete(${task.id})">Complete</button>
          <button class="btn btn-sm btn-outline-light" onclick="editTask(${task.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteTask(${task.id})">Delete</button>
        </div>
      </div>
    </div>`).join('');
}

document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    project_id: document.getElementById('taskProject').value,
    priority: document.getElementById('taskPriority').value,
    due_date: document.getElementById('taskDueDate').value,
    progress: document.getElementById('taskProgress').value || 0,
    status: 'Pending'
  };
  const id = document.getElementById('taskId').value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/tasks/${id}` : '/api/tasks';
  const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  if (res.ok) {
    bootstrap.Modal.getInstance(document.getElementById('taskModal')).hide();
    document.getElementById('taskForm').reset();
    loadData();
  }
});

window.editTask = (id) => {
  const task = state.tasks.find(item => item.id === id);
  if (!task) return;
  document.getElementById('taskId').value = task.id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description || '';
  document.getElementById('taskProject').value = task.project_id;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskDueDate').value = task.due_date || '';
  document.getElementById('taskProgress').value = task.progress || 0;
  new bootstrap.Modal(document.getElementById('taskModal')).show();
};

window.deleteTask = async (id) => {
  if (!confirm('Delete this task?')) return;
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) loadData();
};

window.markComplete = async (id) => {
  const res = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status: 'Completed', progress: 100 })
  });
  if (res.ok) loadData();
};

document.getElementById('taskSearch').addEventListener('input', renderTasks);
document.getElementById('taskFilter').addEventListener('change', renderTasks);
document.getElementById('priorityFilter').addEventListener('change', renderTasks);

loadData();
