(function (window, document) {
  'use strict';

  var task4 = window.MCMTask4 = window.MCMTask4 || {};

  task4.installNavigation = function (scheduleUpdate) {
    if (window.__mcmTask4NavigationInstalled) {
      return;
    }

    window.__mcmTask4NavigationInstalled = true;

    var observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, { childList: true, subtree: true });

    ['pushState', 'replaceState'].forEach(function (method) {
      var original = window.history[method];
      window.history[method] = function () {
        var result = original.apply(this, arguments);
        scheduleUpdate();
        return result;
      };
    });

    window.addEventListener('popstate', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
  };
})(window, document);
