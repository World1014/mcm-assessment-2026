(function (window, document) {
  'use strict';

  var styleId = 'mcm-task-4-styles';
  var modulePaths = [
    '/gtm/task-4-showtimes.js',
    '/gtm/task-4-ticket-types.js',
    '/gtm/task-4-navigation.js',
  ];
  var scheduled = false;

  function addStyles() {
    if (document.getElementById(styleId)) {
      return;
    }

    var style = document.createElement('style');
    style.id = styleId;
    style.textContent = [
      '[data-task4-sold-out="true"] {',
      '  background: #dedede !important;',
      '  color: #777 !important;',
      '  cursor: not-allowed !important;',
      '}',
      '[data-task4-soldout-type="true"] {',
      '  border-color: #bdb7ae !important;',
      '  background: #f0eeeb !important;',
      '  color: #716b63 !important;',
      '  cursor: not-allowed !important;',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  function applyAvailabilityChanges() {
    scheduled = false;
    addStyles();
    window.MCMTask4.updateShowtimeRows();
    window.MCMTask4.updateTicketTypes();
  }

  function scheduleUpdate() {
    if (scheduled) {
      return;
    }

    scheduled = true;
    window.requestAnimationFrame(applyAvailabilityChanges);
  }

  function loadModule(path, onLoad, onError) {
    var script = document.createElement('script');
    script.src = path;
    script.async = false;
    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);
  }

  function loadModules(index, onError) {
    if (index === modulePaths.length) {
      window.__mcmTask4Loading = false;
      window.__mcmTask4Installed = true;
      window.MCMTask4.installNavigation(scheduleUpdate);
      scheduleUpdate();
      return;
    }

    loadModule(
      modulePaths[index],
      function () { loadModules(index + 1, onError); },
      onError
    );
  }

  function install() {
    if (window.__mcmTask4Loading || window.__mcmTask4Installed) {
      return;
    }

    window.__mcmTask4Loading = true;
    window.MCMTask4 = window.MCMTask4 || {};
    loadModules(0, function () {
      window.__mcmTask4Loading = false;
    });
  }

  if (document.body) {
    install();
  } else {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  }
})(window, document);
