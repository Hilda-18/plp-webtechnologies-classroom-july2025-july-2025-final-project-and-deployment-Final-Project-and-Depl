// script.js — navigation, active link, back-to-top, form mock submit, smooth scroll
document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------
     Elements
     ------------------------------ */
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelector('nav ul') || document.getElementById('navLinks'); // support different HTML
  const navAnchors = document.querySelectorAll('nav a.nav-link, nav a'); // nav links collection
  const backToTop = document.getElementById('backToTop') || document.querySelector('#backToTop');

  /* ------------------------------
     Mobile menu toggle (hamburger -> X)
     ------------------------------ */
  if (menuToggle && navLinks) {
    // set ARIA
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-controls', navLinks.id || 'nav-menu');

    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
      const open = navLinks.classList.contains('show');
      menuToggle.innerHTML = open ? '&#10005;' /* ✕ */ : '&#9776;' /* ☰ */;
      menuToggle.setAttribute('aria-expanded', String(open));
    });

    // Auto-close menu after clicking a link (mobile)
    navAnchors.forEach(a => {
      a.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          menuToggle.innerHTML = '&#9776;';
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /* ------------------------------
     Highlight active nav link based on current file name
     ------------------------------ */
  (function highlightActiveLink(){
    try {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      const anchors = document.querySelectorAll('nav a');
      anchors.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        // handle index / root
        if ((href === path) || (href === 'index.html' && path === '')) {
          a.classList.add('active');
        } else {
          // also if link is same as last segment
          const linkName = href.split('/').pop();
          if (linkName === path) a.classList.add('active');
        }
      });
    } catch (e) { /* ignore */ }
  })();

  /* ------------------------------
     Back to Top button behavior
     ------------------------------ */
  if (backToTop) {
    const threshold = 220;
    window.addEventListener('scroll', () => {
      if (window.scrollY > threshold) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    });

    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------
     Smooth scroll for in-page anchors
     ------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  /* ------------------------------
     Contact form simple validation (mock)
     ------------------------------ */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (ev) => {
      // basic validation for inputs/textarea required attribute
      const requiredInputs = form.querySelectorAll('[required]');
      let ok = true;
      requiredInputs.forEach(inp => {
        if (!inp.value || inp.value.trim().length === 0) {
          ok = false;
          inp.classList.add('error');
          inp.setAttribute('aria-invalid','true');
        } else {
          inp.classList.remove('error');
          inp.removeAttribute('aria-invalid');
        }
      });

      if (!ok) {
        ev.preventDefault();
        // small common UX: focus first invalid
        const firstInvalid = form.querySelector('.error');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // If all good, prevent real submission (demo) and show mock success
      ev.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        setTimeout(() => {
          submitBtn.textContent = 'Sent ✅';
          submitBtn.style.background = 'linear-gradient(90deg,#cfe0ff,#c1f0d6)';
          // reset after a while
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            form.reset();
          }, 1600);
        }, 900);
      }
    });
  });

  /* ------------------------------
     Small accessibility: close nav on Escape
     ------------------------------ */
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (navLinks && navLinks.classList.contains('show')) {
        navLinks.classList.remove('show');
        if (menuToggle) {
          menuToggle.innerHTML = '&#9776;';
          menuToggle.setAttribute('aria-expanded', 'false');
          menuToggle.focus();
        }
      }
    }
  });

});

// Smooth page transitions
document.querySelectorAll("a").forEach(link => {
  if (link.hostname === window.location.hostname) {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href && !href.startsWith("#")) {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location = href;
        }, 500); // matches CSS transition duration
      }
    });
  }
});
