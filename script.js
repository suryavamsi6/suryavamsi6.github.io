/* Surya Vamsi — behaviour layer.
   Everything degrades to a working static page without this file. */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  /* Current year in the credits line. */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Section entrances ───────────────────────────────────────
     70ms stagger between siblings of the same parent,
     rise + fade handled in CSS (.reveal / .reveal.in). */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var counters = new Map();
  reveals.forEach(function (el) {
    var parent = el.parentElement;
    var i = counters.get(parent) || 0;
    counters.set(parent, i + 1);
    el.style.setProperty('--d', Math.min(i * 70, 420) + 'ms');
  });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ── Copy email ────────────────────────────────────────────── */
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = 'd.suryavamsi@gmail.com';
      var done = function () {
        copyBtn.classList.add('copied');
        setTimeout(function () { copyBtn.classList.remove('copied'); }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = email;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (err) { /* keep static */ }
        ta.remove();
        done();
      }
    });
  }

  /* ── The live thing: one-line build feed ─────────────────────
     Last public push from the GitHub events API.
     Fails silently; the baked line stays. */
  var feed = document.getElementById('feed');
  if (feed && typeof fetch === 'function') {
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 6000) : null;
    fetch('https://api.github.com/users/suryavamsi6/events/public?per_page=30', {
      signal: ctl ? ctl.signal : undefined,
      headers: { Accept: 'application/vnd.github+json' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        return r.json();
      })
      .then(function (events) {
        if (!Array.isArray(events)) return;
        var push = null;
        for (var i = 0; i < events.length; i++) {
          if (events[i].type === 'PushEvent') { push = events[i]; break; }
        }
        if (!push) return;
        var repo = push.repo.name.replace(/^suryavamsi6\//, '');
        var days = Math.max(0, Math.round((Date.now() - new Date(push.created_at).getTime()) / 86400000));
        var when = days === 0 ? 'today' : days === 1 ? 'yesterday' : days + ' days ago';
        feed.textContent = 'Last public push: ' + repo + ', ' + when + '.';
      })
      .catch(function () { /* silent */ })
      .then(function () { if (timer) clearTimeout(timer); });
  }
})();
