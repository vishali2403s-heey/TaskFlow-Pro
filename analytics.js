const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

async function loadAnalytics() {
  const res = await fetch('/api/analytics', { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json();
  const completed = Number(data.completed?.completedTasks || 0);
  const total = Number(data.tasks?.totalTasks || 0);
  const pending = Math.max(total - completed, 0);

  new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
      labels: ['Projects', 'Tasks', 'Completed'],
      datasets: [{ label: 'Workspace Metrics', data: [Number(data.projects?.totalProjects || 0), total, completed], borderColor: '#3b82f6', tension: 0.4, fill: true, backgroundColor: 'rgba(59,130,246,0.2)' }]
    }
  });

  new Chart(document.getElementById('pieChart'), {
    type: 'pie',
    data: {
      labels: ['Completed', 'Pending'],
      datasets: [{ data: [completed, pending], backgroundColor: ['#22c55e', '#3b82f6'] }]
    }
  });

  new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
      labels: ['Projects', 'Tasks', 'Completed'],
      datasets: [{ label: 'Counts', data: [Number(data.projects?.totalProjects || 0), total, completed], backgroundColor: ['#3b82f6', '#60a5fa', '#22c55e'] }]
    }
  });
}

loadAnalytics();
