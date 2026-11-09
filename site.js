(function () {
  var root = document.documentElement;
  

  // Theme toggle (initial theme is applied by the inline script in <head>)
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Header border once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Highlight the nav link of the section in view
  var links = document.querySelectorAll('.nav-link[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (l) { map[l.getAttribute('href').slice(1)] = l; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (l) { l.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) {
      var s = document.getElementById(id);
      if (s) spy.observe(s);
    });
  }

  // Local time in Dhaka
  var clock = document.querySelector('[data-dhaka-time]');
  if (clock) {
    var tick = function () {
      try {
        clock.textContent = new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka'
        }).format(new Date());
      } catch (e) {}
    };
    tick();
    setInterval(tick, 30000);
  }

  // Copy email
  var copy = document.querySelector('[data-copy]');
  if (copy) {
    copy.addEventListener('click', function () {
      var text = copy.getAttribute('data-copy');
      var label = copy.querySelector('.copy-label');
      var done = function () {
        if (!label) return;
        label.textContent = 'Copied';
        setTimeout(function () { label.textContent = 'Copy'; }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  }
})();
