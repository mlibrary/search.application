import { changeAlert, copyToClipboard, disableActionTabs, getTabPanel, isSelected, shareForm, tabControl } from '../../../../assets/scripts/datastores/partials/_actions.js';
import { getCheckboxes, someCheckboxesChecked } from '../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { viewingTemporaryList } from '../../../../assets/scripts/datastores/list/layout.js';

describe('actions', function () {
  let firstTab = null;
  let secondTab = null;
  let getAlert = null;
  let getForm = null;

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
          <div class="alert alert__warning">This is a warning.</div>
          <form class="action__record--form" action="/submit" method="post">
            <input type="email" id="record" name="record" required>
            <button type="submit">Send Record</button>
          </form>
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

    getForm = () => {
      return document.querySelector('form');
    };

    // Make sure the first tab is selected
    expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should be selected.').to.equal('true');
  });

  afterEach(function () {
    firstTab = null;
    secondTab = null;
    getAlert = null;
    getForm = null;
  });

  describe('isSelected()', function () {
    it('should return `true`', function () {
      expect(isSelected(firstTab()), 'the first tab should be selected').to.be.true;
    });

    it('should return `false`', function () {
      expect(isSelected(secondTab()), 'the second tab should not be selected').to.be.false;
    });
  });

  describe('getTabPanel()', function () {
    it('should return the appropriate `tabpanel`', function () {
      const tab = firstTab();
      expect(getTabPanel({ tab, tabContainer: document.querySelector('.tabs') }), 'the appropriate `tabpanel` should have been returned').to.equal(document.querySelector(`#${tab.getAttribute('aria-controls')}`));
    });
  });

  describe('tabControl()', function () {
    beforeEach(function () {
      // Call the function
      tabControl('.tabs');
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
      getAlert().style.display = 'block';
      expect(getAlert().style.display, 'The alert in Tab 1 should be displaying.').to.equal('block');

      // Switch to the second tab
      secondTab().click();
      // Switch back to the first tab
      firstTab().click();

      // Make sure the alert is no longer displaying
      expect(getAlert().style.display, 'The alert in Tab 1 should no longer be displaying.').to.equal('none');
    });
  });

  describe('disableActionTabs()', function () {
    let getTabs = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML += `
        <ol class="list__items">
          <li><input type="checkbox" class="list__item--checkbox" value="rec1" checked></li>
          <li><input type="checkbox" class="list__item--checkbox" value="rec2"></li>
          <li><input type="checkbox" class="list__item--checkbox" value="rec3"></li>
          <li><input type="checkbox" class="list__item--checkbox" value="rec4"></li>
          <li><input type="checkbox" class="list__item--checkbox" value="rec5"></li>
        </ol>
      `;

      getTabs = () => {
        return document.querySelectorAll('.actions__tablist button[role="tab"]');
      };
    });

    describe('when not viewing the temporary list', function () {
      beforeEach(function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Call the function
        disableActionTabs();
      });

      it('should not return anything', function () {
        expect(disableActionTabs()).to.be.undefined;
      });
    });

    describe('when viewing the temporary list', function () {
      let originalWindow = null;

      beforeEach(function () {
        // Save the original window object
        originalWindow = global.window;

        // Setup JSDOM with an updated URL
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
          url: 'http://localhost/everything/list'
        });

        // Override the global window object
        global.window = dom.window;

        // Check that Temporary List is being viewed
        expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;
      });

      afterEach(function () {
        // Restore the original window object
        global.window = originalWindow;
      });

      it('should disable all action tabs if no checkboxes are checked', function () {
        // Ensure no checkboxes are checked
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Call the function
        disableActionTabs();

        // Check that all tabs are disabled
        getTabs().forEach((tab) => {
          expect(tab.disabled, 'all tabs should be disabled if no checkboxes are checked').to.be.true;
        });
      });

      it('should enable all action tabs if at least one checkbox is checked', function () {
        // Ensure at least one checkbox is checked
        expect(someCheckboxesChecked(true), 'at least one checkbox should be checked for this test').to.be.true;

        // Call the function
        disableActionTabs();

        // Check that all tabs are enabled
        getTabs().forEach((tab) => {
          expect(tab.disabled, 'all tabs should be enabled if at least one checkbox is checked').to.be.false;
        });
      });
    });
  });

  describe('fetchFormResults()', function () {
    //
  });

  describe('changeAlert()', function () {
    const alert = { element: '.alert__warning', message: 'This is a message.' };

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

  describe('copyToClipboard()', function () {
    let getText = null;
    let clipboardSpy = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <div class="alert" style="display: none;">This is an alert.</div>
        <div class="copy-this">The text has been successfully copied.</div>
      `;

      getText = () => {
        return document.querySelector('.copy-this').innerHTML;
      };

      clipboardSpy = sinon.spy();
      Object.defineProperty(window.navigator, 'clipboard', {
        configurable: true,
        value: { writeText: clipboardSpy }
      });
      Object.defineProperty(global, 'navigator', {
        configurable: true,
        value: window.navigator
      });
    });

    afterEach(function () {
      getText = null;

      // Clean up
      delete global.navigator;
    });

    it('should show the alert', function () {
      expect(getAlert().style.display, 'alert should not be displayed').to.equal('none');

      // Call the function
      copyToClipboard({ alert: getAlert(), text: getText() });

      expect(getAlert().style.display, 'alert should be displayed').to.equal('block');
    });

    it('should copy the text', function () {
      // Call the function
      copyToClipboard({ alert: getAlert(), text: getText() });

      // Check that the clipboard should have been called with the correct value
      expect(clipboardSpy.calledOnce, 'should be called once').to.be.true;
      expect(clipboardSpy.calledWith(getText()), `should be called with ${getText()}`).to.be.true;
    });
  });
});
