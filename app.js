// KHUXReLux portal: tabs, status list (status.json) and changelog (changelog.json).
// Structure follows the Re-Union X portal script: Copyright (c) 2026 Kxos and the Re-Union X contributors, MIT licence (see LICENSE-site.txt).
(function () {
  'use strict';
  var doc = document;
  doc.documentElement.className += ' js';
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  };

  // ---- tabs: one section visible, chosen by the address hash (#status, #help...);
  // the sections have ids «sec-...» so the browser does not jump down to them ----
  var sections = [].slice.call(doc.querySelectorAll('[data-section]'));
  var tabs = [].slice.call(doc.querySelectorAll('[data-tab]'));
  function show(id, scroll) {
    var key = function (s) { return s.getAttribute('data-section'); };
    var inner = null;
    if (!sections.some(function (s) { return key(s) === id; })) {
      // an anchor inside a section (e.g. #help-block): open that section and scroll to it
      var target = id ? doc.getElementById(id) : null;
      var host = target && target.closest('[data-section]');
      if (host) { inner = target; id = key(host); } else id = 'home';
    }
    sections.forEach(function (s) { s.classList.toggle('on', key(s) === id); });
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === id;
      t.classList.toggle('on', on);
      if (on) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    if (inner) { inner.scrollIntoView(); }
    else if (scroll) {
      // keep the bar in view: go back to just under the header, not to the very top
      var bar = doc.querySelector('.tabbar');
      window.scrollTo(0, bar ? Math.min(window.pageYOffset, bar.offsetTop) : 0);
    }
  }
  window.addEventListener('hashchange', function () { show(location.hash.slice(1), true); });
  // the bar is sticky (CSS only): it keeps one size, so nothing moves while scrolling
  // the Server button is a plain link; until its address is set it does nothing
  [].slice.call(doc.querySelectorAll('a[data-server]')).forEach(function (a) {
    a.addEventListener('click', function (e) { if (a.getAttribute('href') === '#') e.preventDefault(); });
  });
  show(location.hash.slice(1), false);

  // ---- status (status.json) ----
  var GROUPS = [
    { state: 'done', title: 'Works today', tag: 't-update', label: 'WORKS' },
    { state: 'progress', title: 'In progress', tag: 't-event', label: 'IN PROGRESS' },
    { state: 'missing', title: 'Not there yet', tag: 't-important', label: 'MISSING' }
  ];
  function chips(tags) {
    if (!tags || !tags.length) return '';
    return '<span class="chips">' + tags.map(function (t) {
      var k = /^original/i.test(t) ? 'original' : /^rebuilt/i.test(t) ? 'rebuilt' : /^own/i.test(t) ? 'own' : '';
      return '<span class="chip ' + k + '">' + esc(t) + '</span>';
    }).join('') + '</span>';
  }
  function renderStatus(data) {
    var areas = data.areas || [];
    var done = areas.filter(function (a) { return a.state === 'done'; }).length;
    doc.getElementById('meter-val').textContent = done + '/' + areas.length;
    doc.getElementById('meter-fill').style.width = Math.round(100 * done / Math.max(1, areas.length)) + '%';
    doc.getElementById('status-summary').innerHTML = esc(data.summary) + ' <span class="small">Updated ' + esc(data.updated)
      + (data.revision ? ', revision ' + esc(data.revision) : '') + '.</span>';
    doc.getElementById('status-list').innerHTML = GROUPS.map(function (g) {
      var rows = areas.filter(function (a) { return a.state === g.state; });
      if (!rows.length) return '';
      return '<div class="group"><h3 class="sq">' + g.title + '</h3><ul class="rows status">' + rows.map(function (a) {
        var hasBar = typeof a.total === 'number' && a.total > 0;
        var total = a.total || 1, n = Math.min(a.done || 0, total), pct = Math.round(100 * n / total);
        var count = hasBar && a.unit ? n + '/' + total + ' ' + esc(a.unit) : '';
        return '<li class="s-' + g.state + '"><div class="st' + (hasBar ? '' : ' nobar') + '"><span class="tag ' + g.tag + '">' + g.label + '</span>'
          + '<span class="n">' + esc(a.name) + '</span><span class="c">' + count + '</span>'
          + '<span class="d">' + esc(a.detail) + '</span>'
          + '<span class="bar"><i style="width:' + pct + '%"></i></span>' + chips(a.tags) + '</div></li>';
      }).join('') + '</ul></div>';
    }).join('');
  }
  fetch('status.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(renderStatus).catch(function () {
    doc.getElementById('status-summary').textContent = 'The status list could not be loaded. Open the page from a web server, not from a file on disk.';
  });

  // ---- changelog (changelog.json): [{date, revs, title, kind, items: ["**bold** text", ...]}] newest first ----
  var KINDS = { update: ['t-update', 'UPDATE'], event: ['t-event', 'EVENT'], new: ['t-campaign', 'NEW'], important: ['t-important', 'IMPORTANT'], info: ['t-info', 'INFO'] };
  function renderChangelog(list) {
    doc.getElementById('changelog-list').innerHTML = (list || []).map(function (e) {
      var k = KINDS[e.kind] || KINDS.info;
      var items = (e.items || []).map(function (t) {
        var m = /^\*\*(.+?)\*\*\s*(.*)$/.exec(t);
        return '<li>' + (m ? '<strong>' + esc(m[1]) + '</strong> ' + esc(m[2]) : esc(t)) + '</li>';
      }).join('');
      return '<article class="entry"><div class="eh"><span class="tag ' + k[0] + '">' + k[1] + '</span><span class="en">' + esc(e.title)
        + '</span><span class="ed">' + esc(e.date) + (e.revs ? ' &middot; rev ' + esc(e.revs) : '') + '</span></div><ul class="eb">' + items + '</ul></article>';
    }).join('');
  }
  fetch('changelog.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(renderChangelog).catch(function () {
    doc.getElementById('changelog-list').innerHTML = '<p class="note">The changelog could not be loaded. Open the page from a web server, not from a file on disk.</p>';
  });

  // (the gallery was removed from the page)
})();
