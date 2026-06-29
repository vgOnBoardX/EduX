/**
 * auth.js — EduX Shared Authentication Utility
 * Manages user registration, login, logout, and session state
 * using localStorage as the data store.
 */

const AUTH_KEY = 'edux_users';
const SESSION_KEY = 'edux_session';

const Auth = {
  /** Return the array of all registered users */
  getUsers() {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '[]');
  },

  /** Persist the users array */
  saveUsers(users) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
  },

  /** Return the currently logged-in user object, or null */
  getSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  },

  /** Create a session for a user */
  setSession(user) {
    // Never store the raw password in session
    const { password: _pw, ...safeUser } = user;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
  },

  /** Destroy the session */
  clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  },

  /** Check whether someone is currently logged in */
  isLoggedIn() {
    return this.getSession() !== null;
  },

  /**
   * Register a new user.
   * @returns {object} { success: bool, message: string }
   */
  register({ firstName, lastName, email, password }) {
    const users = this.getUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password,          // In a real app this would be hashed
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, message: 'Registration successful!' };
  },

  /**
   * Attempt to log in with email + password.
   * @returns {object} { success: bool, message: string }
   */
  login({ email, password }) {
    const users = this.getUsers();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    this.setSession(user);
    return { success: true, message: 'Login successful!' };
  },

  /** Log the current user out and redirect to login */
  logout(redirectTo = 'login.html') {
    this.clearSession();
    window.location.href = redirectTo;
  }
};

// ─── Nav Guard ────────────────────────────────────────────────────────────────
// Call this on any page that requires a logged-in user.
// Redirects to login if no session exists.
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = 'login.html';
  }
}

// ─── Nav Updater ──────────────────────────────────────────────────────────────
// Call this on every page to update the navbar buttons with user info.
function updateNavAuth() {
  const user = Auth.getSession();
  const btnContainer = document.getElementById('nav-auth-btns');
  if (!btnContainer) return;

  if (user) {
    btnContainer.innerHTML = `
      <div class="d-grid d-lg-flex align-items-center gap-2 mt-3 mt-lg-0">
        <span class="nav-user-greeting fw-semibold text-center text-lg-start mb-2 mb-lg-0">
          <i class="fa-solid fa-circle-user me-1 text-primary"></i>Hi, ${user.firstName}!
        </span>
        <button id="logout-btn" type="button" class="btn btn-danger btn-sm rounded-pill px-3">
          <i class="fa-solid fa-right-from-bracket me-1"></i>Logout
        </button>
      </div>`;
    document.getElementById('logout-btn').addEventListener('click', () => Auth.logout('index.html'));
  } else {
    btnContainer.innerHTML = `
      <div class="d-grid d-lg-flex gap-2 mt-3 mt-lg-0">
        <a class="btn btn-light border-0 rounded px-4 fw-semibold text-dark" href="signup.html">Sign Up</a>
        <a class="btn btn-dark border-0 rounded px-4 fw-semibold text-white" href="login.html">Login</a>
      </div>`;
  }
}
