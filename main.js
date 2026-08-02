/* ============================================================
   Whispering Green Foundation — Main JS
   ============================================================ */
(function () {
  'use strict';

  function createFallbackImage(text) {
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">',
      '<rect width="1200" height="800" fill="#eaf5ea" />',
      '<rect x="90" y="90" width="1020" height="620" rx="28" fill="#f7fbf6" stroke="#2e7d32" stroke-width="4" />',
      '<path d="M330 530c50-124 128-210 220-210 78 0 152 62 210 196" fill="none" stroke="#81c784" stroke-width="18" stroke-linecap="round" />',
      '<circle cx="290" cy="270" r="84" fill="#2e7d32" />',
      '<text x="600" y="430" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="36" fill="#1b5e20">' + text + '</text>',
      '<text x="600" y="490" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" fill="#5a5f58">Community impact in action</text>',
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function attachImageFallbacks() {
    document.querySelectorAll('img').forEach(function (img) {
      img.addEventListener('error', function () {
        if (!img.dataset.fallback) {
          img.dataset.fallback = '1';
          var altText = (img.getAttribute('alt') || 'Community initiative').replace(/[^a-z0-9]+/gi, ' ').trim() || 'Community initiative';
          img.src = createFallbackImage(altText);
        }
      });
      if (img.complete && img.naturalWidth === 0) {
        img.dispatchEvent(new Event('error'));
      }
    });
  }

  attachImageFallbacks();

  /* ---------- Preloader ---------- */
  window.addEventListener('load', function () {
    var pre = document.getElementById('preloader');
    if (pre) setTimeout(function () { pre.classList.add('loaded'); }, 400);
  });

  /* ---------- Sticky Navbar ---------- */
  var header = document.getElementById('site-header');
  function onScroll() {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    var scrollTopBtn = document.getElementById('scroll-top');
    if (window.scrollY > 500) scrollTopBtn.classList.add('show');
    else scrollTopBtn.classList.remove('show');

    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.getElementById('nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('mobile-open');
      var icon = navToggle.querySelector('i');
      if (navLinks.classList.contains('mobile-open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('mobile-open');
        var icon = navToggle.querySelector('i');
        icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));
  function updateActiveNav() {
    var scrollPos = window.scrollY + 140;
    var current = '';
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) current = sec.getAttribute('id');
    });
    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  /* ---------- Scroll to top ---------- */
  var scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- Counter animation ---------- */
  var counters = document.querySelectorAll('.impact-num');
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(function (c) { counterIO.observe(c); });

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1800;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Floating leaves ---------- */
  var leafField = document.getElementById('leaf-field');
  if (leafField) {
    var leafIcons = ['fa-leaf', 'fa-seedling'];
    for (var i = 0; i < 14; i++) {
      var leaf = document.createElement('i');
      leaf.className = 'fa-solid ' + leafIcons[i % 2] + ' leaf';
      leaf.style.left = Math.random() * 100 + '%';
      leaf.style.animationDuration = (10 + Math.random() * 10) + 's';
      leaf.style.animationDelay = (Math.random() * 10) + 's';
      leaf.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
      leafField.appendChild(leaf);
    }
  }

  /* ---------- Ripple effect on buttons ---------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 650);
    });
  });

  /* ---------- Theme toggle (dark/light) ---------- */
  var themeToggle = document.getElementById('theme-toggle');
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('wgf-theme');
  if (savedTheme === 'dark') {
    root.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.querySelector('i').className = 'fa-solid fa-sun';
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        localStorage.setItem('wgf-theme', 'light');
        themeToggle.querySelector('i').className = 'fa-solid fa-moon';
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('wgf-theme', 'dark');
        themeToggle.querySelector('i').className = 'fa-solid fa-sun';
      }
    });
  }

  /* ---------- Search overlay ---------- */
  var searchToggle = document.getElementById('search-toggle');
  var searchOverlay = document.getElementById('search-overlay');
  var searchInput = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');
  var searchClose = document.getElementById('search-close');

  var searchIndex = [
    { title: 'About Us — Our Story, Vision & Mission', href: '#about' },
    { title: 'Focus Areas — Plastic Waste Management', href: '#focus' },
    { title: 'Focus Areas — Tree Plantation', href: '#focus' },
    { title: 'Focus Areas — Beach Cleanup', href: '#focus' },
    { title: 'Focus Areas — School Awareness Programs', href: '#focus' },
    { title: 'Impact Dashboard — Our Numbers', href: '#impact' },
    { title: 'Sustainable Development Goals', href: '#sdg' },
    { title: 'Our Projects', href: '#projects' },
    { title: 'Before & After Cleanup Comparison', href: '#compare' },
    { title: 'Gallery', href: '#gallery' },
    { title: 'Upcoming Events', href: '#events' },
    { title: 'Become a Volunteer', href: '#volunteer' },
    { title: 'Donate — Support a Greener Future', href: '#donate' },
    { title: 'Testimonials', href: '#testimonials' },
    { title: 'Blog & Articles', href: '#blog' },
    { title: 'Contact Us', href: '#contact' }
  ];

  function openSearch() {
    searchOverlay.classList.add('open');
    setTimeout(function () { searchInput.focus(); }, 250);
  }
  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchInput.value = '';
    searchResults.innerHTML = '';
  }
  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSearch();
  });
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      searchResults.innerHTML = '';
      if (!q) return;
      var matches = searchIndex.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) !== -1;
      });
      if (!matches.length) {
        searchResults.innerHTML = '<a>No results found for "' + q + '"</a>';
        return;
      }
      matches.forEach(function (m) {
        var a = document.createElement('a');
        a.href = m.href;
        a.textContent = m.title;
        a.addEventListener('click', closeSearch);
        searchResults.appendChild(a);
      });
    });
  }

  /* ---------- About tabs ---------- */
  var tabs = document.querySelectorAll('.about-tab');
  var panels = document.querySelectorAll('.about-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      panels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById(tab.getAttribute('data-tab')).classList.add('active');
    });
  });

  /* ---------- Before/After comparison slider ---------- */
  var baSlider = document.getElementById('ba-slider');
  if (baSlider) {
    var beforeWrap = baSlider.querySelector('.ba-before-wrap');
    var handle = baSlider.querySelector('.ba-handle');
    var dragging = false;

    function setSlide(clientX) {
      var rect = baSlider.getBoundingClientRect();
      var x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      var percent = (x / rect.width) * 100;
      beforeWrap.style.width = percent + '%';
      handle.style.left = percent + '%';
    }
    handle.addEventListener('mousedown', function () { dragging = true; });
    window.addEventListener('mouseup', function () { dragging = false; });
    window.addEventListener('mousemove', function (e) {
      if (dragging) setSlide(e.clientX);
    });
    handle.addEventListener('touchstart', function () { dragging = true; }, { passive: true });
    window.addEventListener('touchend', function () { dragging = false; });
    window.addEventListener('touchmove', function (e) {
      if (dragging && e.touches[0]) setSlide(e.touches[0].clientX);
    }, { passive: true });
    baSlider.addEventListener('click', function (e) { setSlide(e.clientX); });
  }

  /* ---------- Gallery Masonry filter + Lightbox ---------- */
  var galleryFilters = document.querySelectorAll('.gallery-filter');
  var masonryItems = document.querySelectorAll('.masonry-item');
  galleryFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      galleryFilters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      masonryItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  var lightbox = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCaption = document.getElementById('lb-caption');
  var galleryImages = Array.prototype.slice.call(masonryItems);
  var currentLbIndex = 0;

  function openLightbox(index) {
    currentLbIndex = index;
    var img = galleryImages[index].querySelector('img');
    lbImg.src = img.src;
    lbCaption.textContent = img.getAttribute('alt') || '';
    lightbox.classList.add('open');
  }
  masonryItems.forEach(function (item, idx) {
    item.addEventListener('click', function () { openLightbox(idx); });
  });
  var lbClose = document.getElementById('lb-close');
  var lbPrev = document.getElementById('lb-prev');
  var lbNext = document.getElementById('lb-next');
  if (lbClose) lbClose.addEventListener('click', function () { lightbox.classList.remove('open'); });
  if (lbPrev) lbPrev.addEventListener('click', function () {
    currentLbIndex = (currentLbIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentLbIndex);
  });
  if (lbNext) lbNext.addEventListener('click', function () {
    currentLbIndex = (currentLbIndex + 1) % galleryImages.length;
    openLightbox(currentLbIndex);
  });
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }

  /* ---------- Toast notification ---------- */
  window.showToast = function (message, icon) {
    var toast = document.getElementById('toast');
    toast.innerHTML = '<i class="fa-solid ' + (icon || 'fa-circle-check') + '"></i> ' + message;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3800);
  };

  /* ---------- Countdown timer for next event ---------- */
  function startCountdown(targetDateStr) {
    var el = document.getElementById('countdown-timer');
    if (!el) return;
    var target = new Date(targetDateStr).getTime();
    function update() {
      var now = new Date().getTime();
      var diff = target - now;
      if (diff <= 0) {
        el.innerHTML = '<div class="cd-block"><strong>Live</strong><span>Now</span></div>';
        return;
      }
      var d = Math.floor(diff / (1000 * 60 * 60 * 24));
      var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      var m = Math.floor((diff / (1000 * 60)) % 60);
      var s = Math.floor((diff / 1000) % 60);
      el.innerHTML =
        '<div class="cd-block"><strong>' + d + '</strong><span>Days</span></div>' +
        '<div class="cd-block"><strong>' + h + '</strong><span>Hours</span></div>' +
        '<div class="cd-block"><strong>' + m + '</strong><span>Mins</span></div>' +
        '<div class="cd-block"><strong>' + s + '</strong><span>Secs</span></div>';
    }
    update();
    setInterval(update, 1000);
  }
  window.startCountdown = startCountdown;

  /* ---------- Testimonial carousel ---------- */
  var testiTrack = document.getElementById('testi-track');
  if (testiTrack) {
    var testiCards = testiTrack.children.length;
    var visibleCount = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
    var testiIndex = 0;
    function slideTesti(dir) {
      visibleCount = window.innerWidth <= 720 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);
      var maxIndex = Math.max(testiCards - visibleCount, 0);
      testiIndex += dir;
      if (testiIndex < 0) testiIndex = maxIndex;
      if (testiIndex > maxIndex) testiIndex = 0;
      var cardWidth = testiTrack.children[0].getBoundingClientRect().width + 28;
      testiTrack.style.transform = 'translateX(-' + (cardWidth * testiIndex) + 'px)';
    }
    document.getElementById('testi-next').addEventListener('click', function () { slideTesti(1); });
    document.getElementById('testi-prev').addEventListener('click', function () { slideTesti(-1); });
    setInterval(function () { slideTesti(1); }, 6000);
  }

  /* ---------- Donation amount selection ---------- */
  var amountBtns = document.querySelectorAll('.amount-btn');
  var customAmountInput = document.getElementById('custom-amount');
  var selectedAmount = 500;
  amountBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      amountBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedAmount = parseInt(btn.getAttribute('data-amount'), 10);
      if (customAmountInput) customAmountInput.value = '';
    });
  });
  if (customAmountInput) {
    customAmountInput.addEventListener('input', function () {
      amountBtns.forEach(function (b) { b.classList.remove('active'); });
      selectedAmount = parseInt(customAmountInput.value, 10) || 0;
    });
  }
  var freqBtns = document.querySelectorAll('.donate-freq button');
  var selectedFreq = 'one-time';
  freqBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      freqBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      selectedFreq = btn.getAttribute('data-freq');
    });
  });

  /* ============================================================
     Table API helpers
     ============================================================ */
  function apiPost(table, data) {
    return fetch('tables/' + table, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      return res.json();
    });
  }

  /* ---------- Donation form submit ---------- */
  var donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('donor-name').value.trim();
      var email = document.getElementById('donor-email').value.trim();
      if (!selectedAmount || selectedAmount <= 0) {
        showToast('Please select or enter a valid donation amount.', 'fa-triangle-exclamation');
        return;
      }
      apiPost('donations', {
        id: 'don-' + Date.now(),
        name: name,
        email: email,
        amount: selectedAmount,
        frequency: selectedFreq,
        message: document.getElementById('donor-message') ? document.getElementById('donor-message').value.trim() : ''
      }).then(function () {
        showToast('Thank you, ' + (name || 'friend') + '! Your ₹' + selectedAmount + ' donation means the world to us. 🌍', 'fa-heart');
        donateForm.reset();
        amountBtns.forEach(function (b) { b.classList.remove('active'); });
      }).catch(function () {
        showToast('Something went wrong. Please try again.', 'fa-triangle-exclamation');
      });
    });
  }

  /* ---------- Volunteer form submit ---------- */
  var volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var msgEl = document.getElementById('volunteer-form-msg');
      var data = {
        id: 'vol-' + Date.now(),
        name: document.getElementById('vol-name').value.trim(),
        email: document.getElementById('vol-email').value.trim(),
        phone: document.getElementById('vol-phone').value.trim(),
        city: document.getElementById('vol-city').value.trim(),
        age: parseInt(document.getElementById('vol-age').value, 10) || 0,
        availability: document.getElementById('vol-availability').value,
        interest_area: document.getElementById('vol-interest').value,
        message: document.getElementById('vol-message').value.trim()
      };
      apiPost('volunteers', data).then(function () {
        msgEl.textContent = 'Thank you, ' + data.name + '! We\u2019ll reach out within 3 business days. 🌱';
        msgEl.className = 'form-msg success';
        volunteerForm.reset();
        showToast('Volunteer application submitted!', 'fa-seedling');
      }).catch(function () {
        msgEl.textContent = 'Something went wrong. Please try again.';
        msgEl.className = 'form-msg error';
      });
    });
  }

  /* ---------- Contact form submit ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        id: 'msg-' + Date.now(),
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        subject: document.getElementById('contact-subject').value.trim(),
        message: document.getElementById('contact-message').value.trim()
      };
      apiPost('contact_messages', data).then(function () {
        showToast('Message sent! We\u2019ll get back to you soon.', 'fa-paper-plane');
        contactForm.reset();
      }).catch(function () {
        showToast('Something went wrong. Please try again.', 'fa-triangle-exclamation');
      });
    });
  }

  /* ---------- Newsletter subscribe ---------- */
  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var email = input.value.trim();
      if (!email) return;
      apiPost('newsletter_subscribers', { id: 'news-' + Date.now(), email: email }).then(function () {
        showToast('Subscribed! Welcome to our green community. 🌿', 'fa-envelope-circle-check');
        form.reset();
      }).catch(function () {
        showToast('Subscription failed. Please try again.', 'fa-triangle-exclamation');
      });
    });
  });

  /* ---------- Events: load from API + registration modal ---------- */
  var eventsGrid = document.getElementById('events-grid');
  var monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  function renderEvents(events) {
    if (!eventsGrid) return;
    eventsGrid.innerHTML = '';
    events.forEach(function (ev) {
      var d = new Date(ev.event_date);
      var card = document.createElement('div');
      card.className = 'event-card reveal';
      card.innerHTML =
        '<div class="event-date-block"><span class="day">' + d.getDate() + '</span><span class="mon">' + monthNames[d.getMonth()] + '</span></div>' +
        '<div class="event-info">' +
          '<h3>' + ev.title + '</h3>' +
          '<div class="event-meta">' +
            '<span><i class="fa-solid fa-location-dot"></i> ' + ev.location + '</span>' +
            '<span><i class="fa-solid fa-clock"></i> ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</span>' +
          '</div>' +
          '<p class="desc">' + ev.description + '</p>' +
          '<div class="event-footer">' +
            '<span class="event-spots"><i class="fa-solid fa-users"></i> ' + ev.spots_left + ' spots left</span>' +
            '<button class="btn btn-primary btn-sm register-btn" data-event-id="' + ev.id + '" data-event-title="' + ev.title.replace(/"/g, '&quot;') + '">Register</button>' +
          '</div>' +
        '</div>';
      eventsGrid.appendChild(card);
    });
    // re-observe reveal
    eventsGrid.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
    attachRegisterHandlers();

    // countdown to soonest event
    if (events.length) {
      var soonest = events.reduce(function (a, b) {
        return new Date(a.event_date) < new Date(b.event_date) ? a : b;
      });
      startCountdown(soonest.event_date);
      var cdTitle = document.getElementById('countdown-event-title');
      if (cdTitle) cdTitle.textContent = soonest.title;
    }
  }

  function loadEvents() {
    fetch('tables/events?limit=20&sort=event_date')
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var list = (json.data || []).filter(function (e) { return !e.deleted; });
        list.sort(function (a, b) { return new Date(a.event_date) - new Date(b.event_date); });
        renderEvents(list);
      })
      .catch(function () {
        console.warn('Could not load events from API');
      });
  }
  loadEvents();

  /* Registration modal */
  var regModal = document.getElementById('registration-modal');
  var regEventTitle = document.getElementById('reg-event-title');
  var regEventIdInput = document.getElementById('reg-event-id');
  var regForm = document.getElementById('registration-form');

  function attachRegisterHandlers() {
    document.querySelectorAll('.register-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        regEventTitle.textContent = btn.getAttribute('data-event-title');
        regEventIdInput.value = btn.getAttribute('data-event-id');
        regModal.classList.add('open');
      });
    });
  }
  document.querySelectorAll('[data-close-modal]').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.modal-overlay').forEach(function (m) { m.classList.remove('open'); });
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  });
  if (regForm) {
    regForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = {
        id: 'reg-' + Date.now(),
        event_id: regEventIdInput.value,
        event_title: regEventTitle.textContent,
        name: document.getElementById('reg-name').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: document.getElementById('reg-phone').value.trim()
      };
      apiPost('event_registrations', data).then(function () {
        regModal.classList.remove('open');
        showToast('You\u2019re registered for ' + data.event_title + '! See you there. 🎉', 'fa-calendar-check');
        regForm.reset();
      }).catch(function () {
        showToast('Registration failed. Please try again.', 'fa-triangle-exclamation');
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
