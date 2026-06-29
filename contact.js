// contact.js — Contact Form Validation & Submission Handler
// Works for both home.html and contact.html

document.addEventListener('DOMContentLoaded', function () {

    // ── Find which form exists on this page ────────────────────────────
    var form = document.getElementById('contact-form');
    if (!form) return; // No contact form on this page

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var valid = true;

        // ── Name ───────────────────────────────────────────────────────
        var nameEl  = document.getElementById('contactName');
        var nameErr = document.getElementById('contactName-error');
        if (nameEl.value.trim() === '') {
            nameEl.classList.add('is-invalid');
            nameEl.classList.remove('is-valid');
            nameErr.textContent = 'Name is required.';
            valid = false;
        } else if (nameEl.value.trim().length < 2) {
            nameEl.classList.add('is-invalid');
            nameEl.classList.remove('is-valid');
            nameErr.textContent = 'Name must be at least 2 characters.';
            valid = false;
        } else {
            nameEl.classList.remove('is-invalid');
            nameEl.classList.add('is-valid');
            nameErr.textContent = '';
        }

        // ── Email ──────────────────────────────────────────────────────
        var emailEl  = document.getElementById('contactEmail');
        var emailErr = document.getElementById('contactEmail-error');
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailEl.value.trim() === '') {
            emailEl.classList.add('is-invalid');
            emailEl.classList.remove('is-valid');
            emailErr.textContent = 'Email is required.';
            valid = false;
        } else if (!emailRegex.test(emailEl.value.trim())) {
            emailEl.classList.add('is-invalid');
            emailEl.classList.remove('is-valid');
            emailErr.textContent = 'Enter a valid email address.';
            valid = false;
        } else {
            emailEl.classList.remove('is-invalid');
            emailEl.classList.add('is-valid');
            emailErr.textContent = '';
        }

        // ── Phone (optional field — only on contact.html) ──────────────
        var phoneEl  = document.getElementById('contactPhone');
        var phoneErr = document.getElementById('contactPhone-error');
        if (phoneEl) {
            var phone = phoneEl.value.trim();
            if (phone !== '' && !/^[0-9\s\+\-\(\)]{7,15}$/.test(phone)) {
                phoneEl.classList.add('is-invalid');
                phoneEl.classList.remove('is-valid');
                phoneErr.textContent = 'Enter a valid phone number.';
                valid = false;
            } else if (phone !== '') {
                phoneEl.classList.remove('is-invalid');
                phoneEl.classList.add('is-valid');
                phoneErr.textContent = '';
            }
        }

        // ── Message ────────────────────────────────────────────────────
        var msgEl  = document.getElementById('contactMessage');
        var msgErr = document.getElementById('contactMessage-error');
        if (msgEl.value.trim() === '') {
            msgEl.classList.add('is-invalid');
            msgEl.classList.remove('is-valid');
            msgErr.textContent = 'Message is required.';
            valid = false;
        } else if (msgEl.value.trim().length < 10) {
            msgEl.classList.add('is-invalid');
            msgEl.classList.remove('is-valid');
            msgErr.textContent = 'Message must be at least 10 characters.';
            valid = false;
        } else {
            msgEl.classList.remove('is-invalid');
            msgEl.classList.add('is-valid');
            msgErr.textContent = '';
        }

        if (!valid) return;

        // ── Save submission to localStorage ────────────────────────────
        var submission = {
            name:    nameEl.value.trim(),
            email:   emailEl.value.trim(),
            phone:   phoneEl ? phoneEl.value.trim() : '',
            message: msgEl.value.trim(),
            date:    new Date().toLocaleString()
        };
        var existing = JSON.parse(localStorage.getItem('edux_messages') || '[]');
        existing.push(submission);
        localStorage.setItem('edux_messages', JSON.stringify(existing));

        // ── Show success message ───────────────────────────────────────
        var successBox = document.getElementById('contact-success');
        successBox.classList.remove('d-none');
        successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid').forEach(function (el) {
            el.classList.remove('is-valid');
        });

        // Hide success after 5 seconds
        setTimeout(function () {
            successBox.classList.add('d-none');
        }, 5000);
    });
});
