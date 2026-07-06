const token = localStorage.getItem('taskflow_token');
const user = JSON.parse(localStorage.getItem('taskflow_user') || '{}');

if (!token) {
  window.location.href = 'login.html';
}

async function loadProfile() {
  const [projectsRes, tasksRes] = await Promise.all([
    fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
    fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } })
  ]);
  const projects = await projectsRes.json();
  const tasks = await tasksRes.json();

  document.getElementById('profileName').textContent = user.name || 'TaskFlow User';
  document.getElementById('profileEmail').textContent = user.email || '';
  document.getElementById('profileProjects').textContent = projects.length;
  document.getElementById('profileTasks').textContent = tasks.length;
  document.getElementById('profileCompleted').textContent = tasks.filter(task => task.status === 'Completed').length;
}

loadProfile();
