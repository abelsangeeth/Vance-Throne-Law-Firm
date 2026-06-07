// Global Application State
let currentUser = null;
let activeTab = 'login'; // login or register
let attorneys = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  loadAttorneys();
  setupFormListeners();
});

// ==========================================================================
// Session & Auth Operations
// ==========================================================================
async function checkSession() {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.user) {
        currentUser = data.user;
        updateUIForLogin();
      }
    }
  } catch (err) {
    console.error('Session check failed:', err);
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      currentUser = data.user;
      showToast('Successfully authenticated. Welcome to Vance & Thorne.', 'success');
      updateUIForLogin();
      showSection('portal');
    } else {
      showToast(data.error || 'Authentication failed. Please verify credentials.', 'error');
    }
  } catch (err) {
    showToast('Network error during authentication.', 'error');
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;

  try {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      currentUser = data.user;
      showToast('Credentials successfully created. Session active.', 'success');
      updateUIForLogin();
      showSection('portal');
    } else {
      showToast(data.error || 'Registration failed. Try again.', 'error');
    }
  } catch (err) {
    showToast('Network error during registration.', 'error');
  }
}

async function handleLogout() {
  try {
    await fetch('/api/auth/signout', { method: 'POST' });
    currentUser = null;
    updateUIForLogout();
    showSection('home');
    showToast('Session terminated.', 'success');
  } catch (err) {
    showToast('Error signing out.', 'error');
  }
}

function autoFill(email, password) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = password;
  showToast('Credentials filled.', 'success');
}

// ==========================================================================
// Directory & Caching Operations
// ==========================================================================
async function loadAttorneys() {
  const grid = document.getElementById('attorneys-grid');
  const select = document.getElementById('booking-attorney');
  const latencyText = document.getElementById('cache-latency-text');

  grid.innerHTML = '<div class="card loading-card">Loading practitioners...</div>';

  try {
    const startTime = Date.now();
    const response = await fetch('/api/attorneys');
    const data = await response.json();

    if (response.ok && data.success) {
      attorneys = data.data;

      // Update Cache Latency Text
      latencyText.textContent = `Pino Caching Latency: ${data.duration} (${data.source})`;
      
      // Update booking select
      select.innerHTML = '<option value="" disabled selected>Choose a partner...</option>';
      grid.innerHTML = '';

      attorneys.forEach((att) => {
        // Populate booking select
        const option = document.createElement('option');
        option.value = att.id;
        option.textContent = `${att.name} — ${att.title.split(',')[1] || att.title}`;
        select.appendChild(option);

        // Populate Directory grid
        const card = document.createElement('div');
        card.className = 'card attorney-card';
        card.innerHTML = `
          <img src="${att.imageUrl}" class="attorney-img" alt="${att.name}">
          <div class="attorney-details">
            <h3>${att.name}</h3>
            <div class="attorney-title">${att.title}</div>
            <p>${att.biography}</p>
            <div class="attorney-specialties">
              ${att.specialties.map(spec => `<span class="spec-badge">${spec}</span>`).join('')}
            </div>
          </div>
        `;
        grid.appendChild(card);
      });
    }
  } catch (err) {
    grid.innerHTML = '<div class="card loading-card">Failed to fetch partner listings.</div>';
  }
}

// ==========================================================================
// Booking & Background Queue Operations
// ==========================================================================
async function handleBook(e) {
  e.preventDefault();

  if (!currentUser) {
    showToast('Please sign in to the Client Portal to schedule consultations.', 'error');
    showSection('portal');
    return;
  }

  const attorneyId = document.getElementById('booking-attorney').value;
  const rawDate = document.getElementById('booking-datetime').value;
  const topic = document.getElementById('booking-topic').value;
  const notes = document.getElementById('booking-notes').value;

  if (!attorneyId || !rawDate) {
    showToast('Please specify all booking selections.', 'error');
    return;
  }

  // Convert to ISO string
  const datetime = new Date(rawDate).toISOString();

  try {
    const response = await fetch('/api/consultations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attorneyId, datetime, topic, notes }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showToast('Consultation confirmed! Background worker notified.', 'success');
      document.getElementById('booking-form').reset();
      
      // Reload lists if we are logged in
      if (currentUser) {
        loadDashboardData();
      }
    } else {
      showToast(data.error || 'Failed to book consultation.', 'error');
    }
  } catch (err) {
    showToast('Network error during booking registration.', 'error');
  }
}

// ==========================================================================
// Portal Navigation & Dashboard Sync
// ==========================================================================
function showSection(sectionId) {
  const homeSec = document.getElementById('home-section');
  const portSec = document.getElementById('portal-section');

  if (sectionId === 'home') {
    homeSec.className = 'active-section';
    portSec.className = 'inactive-section';
  } else {
    homeSec.className = 'inactive-section';
    portSec.className = 'active-section';
    if (currentUser) {
      loadDashboardData();
    }
  }
}

