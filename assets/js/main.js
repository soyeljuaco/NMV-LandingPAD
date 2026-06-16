/* ============================================================
   NMV Landing PAD — Main JS
   Pure vanilla JS — no dependencies
   ============================================================ */

'use strict';

/* ─── Tabs ─────────────────────────────────────────────────── */
function initTabs() {
  const switcher = document.querySelector('.tab-switcher');
  if (!switcher) return;
  const buttons = switcher.querySelectorAll('.tab-btn');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const target = btn.dataset.tab;
      document.querySelectorAll('[data-tab-panel]').forEach(panel => {
        panel.hidden = (panel.dataset.tabPanel !== target);
      });
    });
  });
}

/* ─── PAD rows — expand / collapse ─────────────────────────── */
function initPadRows() {
  document.querySelectorAll('.pad-row[role="button"]').forEach(row => {
    row.addEventListener('click', () => {
      const wrapper = row.closest('.pad-row-wrapper');
      const panel   = wrapper.querySelector('.pad-row-panel');
      const isOpen  = wrapper.classList.contains('is-open');

      // Cierra todos los abiertos
      document.querySelectorAll('.pad-row-wrapper.is-open').forEach(w => {
        w.classList.remove('is-open');
        w.querySelector('.pad-row-panel').hidden = true;
        w.querySelector('.pad-row[role="button"]').setAttribute('aria-expanded', 'false');
      });

      // Abre el clickeado (si estaba cerrado)
      if (!isOpen) {
        wrapper.classList.add('is-open');
        panel.hidden = false;
        row.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ─── Category pills + PAD search filter (por tab panel) ────── */
function initPillsAndSearch() {
  // Cada tab panel tiene su propio contexto de filtro independiente
  document.querySelectorAll('[data-tab-panel]').forEach(panel => {
    const pills      = panel.querySelectorAll('.pill');
    const input      = panel.querySelector('input[type="search"]');
    const wrappers   = panel.querySelectorAll('.pad-row-wrapper');
    const countEl    = panel.querySelector('.pad-count-num');

    let activeCategory = 'Todas';

    function getSearchableText(wrapper) {
      // Soporta tanto filas PAD como filas de prestador
      const name        = wrapper.dataset.name
                        || wrapper.querySelector('.pad-row-name, .prestador-name')?.textContent
                        || '';
      const specialties = wrapper.dataset.specialties
                        || wrapper.querySelector('.tag-specialty')?.textContent
                        || '';
      return { name: name.toLowerCase(), specialties: specialties.toLowerCase() };
    }

    function filterRows() {
      const query = input ? input.value.toLowerCase().trim() : '';
      let visible = 0;
      wrappers.forEach(wrapper => {
        const { name, specialties } = getSearchableText(wrapper);
        const catMatch   = activeCategory === 'Todas'
                         || specialties.includes(activeCategory.toLowerCase());
        const queryMatch = !query
                         || name.includes(query)
                         || specialties.includes(query);
        wrapper.hidden = !(catMatch && queryMatch);
        if (!wrapper.hidden) visible++;
      });
      if (countEl) countEl.textContent = visible;
    }

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.textContent.trim();
        filterRows();
      });
    });

    if (input) input.addEventListener('input', filterRows);
  });
}

/* ─── Accordion ─────────────────────────────────────────────── */
function initAccordion() {
  const items = document.querySelectorAll('.accordion-item');

  items.forEach(item => {
    const btn  = item.querySelector('.accordion-btn');
    const body = item.querySelector('.accordion-body');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.accordion-body');
        if (b) b.hidden = true;
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        if (body) body.hidden = false;
      }
    });
  });
}

/* ─── Sticky header shadow ──────────────────────────────────── */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const observer = new IntersectionObserver(
    ([e]) => header.classList.toggle('is-sticky', e.intersectionRatio < 1),
    { threshold: [1] }
  );

  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;pointer-events:none;';
  document.body.prepend(sentinel);
  observer.observe(sentinel);
}

/* ─── Smooth anchor scroll ──────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ─── Boot ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPadRows();
  initPillsAndSearch();
  initAccordion();
  initStickyHeader();
  initSmoothScroll();
});
