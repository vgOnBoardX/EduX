// login.js — Simple Form Validation

document.addEventListener('DOMContentLoaded', function () {

  // If already logged in, go to home
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
  }

  // Password show/hide toggle
  document.getElementById('toggle-login-pass').addEventListener('click', function () {
    var passInput = document.getElementById('login-password');
    var icon = document.getElementById('toggle-login-icon');
    if (passInput.type === 'password') {
      passInput.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      passInput.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  // Form submit
  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var email    = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;
    var valid    = true;

    // Email validation
    if (email === '') {
      document.getElementById('email-error').textContent = 'Email is required.';
      document.getElementById('login-email').classList.add('is-invalid');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('email-error').textContent = 'Enter a valid email address.';
      document.getElementById('login-email').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('email-error').textContent = '';
      document.getElementById('login-email').classList.remove('is-invalid');
      document.getElementById('login-email').classList.add('is-valid');
    }

    // Password validation
    if (password === '') {
      document.getElementById('password-error').textContent = 'Password is required.';
      document.getElementById('login-password').classList.add('is-invalid');
      valid = false;
    } else if (password.length < 6) {
      document.getElementById('password-error').textContent = 'Password must be at least 6 characters.';
      document.getElementById('login-password').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('password-error').textContent = '';
      document.getElementById('login-password').classList.remove('is-invalid');
      document.getElementById('login-password').classList.add('is-valid');
    }

    if (!valid) return;

    // Try to log in using auth.js
    var result = Auth.login({ email: email, password: password });

    if (result.success) {
      var alertBox = document.getElementById('login-alert');
      alertBox.className = 'auth-alert success';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Login successful! Redirecting…';
      alertBox.classList.remove('d-none');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1200);
    } else {
      var alertBox = document.getElementById('login-alert');
      alertBox.className = 'auth-alert error';
      alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + result.message;
      alertBox.classList.remove('d-none');
    }
  });

  // Forgot password modal
  document.getElementById('forgot-link').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('forgot-modal').classList.remove('d-none');
    document.getElementById('forgot-success').classList.add('d-none');
    document.getElementById('forgot-email-error').textContent = '';
  });

  document.getElementById('close-forgot').addEventListener('click', function () {
    document.getElementById('forgot-modal').classList.add('d-none');
  });

  document.getElementById('forgot-submit-btn').addEventListener('click', function () {
    var email = document.getElementById('forgot-email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('forgot-email-error').textContent = 'Please enter a valid email.';
      return;
    }
    document.getElementById('forgot-email-error').textContent = '';
    document.getElementById('forgot-success').classList.remove('d-none');
    setTimeout(function () {
      document.getElementById('forgot-modal').classList.add('d-none');
    }, 2500);
  });

});
