(function (window, document) {
  'use strict';

  var task4 = window.MCMTask4 = window.MCMTask4 || {};
  var ticketTypes = [
    { testId: 'ticket-type-adult', buttonTestId: 'adult-dropdown-button', listTestId: 'adult-dropdown-list', label: 'Adult' },
    { testId: 'ticket-type-children', buttonTestId: 'children-dropdown-button', listTestId: 'children-dropdown-list', label: 'Children' },
  ];

  function getAvailable(value) {
    var available = Number(value);
    return Number.isFinite(available) && available > 0 ? Math.floor(available) : 0;
  }

  task4.updateTicketTypes = function () {
    ticketTypes.forEach(function (type) {
      var container = document.querySelector('[data-testid="' + type.testId + '"]');
      if (!container) {
        return;
      }

      var available = getAvailable(container.getAttribute('data-available'));
      var button = container.querySelector('[data-testid="' + type.buttonTestId + '"]');
      var list = container.querySelector('[data-testid="' + type.listTestId + '"]');

      if (!button) {
        return;
      }

      if (available === 0) {
        button.disabled = true;
        button.setAttribute('aria-disabled', 'true');
        button.setAttribute('aria-label', type.label + ' tickets sold out');
        button.setAttribute('data-task4-soldout-type', 'true');
        button.textContent = 'Sold out';
        if (list) {
          list.remove();
        }
        return;
      }

      if (list) {
        Array.from(list.querySelectorAll('[role="option"]')).forEach(function (option, index) {
          if (index > available) {
            option.remove();
          }
        });
      }
    });
  };
})(window, document);
