/* ============================================================
   EduX – Dark Mode Script
   - Apply theme to <html data-theme> BEFORE first paint
   - Persist to localStorage as "edux_theme"
   - Wire toggle button after DOM ready
   ============================================================ */

(function () {
    var STORAGE_KEY = 'edux_theme';
    var DARK = 'dark';

    /* ── 1. Apply immediately (before paint) to prevent flash ── */
    if (localStorage.getItem(STORAGE_KEY) === DARK) {
        document.documentElement.setAttribute('data-theme', DARK);
    }

    /* ── 2. Wire up the toggle button after DOM is ready ── */
    document.addEventListener('DOMContentLoaded', function () {
        var btn = document.getElementById('theme-toggle');
        if (!btn) return;

        syncIcon(btn);

        btn.addEventListener('click', function () {
            var isDark = document.documentElement.getAttribute('data-theme') === DARK;

            if (isDark) {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem(STORAGE_KEY, 'light');
            } else {
                document.documentElement.setAttribute('data-theme', DARK);
                localStorage.setItem(STORAGE_KEY, DARK);
            }

            syncIcon(btn);
        });
    });

    /* ── 3. Sync button icon & tooltip ── */
    function syncIcon(btn) {
        var isDark = document.documentElement.getAttribute('data-theme') === DARK;
        btn.innerHTML = isDark
            ? '<i class="fa-solid fa-sun fs-5"></i>'
            : '<i class="fa-solid fa-moon fs-5"></i>';
        btn.title = isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode';
        btn.setAttribute('aria-label', btn.title);
    }
})();
