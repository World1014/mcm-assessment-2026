(function (window, document) {
  'use strict';

  var task4 = window.MCMTask4 = window.MCMTask4 || {};

  task4.updateShowtimeRows = function () {
    var rows = document.querySelectorAll('[data-testid="showtime-row"]');

    rows.forEach(function (row) {
      var adultAvailable = Number(row.getAttribute('data-adult-available'));
      var childrenAvailable = Number(row.getAttribute('data-children-available'));
      var button = row.querySelector('[data-testid="showtime-cta"]');
      var isSoldOut = Number.isFinite(adultAvailable) && Number.isFinite(childrenAvailable)
        && adultAvailable <= 0 && childrenAvailable <= 0;

      if (!button) {
        return;
      }

      if (isSoldOut) {
        if (button.getAttribute('data-task4-sold-out') !== 'true') {
          button.setAttribute('data-task4-original-html', button.innerHTML);
          button.setAttribute('data-task4-original-label', button.getAttribute('aria-label') || '');
        }
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('aria-label', 'Sold out');
        button.setAttribute('data-task4-sold-out', 'true');
        button.textContent = 'Sold out';
      } else if (button.getAttribute('data-task4-sold-out') === 'true') {
        button.disabled = false;
        button.removeAttribute('aria-disabled');
        button.innerHTML = button.getAttribute('data-task4-original-html') || 'Buy';
        var originalLabel = button.getAttribute('data-task4-original-label');
        if (originalLabel) {
          button.setAttribute('aria-label', originalLabel);
        } else {
          button.removeAttribute('aria-label');
        }
        button.removeAttribute('data-task4-sold-out');
        button.removeAttribute('data-task4-original-html');
        button.removeAttribute('data-task4-original-label');
      }
    });
  };
})(window, document);
