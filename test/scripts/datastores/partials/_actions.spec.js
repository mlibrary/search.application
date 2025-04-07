import { actionsPlacement, changeAlert, shareForm, tabControl } from '../../../../assets/scripts/datastores/partials/_actions.js';
import { expect } from 'chai';
import sinon from 'sinon';

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

    it('should change the type from `warning` to `success`', async function () {
      expect([...getAlert().classList], '`alert__warning` should be a class').to.include('alert__warning');
      expect([...getAlert().classList], '`alert__success` should not be a class').to.not.include('alert__success');

      // Call the function to apply the event listener
      const response = Response.json({}, { status: 200 });
      await changeAlert({ element: alert.element, response });

      expect([...getAlert().classList], '`alert__warning` should not be a class').to.not.include('alert__warning');
      expect([...getAlert().classList], '`alert__success` should be a class').to.include('alert__success');
    });

    it('should change the type from `warning` to `error`', async function () {
      expect([...getAlert().classList], '`alert__warning` should be a class').to.include('alert__warning');
      expect([...getAlert().classList], '`alert__error` should not be a class').to.not.include('alert__error');

      // Call the function to apply the event listener
      const response = Response.json({}, { status: 500 });
      await changeAlert({ element: alert.element, response });

      expect([...getAlert().classList], '`alert__warning` should not be a class').to.not.include('alert__warning');
      expect([...getAlert().classList], '`alert__error` should be a class').to.include('alert__error');
    });

    it('should change the message', async function () {
      expect(getAlert().textContent).to.not.equal(alert.message);

      // Call the function to apply the event listener
      const response = Response.json({ message: alert.message }, { status: 200 });
      await changeAlert({ element: alert.element, response });

      expect(getAlert().textContent).to.equal(alert.message);
    });

    it('should show the alert', async function () {
      expect(getAlert().style.display).to.equal('');

      // Call the function to apply the event listener
      const response = Response.json({ message: alert.message }, { status: 200 });
      await changeAlert({ element: alert.element, response });

      expect(getAlert().style.display).to.equal('block');
    });
  });

  describe('shareForm()', function () {
    let getForm = null;
    let getAlert = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div id="actions__record--tabpanel">
          <div class="alert alert__warning actions__alert">
            We're sorry. Something went wrong. Please use Ask a Librarian for help.
          </div>
          <form class="action__record--form" action="/submit" method="post">
            <input type="email" id="record" name="record" required>
            <button type="submit">Send Record</button>
          </form>
        </div>
      `;

      getForm = () => {
        return document.querySelector('.action__record--form');
      };

      getAlert = () => {
        return document.querySelector('.alert');
      };
    });

    afterEach(function () {
      getForm = null;
      getAlert = null;

      // Remove the HTML of the body
      document.body.innerHTML = '';
    });

    it('should prevent the default form submission and call shareForm', async function () {
      const response = Response.json({ message: 'Record sent successfully.' }, { status: 200 });

      const fetchFormFake = sinon.fake.resolves(response);
      shareForm('#actions__record--tabpanel', fetchFormFake);

      // Simulate form submission
      const submitEvent = new window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      getForm().dispatchEvent(submitEvent);
      // Wait until the async calls resolve
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      expect(getAlert().textContent).to.include('Record sent successfully.');
    });

    it('should show an error on submission', async function () {
      const response = Response.json({ message: 'Please enter a valid email address (e.g. uniqname@umich.edu)' }, { status: 500 });

      const fetchFormFake = sinon.fake.returns(response);
      shareForm('#actions__record--tabpanel', fetchFormFake);

      // Simulate form submission
      const submitEvent = new window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      getForm().dispatchEvent(submitEvent);
      // Wait until the async calls resolve
      await new Promise((resolve) => {
        setTimeout(resolve, 10);
      });

      expect(getAlert().textContent).to.include('Please enter a valid email address (e.g. uniqname@umich.edu)');
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
