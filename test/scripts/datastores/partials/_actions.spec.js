import { actionsPlacement, changeAlert, tabControl } from '../../../../assets/scripts/datastores/partials/_actions.js';
import { expect } from 'chai';

describe('actions', function () {
  describe('actionsPlacement()', function () {
    let getActions = null;
    let getActionsDesktop = null;
    let getActionsMobile = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div class="record">
          <div class="actions__desktop"></div>
          <div class="actions"></div>
          <div class="actions__mobile"></div>
        </div>
      `;

      getActions = () => {
        return document.querySelector('.actions');
      };

      getActionsDesktop = () => {
        return document.querySelector('.actions__desktop');
      };

      getActionsMobile = () => {
        return document.querySelector('.actions__mobile');
      };
    });

    afterEach(function () {
      getActions = null;
      getActionsDesktop = null;
      getActionsMobile = null;

      // Remove the HTML of the body
      document.body.innerHTML = '';
    });

    it('should places `.actions` inside `.actions__desktop`', function () {
      expect(window.innerWidth, '`window.innerWidth should be greater than 820').to.be.at.least(820);
      expect(getActionsDesktop().innerHTML, '`.actions__desktop` should be empty').to.be.empty;
      expect(getActionsMobile().innerHTML, '`.actions__mobile` should be empty').to.be.empty;

      // Call the function to apply the event listener
      actionsPlacement();

      expect(getActionsDesktop().innerHTML, '`.actions__desktop` should contain `.actions`').to.equal(getActions().outerHTML);
      expect(getActionsMobile().innerHTML, '`.actions__mobile` should still be empty').to.be.empty;
    });

    it('should places `.actions` inside `.actions__mobile`', function () {
      window.innerWidth = 640;
      expect(window.innerWidth, '`window.innerWidth should be less than or equal to 820').to.be.below(821);
      expect(getActionsDesktop().innerHTML, '`.actions__desktop` should be empty').to.be.empty;
      expect(getActionsMobile().innerHTML, '`.actions__mobile` should be empty').to.be.empty;

      // Call the function to apply the event listener
      actionsPlacement();

      expect(getActionsDesktop().innerHTML, '`.actions__desktop` should still be empty').to.be.empty;
      expect(getActionsMobile().innerHTML, '`.actions__mobile` should contain `.actions`').to.equal(getActions().outerHTML);
    });
  });

  describe('changeAlert()', function () {
    let getAlert = null;
    const alert = { element: '.alert__warning', message: 'This is a message.' };

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = '<div class="alert__warning">This is a warning.</div>';

      getAlert = () => {
        return document.querySelector('[class^="alert__"]');
      };
    });

    afterEach(function () {
      getAlert = null;

      // Remove the HTML of the body
      document.body.innerHTML = '';
    });

    it('should change the type from `warning` to `success`', function () {
      expect([...getAlert().classList], '`alert__warning` should be a class').to.include('alert__warning');
      expect([...getAlert().classList], '`alert__success` should not be a class').to.not.include('alert__success');

      // Call the function to apply the event listener
      changeAlert(alert);

      expect([...getAlert().classList], '`alert__warning` should not be a class').to.not.include('alert__warning');
      expect([...getAlert().classList], '`alert__success` should be a class').to.include('alert__success');
    });

    it('should change the type from `warning` to `error`', function () {
      expect([...getAlert().classList], '`alert__warning` should be a class').to.include('alert__warning');
      expect([...getAlert().classList], '`alert__error` should not be a class').to.not.include('alert__error');

      // Call the function to apply the event listener
      alert.type = 'error';
      changeAlert(alert);

      expect([...getAlert().classList], '`alert__warning` should not be a class').to.not.include('alert__warning');
      expect([...getAlert().classList], '`alert__error` should be a class').to.include('alert__error');
    });

    it('should change the message', function () {
      expect(getAlert().textContent).to.not.equal(alert.message);

      // Call the function to apply the event listener
      changeAlert(alert);

      expect(getAlert().textContent).to.equal(alert.message);
    });

    it('should show the alert', function () {
      expect(getAlert().style.display).to.equal('');

      // Call the function to apply the event listener
      changeAlert(alert);

      expect(getAlert().style.display).to.equal('block');
    });
  });

  describe('tabControl()', function () {
    let firstTab = null;
    let secondTab = null;
    let getAlert = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div class="tabs">
          <div role="tablist">
            <button type="button" role="tab" aria-selected="true" aria-controls="tabpanel1">
              Tab 1
            </button>
            <button type="button" role="tab" aria-selected="false" aria-controls="tabpanel2">
              Tab 2
            </button>
          </div>
          <div id="tabpanel1" role="tabpanel">
            <div class="alert" style="display: block;"></div>
            Tab Panel 1
          </div>
          <div id="tabpanel2" role="tabpanel">
            Tab Panel 2
          </div>
        </div>
      `;

      firstTab = () => {
        return document.querySelector('[aria-controls="tabpanel1"]');
      };

      secondTab = () => {
        return document.querySelector('[aria-controls="tabpanel2"]');
      };

      getAlert = () => {
        return document.querySelector('.alert');
      };

      // Call the function to apply the event listener
      tabControl('.tabs');

      // Make sure the first tab is selected
      expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should be selected.').to.equal('true');
    });

    afterEach(function () {
      firstTab = null;
      secondTab = null;
      getAlert = null;

      // Remove the HTML of the body
      document.body.innerHTML = '';
    });

    it('should hide all other tab panels on click', function () {
      // Make sure the second tab is not selected
      expect(secondTab().getAttribute('aria-selected'), 'Tab 2 should not be selected.').to.equal('false');

      // Click the second tab
      secondTab().click();

      // Make sure the second tab is selected, and not the first
      expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should not be selected after click.').to.equal('false');
      expect(secondTab().getAttribute('aria-selected'), 'Tab 2 should be selected after click.').to.equal('true');
    });

    it('should hide the opened tab panel on click', function () {
      // Click the first tab
      firstTab().click();

      // Make sure the first tab is no longer selected
      expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should not be selected after click.').to.equal('false');
      // Make sure no other tabs are selected
      expect(secondTab().getAttribute('aria-selected'), 'Tab 2 should not be selected after click.').to.equal('false');
    });

    it('should hide the alert when switching tab panels', function () {
      // Make sure the alert is displaying
      expect(getAlert().style.display, 'The alert in Tab 1 should be displaying.').to.equal('block');

      // Switch to the second tab
      secondTab().click();
      // Switch back to the first tab
      firstTab().click();

      // Make sure the alert is no longer displaying
      expect(getAlert().style.display, 'The alert in Tab 1 should no longer be displaying.').to.equal('none');
    });
  });
});
