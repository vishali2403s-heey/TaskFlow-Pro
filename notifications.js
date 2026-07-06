const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

async function loadNotifications() {
  const res = await fetch('/api/notifications', { headers: { Authorization: `Bearer ${token}` } });
  const notifications = await res.json();
  const container = document.getElementById('notificationsList');
  container.innerHTML = notifications.length ? notifications.map(item => `
    <div class="list-group-item d-flex justify-content-between align-items-start">
      <div>
        <strong>${item.title}</strong>
        <div class="text-muted small">${item.message}</div>
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="deleteNotification(${item.id})">Clear</button>
    </div>`).join('') : '<div class="text-muted">No notifications yet.</div>';
}

window.deleteNotification = async (id) => {
  const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) loadNotifications();
};

loadNotifications();
