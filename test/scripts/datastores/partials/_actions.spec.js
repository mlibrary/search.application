import { disableActionTabs, getTabPanel, initializeActions, isSelected, tabControl, toggleTabDisplay } from '../../../../assets/scripts/datastores/partials/_actions.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('actions', function () {
  let firstTab = null;
  let firstTabPanel = null;
  let secondTab = null;
  let getTabs = null;
  let getAlert = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
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
    `;

    firstTab = () => {
      return document.querySelector('[aria-controls="tabpanel1"]');
    };

    firstTabPanel = () => {
      return document.querySelector('#tabpanel1');
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
    firstTab = null;
    firstTabPanel = null;
    secondTab = null;
    getAlert = null;
    getTabs = null;
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

  describe('toggleTabDisplay()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        id: 'tab1',
        show: true
      };

      // Call the function
      toggleTabDisplay(args);
    });

    it('should show the tab and its panel', function () {
      // Check that `args.show` is `true`
      expect(args.show, '`args.show` should be `true` for this test').to.be.true;

      // Check that the tab and its panel are displayed
      expect(firstTab().style.display, 'the tab should be displayed').to.equal('flex');
      expect(firstTabPanel().style.display, 'the tab panel should be displayed').to.equal('block');
    });

    it('should hide the tab and its panel', function () {
      // Update args to hide the tab and its panel
      args.show = false;
      expect(args.show, '`args.show` should be `false` for this test').to.be.false;

      // Call the function again
      toggleTabDisplay(args);

      // Check that the tab and its panel are not displayed
      expect(firstTab().style.display, 'the tab should not be displayed').to.equal('none');
      expect(firstTabPanel().style.display, 'the tab panel should not be displayed').to.equal('none');
    });
  });

  describe('initializeActions()', function () {
    let addSelectedSpy = null;
    let initializeCitationsSpy = null;
    let emailActionSpy = null;
    let copyLinkSpy = null;
    let removeSelectedSpy = null;
    let downloadTemporaryListRISSpy = null;
    let tabControlSpy = null;
    let textActionSpy = null;
    let args = null;

    beforeEach(function () {
      addSelectedSpy = sinon.spy();
      initializeCitationsSpy = sinon.spy();
      emailActionSpy = sinon.spy();
      copyLinkSpy = sinon.spy();
      removeSelectedSpy = sinon.spy();
      downloadTemporaryListRISSpy = sinon.spy();
      tabControlSpy = sinon.spy();
      textActionSpy = sinon.spy();
      args = {
        addToList: addSelectedSpy,
        citations: initializeCitationsSpy,
        email: emailActionSpy,
        link: copyLinkSpy,
        list: global.temporaryList,
        removeFromList: removeSelectedSpy,
        ris: downloadTemporaryListRISSpy,
        tabControlFunction: tabControlSpy,
        text: textActionSpy
      };

      // Call the function
      initializeActions(args);
    });

    afterEach(function () {
      addSelectedSpy = null;
      initializeCitationsSpy = null;
      emailActionSpy = null;
      copyLinkSpy = null;
      removeSelectedSpy = null;
      downloadTemporaryListRISSpy = null;
      tabControlSpy = null;
      textActionSpy = null;
      args = null;
    });

    it('should call `tabControl` with the correct arguments', function () {
      expect(tabControlSpy.calledOnceWithExactly('.actions'), '`tabControlFunction` should have been called with the correct arguments').to.be.true;
    });

    it('should call `emailAction`', function () {
      expect(emailActionSpy.calledOnce, '`emailAction` should have been called').to.be.true;
    });

    it('should call `textAction`', function () {
      expect(textActionSpy.calledOnce, '`textAction` should have been called').to.be.true;
    });

    it('should call `initializeCitations`', function () {
      expect(initializeCitationsSpy.calledOnce, '`initializeCitations` should have been called').to.be.true;
    });

    it('should call `downloadTemporaryListRIS` with the correct arguments', function () {
      expect(downloadTemporaryListRISSpy.calledOnceWithExactly({ list: args.list }), '`downloadTemporaryListRIS` should have been called with the correct arguments').to.be.true;
    });

    it('should call `copyLink`', function () {
      expect(copyLinkSpy.calledOnce, '`copyLink` should have been called').to.be.true;
    });

    it('should call `addToList` with the correct arguments', function () {
      expect(addSelectedSpy.calledOnceWithExactly({ list: args.list }), '`addToList` should have been called with the correct arguments').to.be.true;
    });

    it('should call `removeFromList` with the correct arguments', function () {
      expect(removeSelectedSpy.calledOnceWithExactly({ list: args.list }), '`removeFromList` should have been called with the correct arguments').to.be.true;
    });
  });
});
