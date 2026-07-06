const token = localStorage.getItem('taskflow_token');

if (!token) {
  window.location.href = 'login.html';
}

let members = [];

async function loadMembers() {
  const res = await fetch('/api/team', { headers: { Authorization: `Bearer ${token}` } });
  members = await res.json();
  renderMembers();
}

function renderMembers() {
  document.getElementById('membersGrid').innerHTML = members.map(member => `
    <div class="col-md-6 col-xl-4">
      <div class="panel h-100">
        <div class="d-flex justify-content-between align-items-start">
          <h5>${member.name}</h5>
          <span class="badge in-progress">${member.role}</span>
        </div>
        <p class="text-muted small mt-2">${member.email}</p>
        <button class="btn btn-sm btn-outline-danger mt-2" onclick="deleteMember(${member.id})">Remove</button>
      </div>
    </div>`).join('');
}

document.getElementById('memberForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('memberName').value,
    email: document.getElementById('memberEmail').value,
    role: document.getElementById('memberRole').value
  };
  const res = await fetch('/api/team', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) });
  if (res.ok) {
    document.getElementById('memberForm').reset();
    loadMembers();
  }
});

window.deleteMember = async (id) => {
  const res = await fetch(`/api/team/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (res.ok) loadMembers();
};

loadMembers();