function switchAuthTab(tab) {
  activeTab = tab;
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

function updateUIForLogin() {
  document.getElementById('logged-out-view').classList.add('hidden');
  document.getElementById('logged-in-view').classList.remove('hidden');
  document.getElementById('welcome-user-text').textContent = `Welcome back, ${currentUser.name}`;
  document.getElementById('user-email-text').textContent = currentUser.email;
  document.getElementById('user-role-badge').textContent = currentUser.role;

  const portalLink = document.getElementById('portal-nav-link');
  portalLink.textContent = 'Dashboard';
  portalLink.onclick = () => showSection('portal');
}

function updateUIForLogout() {
  document.getElementById('logged-out-view').classList.remove('hidden');
  document.getElementById('logged-in-view').classList.add('hidden');

  const portalLink = document.getElementById('portal-nav-link');
  portalLink.textContent = 'Client Portal';
  portalLink.onclick = () => showSection('portal');
}

// Fetch dashboard active folders and bookings
async function loadDashboardData() {
  loadCases();
  loadConsultations();
  startJobMonitoring();
}

async function loadCases() {
  const list = document.getElementById('cases-list');
  const badge = document.getElementById('case-count');

  try {
    const response = await fetch('/api/cases');
    const data = await response.json();

    if (response.ok && data.success) {
      badge.textContent = data.count;
      
      if (data.count === 0) {
        list.innerHTML = '<div class="list-empty">No active legal cases folders assigned.</div>';
        return;
      }

      list.innerHTML = '';
      data.data.forEach((c) => {
        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
          <div class="item-title">${c.title}</div>
          <div class="item-meta">
            <span>File: <strong>${c.fileNumber}</strong></span>
            <span>Status: <strong class="status-badge status-${c.status}">${c.status}</strong></span>
          </div>
          <div class="item-desc">${c.description}</div>
        `;
        list.appendChild(item);
      });
    }
  } catch (err) {
    list.innerHTML = '<div class="list-empty">Failed to sync legal folders.</div>';
  }
}

async function loadConsultations() {
  const list = document.getElementById('bookings-list');
  const badge = document.getElementById('consultation-count');

  try {
    const response = await fetch('/api/consultations');
    const data = await response.json();

    if (response.ok && data.success) {
      badge.textContent = data.count;

      if (data.count === 0) {
        list.innerHTML = '<div class="list-empty">No scheduled consultations.</div>';
        return;
      }

      list.innerHTML = '';
      data.data.forEach((con) => {
        const attorneyName = attorneys.find(a => a.id === con.attorneyId)?.name || 'Lead Counsel';
        const formattedDate = new Date(con.datetime).toLocaleString();

        const item = document.createElement('div');
        item.className = 'item-card';
        item.innerHTML = `
          <div class="item-title">${con.topic}</div>
          <div class="item-meta">
            <span>Counsel: <strong>${attorneyName}</strong></span>
            <span>Time: <strong>${formattedDate}</strong></span>
            <span>Status: <strong class="status-badge status-${con.status}">${con.status}</strong></span>
          </div>
          ${con.notes ? `<div class="item-desc">${con.notes}</div>` : ''}
        `;
        list.appendChild(item);
      });
    }
  } catch (err) {
    list.innerHTML = '<div class="list-empty">Failed to sync consultations.</div>';
  }
}

// ==========================================================================
// Mock Background Job Monitor Loop
// ==========================================================================
let jobMonitorInterval = null;

function startJobMonitoring() {
  if (jobMonitorInterval) clearInterval(jobMonitorInterval);

  // Poll for background worker logs
  syncJobsList();
  jobMonitorInterval = setInterval(syncJobsList, 3000);
}

async function syncJobsList() {
  if (!currentUser) {
    if (jobMonitorInterval) clearInterval(jobMonitorInterval);
    return;
  }

  const list = document.getElementById('queue-jobs-list');

  try {
    // In our template we fetch this from a mock global endpoint, which we can route at /api/consultations/jobs
    const response = await fetch('/api/consultations/jobs');
    // Wait, let's make sure our routes support this endpoint! Let's check when writing routes.
    const data = await response.json();

    if (response.ok && data.success) {
      const jobs = data.data;

      if (jobs.length === 0) {
        list.innerHTML = '<div class="list-empty">No background notification jobs registered.</div>';
        return;
      }

      list.innerHTML = '';
      jobs.forEach((job) => {
        const item = document.createElement('div');
        item.className = 'job-item';
        item.innerHTML = `
          <div class="job-details">
            <span class="job-name">${job.name}</span> <br>
            <span class="job-id">ID: ${job.id}</span>
          </div>
          <span class="job-status-badge job-${job.status}">${job.status}</span>
        `;
        list.appendChild(item);
      });
    }
  } catch (err) {
    // Fail silently in dashboard background monitor
  }
}

// ==========================================================================
// Utility Helpers
// ==========================================================================
function setupFormListeners() {
  const portalLink = document.getElementById('portal-nav-link');
  portalLink.onclick = () => showSection('portal');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
