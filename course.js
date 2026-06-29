/* =========================================================
   EduX – Course Enrollment Modal & Cart Logic
   ========================================================= */

// ── Pricing multipliers for each plan ──────────────────────
const PLAN_MULTIPLIERS = { basic: 1, pro: 1.5, premium: 2.2 };

// ── State ──────────────────────────────────────────────────
let currentCourse = null;  // course data attached to the open modal
let cart = loadCart();     // array of { id, name, plan, price, img }

// ── Bootstrap modal instance ───────────────────────────────
const enrollModalEl = document.getElementById('enrollModal');
const bsModal = new bootstrap.Modal(enrollModalEl);

// ─────────────────────────────────────────────────────────────
// 1. OPEN MODAL when "Enroll Now" is clicked
// ─────────────────────────────────────────────────────────────
document.querySelectorAll('.enroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const d = btn.dataset;
        currentCourse = {
            name:     d.course,
            price:    parseInt(d.price),
            original: parseInt(d.original),
            lessons:  d.lessons,
            duration: d.duration,
            level:    d.level,
            img:      d.img
        };
        populateModal(currentCourse);
        bsModal.show();
    });
});

// ─────────────────────────────────────────────────────────────
// 2. POPULATE MODAL with course data
// ─────────────────────────────────────────────────────────────
function populateModal(course) {
    document.getElementById('modal-course-img').src      = course.img;
    document.getElementById('modal-course-name').textContent   = course.name;
    document.getElementById('modal-course-price').textContent  = '₹' + course.price.toLocaleString('en-IN');
    document.getElementById('modal-course-original').textContent = '₹' + course.original.toLocaleString('en-IN');
    document.getElementById('modal-lessons').textContent  = course.lessons;
    document.getElementById('modal-duration').textContent = course.duration;
    document.getElementById('modal-level').textContent    = course.level;

    // Set plan prices
    document.getElementById('plan-basic-price').textContent   = '₹' + course.price.toLocaleString('en-IN');
    document.getElementById('plan-pro-price').textContent     = '₹' + Math.round(course.price * PLAN_MULTIPLIERS.pro).toLocaleString('en-IN');
    document.getElementById('plan-premium-price').textContent = '₹' + Math.round(course.price * PLAN_MULTIPLIERS.premium).toLocaleString('en-IN');

    // Reset plan selection to Basic
    document.getElementById('plan-basic').checked = true;
}

// ─────────────────────────────────────────────────────────────
// 3. GET selected plan details
// ─────────────────────────────────────────────────────────────
function getSelectedPlan() {
    const val = document.querySelector('input[name="enrollPlan"]:checked').value;
    const price = Math.round(currentCourse.price * PLAN_MULTIPLIERS[val]);
    const label = val.charAt(0).toUpperCase() + val.slice(1);
    return { plan: label, price };
}

// ─────────────────────────────────────────────────────────────
// 4. ADD TO CART
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-add-cart').addEventListener('click', () => {
    if (!currentCourse) return;
    const { plan, price } = getSelectedPlan();
    const id = currentCourse.name + '-' + plan;

    // Prevent duplicate entries
    if (cart.find(item => item.id === id)) {
        showToast(`"${currentCourse.name} (${plan})" is already in your cart!`, 'info');
        return;
    }

    cart.push({ id, name: currentCourse.name, plan, price, img: currentCourse.img });
    saveCart();
    updateCartUI();
    bsModal.hide();
    showToast(`"${currentCourse.name} (${plan})" added to cart!`, 'success');
});

// ─────────────────────────────────────────────────────────────
// 5. BUY NOW (adds to cart then opens cart sidebar)
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-buy-now').addEventListener('click', () => {
    if (!currentCourse) return;
    const { plan, price } = getSelectedPlan();
    const id = currentCourse.name + '-' + plan;

    if (!cart.find(item => item.id === id)) {
        cart.push({ id, name: currentCourse.name, plan, price, img: currentCourse.img });
        saveCart();
        updateCartUI();
    }

    bsModal.hide();
    openCart();
    showToast(`Ready to checkout!`, 'success');
});

// ─────────────────────────────────────────────────────────────
// 6. CART SIDEBAR
// ─────────────────────────────────────────────────────────────
const cartSidebar  = document.getElementById('cart-sidebar');
const cartOverlay  = document.getElementById('cart-overlay');

document.getElementById('cart-toggle-btn').addEventListener('click', openCart);
document.getElementById('cart-close-btn').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function openCart()  { cartSidebar.classList.add('cart-open');  cartOverlay.classList.add('cart-overlay-active'); }
function closeCart() { cartSidebar.classList.remove('cart-open'); cartOverlay.classList.remove('cart-overlay-active'); }

// ─────────────────────────────────────────────────────────────
// 7. RENDER CART ITEMS
// ─────────────────────────────────────────────────────────────
function updateCartUI() {
    const container  = document.getElementById('cart-items-container');
    const emptyMsg   = document.getElementById('cart-empty-msg');
    const footer     = document.getElementById('cart-footer');
    const badge      = document.getElementById('cart-badge');
    const totalEl    = document.getElementById('cart-total');

    // Badge
    if (cart.length > 0) {
        badge.textContent = cart.length;
        badge.classList.remove('d-none');
    } else {
        badge.classList.add('d-none');
    }

    // Remove old item cards (keep empty msg)
    container.querySelectorAll('.cart-item').forEach(el => el.remove());

    if (cart.length === 0) {
        emptyMsg.style.display = '';
        footer.style.display   = 'none';
        return;
    }

    emptyMsg.style.display = 'none';
    footer.style.display   = '';

    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-plan">${item.plan} Plan</span>
                <span class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</span>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" title="Remove"><i class="fa-solid fa-xmark"></i></button>
        `;
        container.appendChild(el);
    });

    totalEl.textContent = '₹' + total.toLocaleString('en-IN');

    // Attach remove buttons
    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            cart = cart.filter(item => item.id !== id);
            saveCart();
            updateCartUI();
        });
    });
}

// ─────────────────────────────────────────────────────────────
// 8. CLEAR CART
// ─────────────────────────────────────────────────────────────
document.getElementById('btn-clear-cart').addEventListener('click', () => {
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Cart cleared.', 'info');
});

// ─────────────────────────────────────────────────────────────
// 9. PERSIST CART with localStorage
// ─────────────────────────────────────────────────────────────
function saveCart() {
    localStorage.setItem('edux_cart', JSON.stringify(cart));
}

function loadCart() {
    try {
        return JSON.parse(localStorage.getItem('edux_cart')) || [];
    } catch {
        return [];
    }
}

// ─────────────────────────────────────────────────────────────
// 10. TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, type = 'success') {
    const toast   = document.getElementById('cart-toast');
    const msgEl   = document.getElementById('cart-toast-msg');
    const icon    = toast.querySelector('i');

    msgEl.textContent = msg;
    icon.className = type === 'success'
        ? 'fa-solid fa-circle-check text-success me-2'
        : 'fa-solid fa-circle-info text-primary me-2';

    toast.style.display = 'flex';
    toast.classList.add('cart-toast-show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove('cart-toast-show');
        setTimeout(() => { toast.style.display = 'none'; }, 400);
    }, 3000);
}

// ─────────────────────────────────────────────────────────────
// 11. INIT on page load
// ─────────────────────────────────────────────────────────────
updateCartUI();
