const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

async function loadDashboard() {
  try {
    const [projectsRes, tasksRes, analyticsRes, notificationsRes] = await Promise.all([
      fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/analytics', { headers: { Authorization: `Bearer ${token}` } }),
      fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } })
    ]);

    const projects = await projectsRes.json();
    const tasks = await tasksRes.json();
    const analytics = await analyticsRes.json();
    const notifications = await notificationsRes.json();

    document.getElementById('totalProjects').textContent = analytics.projects?.totalProjects || projects.length;
    document.getElementById('totalTasks').textContent = analytics.tasks?.totalTasks || tasks.length;
    document.getElementById('completedTasks').textContent = analytics.completed?.completedTasks || tasks.filter(t => t.status === 'Completed').length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => t.status !== 'Completed').length;

    const projectsTableBody = document.getElementById('projectsTableBody');
    projectsTableBody.innerHTML = projects.slice(0, 4).map(project => `
      <tr>
        <td>${project.name}</td>
        <td><span class="badge ${project.status.toLowerCase().replace(' ', '-')}">${project.status}</span></td>
        <td>${project.progress || 0}%</td>
      </tr>`).join('');

    const activityList = document.getElementById('activityList');
    activityList.innerHTML = notifications.slice(0, 4).map(item => `<div class="list-group-item"><strong>${item.title}</strong><div class="text-muted small">${item.message}</div></div>`).join('');

    const deadlineList = document.getElementById('deadlineList');
    deadlineList.innerHTML = projects.filter(project => project.deadline).slice(0, 4).map(project => `<div class="list-group-item"><strong>${project.name}</strong><div class="text-muted small">${project.deadline}</div></div>`).join('');

    renderChart(analytics);
  } catch (error) {
    console.error(error);
  }
}

function renderChart(analytics) {
  const ctx = document.getElementById('progressChart');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{ data: [analytics.completed?.completedTasks || 0, (analytics.tasks?.totalTasks || 0) - (analytics.completed?.completedTasks || 0)], backgroundColor: ['#22c55e', '#3b82f6'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

function logout() {
  localStorage.removeItem('taskflow_token');
  localStorage.removeItem('taskflow_user');
  window.location.href = 'login.html';
}

loadDashboard();
