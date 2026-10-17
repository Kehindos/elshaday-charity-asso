/**
 * Elshaday Charity Organization - Unified Client Script
 * Handles Section Navigation, Mobile Drawer Menu, Language Toggle, and Modals
 */

// Mobile Navigation Drawer Handlers
function toggleMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  if (drawer && drawer.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function openMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const btn = document.getElementById('mobileMenuBtn');
  if (drawer) drawer.classList.add('active');
  if (overlay) overlay.classList.add('active');
  if (btn) {
    btn.classList.add('active');
    btn.setAttribute('aria-expanded', 'true');
  }
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('mobileDrawerOverlay');
  const btn = document.getElementById('mobileMenuBtn');
  if (drawer) drawer.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  if (btn) {
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded', 'false');
  }
  document.body.style.overflow = '';
}

// Section Switching (SPA Router)
function showPage(pageId) {
  closeMobileMenu();

  const pages = document.querySelectorAll('.page-section, .page');
  pages.forEach(page => {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById('page-' + pageId) || document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Highlight active nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('onclick')?.includes(pageId)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  history.replaceState(null, null, '#' + pageId);
}

// Toggle Language Mode (Amharic <-> English)
function toggleLanguage() {
  document.body.classList.toggle('am-mode');
}

// Global Keydown & Backdrop Listeners
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenu();
    if (typeof closeDonateModal === 'function') closeDonateModal();
    if (typeof closeLightbox === 'function') closeLightbox();
  }
});
