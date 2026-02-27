import { disableActionTabs, getTabPanel, isSelected, tabControl, toggleTabDisplay } from '../../../../assets/scripts/datastores/partials/_actions.js';
import { expect } from 'chai';

describe('actions', function () {
  let firstTab = null;
  let firstTabPanel = null;
  let secondTab = null;
  let getAlert = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="tabs">
        <div role="tablist">
          <button type="button" role="tab" id="tab1" aria-selected="true" aria-controls="tabpanel1">
            Tab 1
          </button>
          <button type="button" role="tab" id="tab2" aria-selected="false" aria-controls="tabpanel2">
            Tab 2
          </button>
        </div>
        <div id="tabpanel1" role="tabpanel">
          <div class="alert alert__warning">This is a warning.</div>
        </div>
        <div id="tabpanel2" role="tabpanel">
          Tab Panel 2
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

    // Make sure the first tab is selected
    expect(firstTab().getAttribute('aria-selected'), 'Tab 1 should be selected.').to.equal('true');
  });

  afterEach(function () {
    firstTab = null;
    firstTabPanel = null;
    secondTab = null;
    getAlert = null;
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
    let getTabs = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML += `
        <ol class="list__items">
          <li><input type="checkbox" class="record__checkbox" value="rec1" checked></li>
          <li><input type="checkbox" class="record__checkbox" value="rec2"></li>
          <li><input type="checkbox" class="record__checkbox" value="rec3"></li>
          <li><input type="checkbox" class="record__checkbox" value="rec4"></li>
          <li><input type="checkbox" class="record__checkbox" value="rec5"></li>
        </ol>
      `;

      getTabs = () => {
        return document.querySelectorAll('.actions__tablist button[role="tab"]');
      };
    });

    it('should disable all action tabs if no checkboxes are checked', function () {
      // Call the function
      disableActionTabs({ someChecked: false });

      // Check that all tabs are disabled
      getTabs().forEach((tab) => {
        expect(tab.disabled, 'all tabs should be disabled if no checkboxes are checked').to.be.true;
      });
    });

    it('should enable all action tabs if at least one checkbox is checked', function () {
      // Call the function
      disableActionTabs({ someChecked: true });

      // Check that all tabs are enabled
      getTabs().forEach((tab) => {
        expect(tab.disabled, 'all tabs should be enabled if at least one checkbox is checked').to.be.false;
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
});
