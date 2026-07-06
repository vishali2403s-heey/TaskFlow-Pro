document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      password: document.getElementById('password').value,
      confirmPassword: document.getElementById('confirmPassword').value
    };

    if (payload.password !== payload.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload.name, email: payload.email, password: payload.password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      alert('Account created successfully. Please log in.');
      window.location.href = 'login.html';
    } catch (err) {
      alert(err.message);
    }
  });
});
