const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

const state = { projects: [], filteredProjects: [] };

const projectForm = document.getElementById('projectForm');
const projectSearch = document.getElementById('projectSearch');
const projectFilter = document.getElementById('projectFilter');
const projectsGrid = document.getElementById('projectsGrid');

async function loadProjects() {
  const res = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
  state.projects = await res.json();
  renderProjects();
}

function renderProjects() {
  const search = projectSearch?.value.toLowerCase() || '';
  const filter = projectFilter?.value || 'all';
  state.filteredProjects = state.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(search) || project.description.toLowerCase().includes(search);
    const matchesFilter = filter === 'all' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  projectsGrid.innerHTML = state.filteredProjects.map(project => `
    <div class="col-md-6 col-xl-4">
      <div class="panel h-100">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5>${project.name}</h5>
          <span class="badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span>
        </div>
        <p class="text-muted small">${project.description || 'No description provided.'}</p>
        <div class="mb-2"><strong>Progress:</strong> ${project.progress || 0}%</div>
        <div class="progress mb-3"><div class="progress-bar bg-primary" style="width:${project.progress || 0}%"></div></div>
        <div class="small text-muted mb-3">Deadline: ${project.deadline || 'TBD'}</div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-outline-light" onclick="editProject(${project.id})">Edit</button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteProject(${project.id})">Delete</button>
        </div>
      </div>
    </div>`).join('');
}

projectForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('projectName').value,
    description: document.getElementById('projectDescription').value,
    status: document.getElementById('projectStatus').value,
    progress: document.getElementById('projectProgress').value || 0,
    deadline: document.getElementById('projectDeadline').value
  };
  const id = document.getElementById('projectId').value;

  const method = id ? 'PUT' : 'POST';
  const url = id ? `/api/projects/${id}` : '/api/projects';
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (res.ok) {
    bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide();
    projectForm.reset();
    loadProjects();
  } else {
    alert(data.message || 'Failed to save project');
  }
});

window.editProject = (id) => {
  const project = state.projects.find(item => item.id === id);
  if (!project) return;
  document.getElementById('projectId').value = project.id;
  document.getElementById('projectName').value = project.name;
  document.getElementById('projectDescription').value = project.description || '';
  document.getElementById('projectStatus').value = project.status;
  document.getElementById('projectProgress').value = project.progress || 0;
  document.getElementById('projectDeadline').value = project.deadline || '';
  new bootstrap.Modal(document.getElementById('projectModal')).show();
};

window.deleteProject = async (id) => {
  if (!confirm('Delete this project?')) return;
  const res = await fetch(`/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) loadProjects();
};

projectSearch?.addEventListener('input', renderProjects);
projectFilter?.addEventListener('change', renderProjects);

loadProjects();
