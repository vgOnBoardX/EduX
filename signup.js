// signup.js — Simple Form Validation

document.addEventListener('DOMContentLoaded', function () {

  // If already logged in, go to home
  if (Auth.isLoggedIn()) {
    window.location.href = 'index.html';
  }

  // Password show/hide toggles
  document.getElementById('toggle-pass').addEventListener('click', function () {
    var passInput = document.getElementById('signup-password');
    var icon = document.getElementById('toggle-pass-icon');
    if (passInput.type === 'password') {
      passInput.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      passInput.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  document.getElementById('toggle-cpass').addEventListener('click', function () {
    var cpassInput = document.getElementById('signup-cpassword');
    var icon = document.getElementById('toggle-cpass-icon');
    if (cpassInput.type === 'password') {
      cpassInput.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      cpassInput.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  // Password strength meter (live update as user types)
  document.getElementById('signup-password').addEventListener('input', function () {
    var val = this.value;
    var fill  = document.getElementById('strength-fill');
    var label = document.getElementById('strength-label');

    if (!val) {
      fill.className = 'strength-fill';
      fill.style.width = '0';
      label.textContent = '';
      return;
    }

    var score = 0;
    if (val.length >= 8)            score++;
    if (val.length >= 12)           score++;
    if (/[A-Z]/.test(val))          score++;
    if (/[0-9]/.test(val))          score++;
    if (/[^A-Za-z0-9]/.test(val))   score++;

    if (score <= 1) {
      fill.className = 'strength-fill weak';
      label.textContent = 'Weak';
      label.style.color = '#EF4444';
    } else if (score === 2) {
      fill.className = 'strength-fill fair';
      label.textContent = 'Fair';
      label.style.color = '#F59E0B';
    } else if (score === 3) {
      fill.className = 'strength-fill good';
      label.textContent = 'Good';
      label.style.color = '#3B82F6';
    } else {
      fill.className = 'strength-fill strong';
      label.textContent = 'Strong';
      label.style.color = '#22C55E';
    }
  });

  // Form submit
  document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    var firstName = document.getElementById('signup-fname').value.trim();
    var lastName  = document.getElementById('signup-lname').value.trim();
    var email     = document.getElementById('signup-email').value.trim();
    var password  = document.getElementById('signup-password').value;
    var cpassword = document.getElementById('signup-cpassword').value;
    var terms     = document.getElementById('agree-terms').checked;
    var valid     = true;

    // First Name
    if (firstName === '') {
      document.getElementById('fname-error').textContent = 'First name is required.';
      document.getElementById('signup-fname').classList.add('is-invalid');
      valid = false;
    } else if (firstName.length < 2) {
      document.getElementById('fname-error').textContent = 'Must be at least 2 characters.';
      document.getElementById('signup-fname').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('fname-error').textContent = '';
      document.getElementById('signup-fname').classList.remove('is-invalid');
      document.getElementById('signup-fname').classList.add('is-valid');
    }

    // Last Name
    if (lastName === '') {
      document.getElementById('lname-error').textContent = 'Last name is required.';
      document.getElementById('signup-lname').classList.add('is-invalid');
      valid = false;
    } else if (lastName.length < 2) {
      document.getElementById('lname-error').textContent = 'Must be at least 2 characters.';
      document.getElementById('signup-lname').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('lname-error').textContent = '';
      document.getElementById('signup-lname').classList.remove('is-invalid');
      document.getElementById('signup-lname').classList.add('is-valid');
    }

    // Email
    if (email === '') {
      document.getElementById('email-error').textContent = 'Email is required.';
      document.getElementById('signup-email').classList.add('is-invalid');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      document.getElementById('email-error').textContent = 'Enter a valid email address.';
      document.getElementById('signup-email').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('email-error').textContent = '';
      document.getElementById('signup-email').classList.remove('is-invalid');
      document.getElementById('signup-email').classList.add('is-valid');
    }

    // Password
    if (password === '') {
      document.getElementById('password-error').textContent = 'Password is required.';
      document.getElementById('signup-password').classList.add('is-invalid');
      valid = false;
    } else if (password.length < 8) {
      document.getElementById('password-error').textContent = 'Password must be at least 8 characters.';
      document.getElementById('signup-password').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('password-error').textContent = '';
      document.getElementById('signup-password').classList.remove('is-invalid');
      document.getElementById('signup-password').classList.add('is-valid');
    }

    // Confirm Password
    if (cpassword === '') {
      document.getElementById('cpassword-error').textContent = 'Please confirm your password.';
      document.getElementById('signup-cpassword').classList.add('is-invalid');
      valid = false;
    } else if (cpassword !== password) {
      document.getElementById('cpassword-error').textContent = 'Passwords do not match.';
      document.getElementById('signup-cpassword').classList.add('is-invalid');
      valid = false;
    } else {
      document.getElementById('cpassword-error').textContent = '';
      document.getElementById('signup-cpassword').classList.remove('is-invalid');
      document.getElementById('signup-cpassword').classList.add('is-valid');
    }

    // Terms
    if (!terms) {
      document.getElementById('terms-error').textContent = 'You must accept the terms to continue.';
      valid = false;
    } else {
      document.getElementById('terms-error').textContent = '';
    }

    if (!valid) return;

    // Register using auth.js
    var result = Auth.register({
      firstName: firstName,
      lastName:  lastName,
      email:     email,
      password:  password
    });

    var alertBox = document.getElementById('signup-alert');

    if (result.success) {
      // Auto-login after registration
      Auth.login({ email: email, password: password });
      alertBox.className = 'auth-alert success';
      alertBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Account created! Welcome to EduX 🎉 Redirecting…';
      alertBox.classList.remove('d-none');
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      alertBox.className = 'auth-alert error';
      alertBox.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + result.message;
      alertBox.classList.remove('d-none');
    }
  });

});
