window.addEventListener('load', function () {
  'use strict';

  var body = document.body;
  var universe = document.getElementById('universe');
  var solarsys = document.getElementById('solar-system');
  var dataPanel = document.getElementById('data');
  var controlsPanel = document.getElementById('controls');
  var toggleData = document.getElementById('toggle-data');
  var toggleControls = document.getElementById('toggle-controls');

  var dataLinks = Array.prototype.slice.call(dataPanel.querySelectorAll('a'));
  var viewInput = controlsPanel.querySelector('.set-view input');
  var zoomInput = controlsPanel.querySelector('.set-zoom input');

  var scales = {
    'set-speed': 'scale-stretched set-speed',
    'set-size': 'scale-s set-size',
    'set-distance': 'scale-d set-distance'
  };

  // Each class is toggled independently, like jQuery's toggleClass("a b").
  var toggleTwoClasses = function (el, a, b) {
    el.classList.toggle(a);
    el.classList.toggle(b);
  };

  var syncState = function () {
    viewInput.setAttribute('aria-label',
      body.classList.contains('view-3D') ? 'Switch to 2D view' : 'Switch to 3D view');
    zoomInput.setAttribute('aria-label',
      body.classList.contains('zoom-large') ? 'Zoom in' : 'Zoom out');
    toggleData.setAttribute('aria-expanded', String(body.classList.contains('data-open')));
    toggleControls.setAttribute('aria-expanded', String(body.classList.contains('controls-open')));
  };

  var togglePanel = function (open, close) {
    toggleTwoClasses(body, open, close);
    syncState();
  };

  toggleData.addEventListener('click', function (e) {
    e.preventDefault();
    togglePanel('data-open', 'data-close');
  });

  toggleControls.addEventListener('click', function (e) {
    e.preventDefault();
    togglePanel('controls-open', 'controls-close');
  });

  // Delegated: one listener for all planet links.
  dataPanel.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link || !dataPanel.contains(link)) { return; }
    e.preventDefault();
    solarsys.className = link.className;
    dataLinks.forEach(function (l) {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
    link.classList.add('active');
    link.setAttribute('aria-current', 'true');
  });

  // Arrow keys move between planet links (Tab order is unchanged).
  dataPanel.addEventListener('keydown', function (e) {
    var step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    var i = dataLinks.indexOf(document.activeElement);
    if (!step || i < 0) { return; }
    e.preventDefault();
    dataLinks[(i + step + dataLinks.length) % dataLinks.length].focus();
  });

  // Delegated: view, zoom and scale controls.
  controlsPanel.addEventListener('click', function (e) {
    var label = e.target.closest('label');
    if (!label || e.target.tagName !== 'INPUT') { return; }

    if (label.classList.contains('set-view')) {
      toggleTwoClasses(body, 'view-3D', 'view-2D');
    } else if (label.classList.contains('set-zoom')) {
      toggleTwoClasses(body, 'zoom-large', 'zoom-close');
    } else {
      for (var key in scales) {
        if (e.target.classList.contains(key)) { universe.className = scales[key]; }
      }
    }
    syncState();
  });

  // Escape closes any open panel and returns focus to its toggle.
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') { return; }
    if (body.classList.contains('data-open')) {
      togglePanel('data-open', 'data-close');
      toggleData.focus();
    } else if (body.classList.contains('controls-open')) {
      togglePanel('controls-open', 'controls-close');
      toggleControls.focus();
    }
  });

  // Opening sequence (unchanged timing).
  body.classList.remove('view-2D', 'opening');
  body.classList.add('view-3D');
  syncState();
  window.setTimeout(function () {
    body.classList.remove('hide-UI');
    body.classList.add('set-speed');
  }, 2000);
});
