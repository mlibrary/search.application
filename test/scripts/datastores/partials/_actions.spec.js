import {
  disableActionTabs,
  getActionsPanel,
  getTabPanel,
  initializeActions,
  isSelected,
  tabControl,
  toggleActionsPanel
} from '../../../../assets/scripts/datastores/partials/_actions.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('actions', function () {
  let getDetails = null;
  let firstTab = null;
  let secondTab = null;
  let getTabs = null;
  let getAlert = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <details class="actions">
        <summary>Actions Panel</summary>
        <div class="tabs">
          <div class="actions__tablist" role="tablist">
            <button type="button" role="tab" id="tab1" aria-selected="true" aria-controls="tabpanel1">
              Tab 1
            </button>
            <button type="button" role="tab" id="tab2" aria-selected="false" aria-controls="tabpanel2">
              Tab 2
            </button>
            <button type="button" role="tab" id="actions__link" aria-selected="false" aria-controls="actions__link--tabpanel">
              Copy link
            </button>
          </div>
          <div id="tabpanel1" role="tabpanel">
            <div class="alert alert__warning">This is a warning.</div>
          </div>
          <div id="tabpanel2" role="tabpanel">
            Tab Panel 2
          </div>
          <div id="actions__link--tabpanel" role="tabpanel">
            Copy link tab panel
          </div>
        </div>
      </details>
    `;

    getDetails = () => {
      return document.querySelector('details');
    };

    firstTab = () => {
      return document.querySelector('[aria-controls="tabpanel1"]');
    };

    secondTab = () => {
      return document.querySelector('[aria-controls="tabpanel2"]');
    };

    getAlert = () => {
      return document.querySelector('.alert');
    };

    getTabs = () => {
      return document.querySelectorAll('button[role="tab"]');
    };

    // Make sure the first tab is selected
    expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should be selected.').to.equal('true');
  });

  afterEach(function () {
    getDetails = null;
    firstTab = null;
    secondTab = null;
    getAlert = null;
    getTabs = null;
  });

  describe('getActionsPanel()', function () {
    it('should return the actions panel element', function () {
      expect(getActionsPanel(), 'the actions panel should have been returned').to.equal(getDetails());
    });
  });

  describe('toggleActionsPanel()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        actionsPanel: getDetails()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should open the actions panel if some checkboxes are checked', function () {
      // Call the function
      toggleActionsPanel({ ...args, someChecked: true });

      // Make sure the actions panel is now open
      expect(getDetails().hasAttribute('open'), 'the actions panel should be open').to.be.true;
    });

    it('should close the actions panel if no checkboxes are checked', function () {
      // Call the function
      toggleActionsPanel({ ...args, someChecked: false });

      // Make sure the actions panel is now closed
      expect(getDetails().hasAttribute('open'), 'the actions panel should be closed').to.be.false;
    });
  });

  describe('isSelected()', function () {
    it('should return `true`', function () {
      expect(isSelected({ tab: firstTab() }), 'the first tab should be selected').to.be.true;
    });

    it('should return `false`', function () {
      expect(isSelected({ tab: secondTab() }), 'the second tab should not be selected').to.be.false;
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
    it('should disable all but the `Copy link` action tabs if no checkboxes are checked', function () {
      // Call the function
      disableActionTabs({ someChecked: false });

      // Loop through all tabs
      getTabs().forEach((tab) => {
        if (tab.getAttribute('id') === 'actions__link') {
          // Check that the `Copy link` tab is not disabled
          expect(tab.hasAttribute('disabled'), 'the `Copy link` tab should not be disabled if no checkboxes are checked').to.be.false;
        } else {
          // Check that all other tabs are disabled
          expect(tab.hasAttribute('disabled'), `\`#${tab.getAttribute('id')}\` should be disabled if no checkboxes are checked`).to.be.true;
        }
      });
    });

    it('should enable all action tabs if at least one checkbox is checked', function () {
      // Call the function
      disableActionTabs({ someChecked: true });

      // Loop through all tabs
      getTabs().forEach((tab) => {
        // Check that all tabs are not disabled
        expect(tab.hasAttribute('disabled'), 'all tabs should be enabled if at least one checkbox is checked').to.be.false;
      });
    });
  });

  describe('initializeActions()', function () {
    let actionsPanelTextSpy = null;
    let initializeCitationsSpy = null;
    let emailActionSpy = null;
    let copyLinkSpy = null;
    let initializeRISSpy = null;
    let tabControlSpy = null;
    let textActionSpy = null;
    let toggleSelectedSpy = null;
    let args = null;

    beforeEach(function () {
      actionsPanelTextSpy = sinon.spy();
      initializeCitationsSpy = sinon.spy();
      emailActionSpy = sinon.spy();
      copyLinkSpy = sinon.spy();
      initializeRISSpy = sinon.spy();
      tabControlSpy = sinon.spy();
      textActionSpy = sinon.spy();
      toggleSelectedSpy = sinon.spy();
      args = {
        actionsText: actionsPanelTextSpy,
        citations: initializeCitationsSpy,
        email: emailActionSpy,
        link: copyLinkSpy,
        list: global.temporaryList,
        ris: initializeRISSpy,
        tabControlFunction: tabControlSpy,
        text: textActionSpy,
        toggleSelected: toggleSelectedSpy
      };

      // Call the function
      initializeActions(args);
    });

    afterEach(function () {
      actionsPanelTextSpy = null;
      initializeCitationsSpy = null;
      emailActionSpy = null;
      copyLinkSpy = null;
      initializeRISSpy = null;
      tabControlSpy = null;
      textActionSpy = null;
      toggleSelectedSpy = null;
      args = null;
    });

    it('should call `tabControl` with the correct arguments', function () {
      expect(tabControlSpy.calledOnceWithExactly('.actions'), '`tabControlFunction` should have been called with the correct arguments').to.be.true;
    });

    it('should call `copyLink` with the correct arguments', function () {
      expect(copyLinkSpy.calledOnceWithExactly(), '`copyLink` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleSelected` with the correct arguments', function () {
      expect(toggleSelectedSpy.calledOnceWithExactly({ list: args.list }), '`toggleSelected` should have been called with the correct arguments').to.be.true;
    });

    it('should call `emailAction` with the correct arguments', function () {
      expect(emailActionSpy.calledOnceWithExactly(), '`emailAction` should have been called with the correct arguments').to.be.true;
    });

    it('should call `textAction` with the correct arguments', function () {
      expect(textActionSpy.calledOnceWithExactly(), '`textAction` should have been called with the correct arguments').to.be.true;
    });

    it('should call `initializeCitations` with the correct arguments', function () {
      expect(initializeCitationsSpy.calledOnceWithExactly({ list: args.list }), '`initializeCitations` should have been called with the correct arguments').to.be.true;
    });

    it('should call `initializeRIS` with the correct arguments', function () {
      expect(initializeRISSpy.calledOnceWithExactly({ list: args.list }), '`initializeRIS` should have been called with the correct arguments').to.be.true;
    });

    it('should call `actionsPanelText` with the correct arguments', function () {
      expect(actionsPanelTextSpy.calledOnceWithExactly(), '`actionsPanelText` should have been called with the correct arguments').to.be.true;
    });
  });
});
