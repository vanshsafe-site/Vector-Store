/* ============================================================
   Vector Store — beautify.js
   Progressive UI enhancements — works on top of app.js
   Drop in as: <script src="js/beautify.js"></script>
   ============================================================ */

(function () {
    'use strict';

    /* ── 0. Mobile detection ──────────────────────────────── */
    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    /* ── 1. Mark active nav link ──────────────────────────── */
    function highlightActiveNav() {
        const page = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav a').forEach(function (link) {
            const href = link.getAttribute('href');
            if (href && href !== '#' && href === page) {
                link.style.color = 'var(--primary)';
                link.style.background = 'var(--primary-50)';
                link.style.fontWeight = '600';
            }
        });
    }

    /* ── 2. Animate stat cards on dashboard ──────────────── */
    function animateCounters() {
        const statValues = document.querySelectorAll(
            '#totalOrders, #pendingOrders, #totalProducts, #totalRevenue, #storeProducts, #storeOrders'
        );
        if (!statValues.length) return;

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target);

                const el = entry.target;
                const rawText = el.textContent.trim();
                const isRupee = rawText.startsWith('₹');
                const numericStr = rawText.replace(/[₹,]/g, '');
                const target = parseFloat(numericStr) || 0;

                if (target === 0) return;

                const duration = isMobile() ? 500 : 900;
                const start = performance.now();

                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(target * eased);

                    el.textContent = isRupee
                        ? '₹' + current.toLocaleString('en-IN')
                        : current.toLocaleString('en-IN');

                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.3 });

        statValues.forEach(function (el) { observer.observe(el); });
    }

    /* ── 3. Format all price/rupee text in mono ──────────── */
    function styleMonoPrices() {
        // Wrap ₹ amounts in product cards and admin cards
        document.querySelectorAll('.admin-product-card p, .checkout-item').forEach(function (el) {
            el.innerHTML = el.innerHTML.replace(
                /(₹)([\d,]+)/g,
                '<span style="font-family:var(--mono);font-variant-numeric:tabular-nums;color:var(--primary);font-weight:500">₹$2</span>'
            );
        });
    }

    /* ── 4. Status badge beautification ──────────────────── */
    function upgradeStatusText() {
        const statusMap = {
            'pending':   { cls: 'status-pending',   icon: '⏳' },
            'accepted':  { cls: 'status-accepted',  icon: '✓'  },
            'confirmed': { cls: 'status-accepted',  icon: '✓'  },
            'rejected':  { cls: 'status-rejected',  icon: '✗'  },
            'cancelled': { cls: 'status-rejected',  icon: '✗'  },
            'delivered': { cls: 'status-delivered', icon: '📦' },
        };

        // In dashboard recent-orders section
        document.querySelectorAll('.admin-product-card p').forEach(function (p) {
            const text = p.textContent.trim();
            if (!text.startsWith('Status:')) return;
            const statusWord = text.replace('Status:', '').trim().toLowerCase();
            const info = statusMap[statusWord];
            if (!info) return;
            const display = statusWord.charAt(0).toUpperCase() + statusWord.slice(1);
            p.innerHTML = 'Status: <span class="status-badge ' + info.cls + '">'
                + info.icon + ' ' + display + '</span>';
        });

        // In order table rows (created dynamically by app.js — use MutationObserver)
        const ordersTable = document.getElementById('ordersTable');
        if (ordersTable) {
            function upgradeTd(td) {
                const raw = td.textContent.trim().toLowerCase();
                const info = statusMap[raw];
                if (!info) return;
                const display = raw.charAt(0).toUpperCase() + raw.slice(1);
                td.innerHTML = '<span class="status-badge ' + info.cls + '">'
                    + info.icon + ' ' + display + '</span>';
                td.setAttribute('data-upgraded', '1');
            }

            // Run once for any already-populated rows
            ordersTable.querySelectorAll('td[data-status]').forEach(upgradeTd);

            const mo = new MutationObserver(function () {
                ordersTable.querySelectorAll('td[data-status]:not([data-upgraded])').forEach(upgradeTd);
                styleMonoPrices();
            });
            mo.observe(ordersTable, { childList: true, subtree: true });
        }
    }

    /* ── 5. Low-stock alert colour ───────────────────────── */
    function colourLowStock() {
        const section = document.getElementById('lowStockProducts');
        if (!section) return;
        section.querySelectorAll('.admin-product-card').forEach(function (card) {
            card.style.borderLeftColor = 'var(--danger)';
            const pTags = card.querySelectorAll('p');
            pTags.forEach(function (p) {
                if (/only|remaining/i.test(p.textContent)) {
                    p.style.color = 'var(--danger)';
                    p.style.fontWeight = '600';
                }
            });
        });
    }

    /* ── 6. Smooth scroll-in for product cards ────────────── */
    function revealOnScroll() {
        const cards = document.querySelectorAll('.product-card, .stat-card');
        if (!cards.length) return;

        cards.forEach(function (card, i) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            var delay = isMobile() ? 0 : (i * 0.04);
            card.style.transition = 'opacity 0.35s ease ' + delay + 's, transform 0.35s ease ' + delay + 's, border-left-color 0.18s ease, box-shadow 0.18s ease';
        });

        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                io.unobserve(entry.target);
            });
        }, { threshold: 0.1 });

        // Use MutationObserver so dynamically-added cards also animate
        const productContainer = document.getElementById('productContainer');
        if (productContainer) {
            const mo2 = new MutationObserver(function () {
                document.querySelectorAll('.product-card').forEach(function (card) {
                    if (card.dataset.revealed) return;
                    card.dataset.revealed = '1';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, border-left-color 0.18s ease, box-shadow 0.18s ease';
                    io.observe(card);
                });
            });
            mo2.observe(productContainer, { childList: true, subtree: true });
        }

        cards.forEach(function (card) { io.observe(card); });
    }

    /* ── 7. Hero search — live placeholder cycle ──────────── */
    function cyclePlaceholders() {
        const input = document.getElementById('searchInput');
        if (!input) return;
        const phrases = [
            'Search medicines…',
            'e.g. Paracetamol 500mg',
            'e.g. Vitamin C Tablets',
            'e.g. Amoxicillin 250mg',
            'e.g. Metformin 500mg',
        ];
        let idx = 0;
        setInterval(function () {
            if (document.activeElement === input) return;
            idx = (idx + 1) % phrases.length;
            input.placeholder = phrases[idx];
        }, 2800);
    }

    /* ── 8. Add subtle category tags to product cards ─────── */
    function addCategoryTags() {
        // Looks for data-category attribute set by app.js on product cards
        document.querySelectorAll('.product-card[data-category]').forEach(function (card) {
            if (card.querySelector('.category-tag')) return;
            const cat = card.dataset.category;
            if (!cat) return;
            const tag = document.createElement('span');
            tag.className = 'category-tag';
            tag.textContent = cat;
            const h3 = card.querySelector('h3');
            if (h3) h3.after(tag);
        });

        // Also watch for dynamic cards
        const pc = document.getElementById('productContainer');
        if (pc) {
            new MutationObserver(function () {
                pc.querySelectorAll('.product-card[data-category]').forEach(function (card) {
                    if (card.querySelector('.category-tag')) return;
                    const cat = card.dataset.category;
                    if (!cat) return;
                    const tag = document.createElement('span');
                    tag.className = 'category-tag';
                    tag.textContent = cat;
                    const h3 = card.querySelector('h3');
                    if (h3) h3.after(tag);
                });
            }).observe(pc, { childList: true, subtree: true });
        }
    }

    /* ── 9. Form submit button loading state ──────────────── */
    function formLoadingStates() {
        document.querySelectorAll('form').forEach(function (form) {
            form.addEventListener('submit', function () {
                const btn = form.querySelector('button[type="submit"]');
                if (!btn) return;
                const original = btn.textContent;
                btn.textContent = 'Processing…';
                btn.disabled = true;
                btn.style.opacity = '0.75';
                // Re-enable after 8 seconds as safety fallback
                setTimeout(function () {
                    btn.textContent = original;
                    btn.disabled = false;
                    btn.style.opacity = '';
                }, 8000);
            });
        });
    }

    /* ── 10. Cart quantity display helper ─────────────────── */
    function enhanceCartQuantities() {
        const cart = document.getElementById('cartContainer');
        if (!cart) return;
        new MutationObserver(function () {
            cart.querySelectorAll('.cart-controls input[type="number"]').forEach(function (inp) {
                if (inp.dataset.enhanced) return;
                inp.dataset.enhanced = '1';
                inp.className = 'qty-display';
                inp.style.border = '1px solid var(--border)';
                inp.style.borderRadius = '6px';
                inp.style.padding = '4px 8px';
                inp.style.textAlign = 'center';
            });
        }).observe(cart, { childList: true, subtree: true });
    }

    /* ── 11. Page title breadcrumb polish ─────────────────── */
    function polishPageTitle() {
        const h1 = document.querySelector('.page-header h1');
        if (!h1) return;
        // Already looks good via CSS; just ensure consistent casing
        const t = h1.textContent.trim();
        if (t === t.toUpperCase()) {
            h1.textContent = t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
        }
    }

    /* ── 12. Orders table → data-label injector ───────────── *
     * CSS hides thead on mobile and uses td[data-label]::before
     * to render a column header above each cell value.
     * This function stamps data-label on every td so that works.
     * ─────────────────────────────────────────────────────── */
    function mobileOrdersTable() {
        var table = document.querySelector('.orders-table');
        if (!table) return;

        // Capture header text once
        var headers = Array.from(table.querySelectorAll('thead th'))
            .map(function (th) { return th.textContent.trim(); });

        function labelRows() {
            table.querySelectorAll('tbody tr').forEach(function (row) {
                row.querySelectorAll('td').forEach(function (td, i) {
                    if (!td.dataset.label && headers[i]) {
                        td.dataset.label = headers[i];
                    }
                });
            });
        }

        // Stamp existing rows
        labelRows();

        // Stamp rows added dynamically by app.js
        var tbody = table.querySelector('tbody');
        if (tbody) {
            new MutationObserver(labelRows).observe(tbody, { childList: true, subtree: true });
        }
    }

    /* ── Init ─────────────────────────────────────────────── */
    function init() {
        highlightActiveNav();
        animateCounters();
        styleMonoPrices();
        upgradeStatusText();
        colourLowStock();
        revealOnScroll();
        cyclePlaceholders();
        addCategoryTags();
        formLoadingStates();
        enhanceCartQuantities();
        polishPageTitle();
        mobileOrdersTable();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();