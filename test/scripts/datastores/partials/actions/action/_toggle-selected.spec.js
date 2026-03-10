import {
  getToggleSelectedTab,
  getToggleSelectedTabPanel,
  toggleActionClasses,
  toggleSelectedAction,
  updateToggleSelectedTabText
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_toggle-selected.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('toggle selected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="actions">
        <div role="tablist" class="actions__tablist">
          <button type="button" role="tab" id="actions__toggle-selected" aria-selected="false" aria-controls="actions__toggle-selected--tabpanel">
            <span class="actions__toggle-selected--text actions__toggle-selected--text-add">Add&nbsp;selected</span>
            <span class="actions__toggle-selected--text actions__toggle-selected--text-remove">Remove&nbsp;selected</span>
          </button>
        </div>
        <div id="actions__toggle-selected--tabpanel" role="tabpanel" aria-labelledby="actions__toggle-selected" style="display: none;">
          <button class="action__add-selected">Add to My Temporary List</button>
          <button class="action__remove-selected">Remove from My Temporary List</button>
        </div>
      </div>
    `;
  });

  describe('getToggleSelectedTab()', function () {
    it('should return the toggle selected tab element', function () {
      expect(getToggleSelectedTab(), 'The toggle selected tab element should have been returned').to.deep.equal(document.getElementById('actions__toggle-selected'));
    });
  });

  describe('getToggleSelectedTabPanel()', function () {
    it('should return the toggle selected tab panel element', function () {
      expect(getToggleSelectedTabPanel(), 'The toggle selected tab panel element should have been returned').to.deep.equal(document.getElementById('actions__toggle-selected--tabpanel'));
    });
  });

  describe('updateToggleSelectedTabText()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        fullRecord: true,
        tab: getToggleSelectedTab()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should replaced `selected` with `record` when viewing a full record', function () {
      // Call the function
      updateToggleSelectedTabText(args);

      // Assert that the text has been updated
      const textElements = args.tab.querySelectorAll('.actions__toggle-selected--text');
      textElements.forEach((textElement) => {
        expect(textElement.textContent, 'The tab text should have been updated').to.match(/Add\srecord|Remove\srecord/u);
      });
    });

    it('should not update the tab text if not viewing a full record', function () {
      // Call the function
      updateToggleSelectedTabText({ ...args, fullRecord: false });

      // Assert that the text has not been updated
      const textElements = args.tab.querySelectorAll('.actions__toggle-selected--text');
      textElements.forEach((textElement) => {
        expect(textElement.textContent, 'The tab text should not have been updated').to.match(/Add\sselected|Remove\sselected/u);
      });
    });
  });

  describe('toggleActionClasses()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        inList: true,
        tab: getToggleSelectedTab(),
        tabPanel: getToggleSelectedTabPanel()
      };
    });

    afterEach(function () {
      args = null;
    });

    describe('when `inList` is `true`', function () {
      beforeEach(function () {
        // Call the function
        toggleActionClasses(args);
      });

      it('should add the appropriate class to the tab', function () {
        expect(args.tab.classList.contains('actions__toggle-selected--remove'), 'Tab should have the `actions__toggle-selected--remove` class').to.be.true;
      });

      it('should add the appropriate class to the tab panel', function () {
        expect(args.tabPanel.classList.contains('actions__toggle-selected--tabpanel-remove'), 'Tab panel should have the `actions__toggle-selected--tabpanel-remove` class').to.be.true;
      });
    });

    describe('when `inList` is `false`', function () {
      beforeEach(function () {
        // Call the function
        toggleActionClasses({ ...args, inList: false });
      });

      it('should not add the appropriate class to the tab', function () {
        expect(args.tab.classList.contains('actions__toggle-selected--remove'), 'Tab should not have the `actions__toggle-selected--remove` class').to.be.false;
      });

      it('should not add the appropriate class to the tab panel', function () {
        expect(args.tabPanel.classList.contains('actions__toggle-selected--tabpanel-remove'), 'Tab panel should not have the `actions__toggle-selected--tabpanel-remove` class').to.be.false;
      });
    });
  });

  describe('toggleSelectedAction()', function () {
    let toggleActionClassesSpy = null;
    let updateToggleSelectedTabTextSpy = null;
    let args = null;

    beforeEach(function () {
      toggleActionClassesSpy = sinon.spy();
      updateToggleSelectedTabTextSpy = sinon.spy();
      args = {
        list: [],
        toggleClasses: toggleActionClassesSpy,
        updateText: updateToggleSelectedTabTextSpy
      };

      // Call the function
      toggleSelectedAction(args);
    });

    afterEach(function () {
      toggleActionClassesSpy = null;
      updateToggleSelectedTabTextSpy = null;
      args = null;
    });

    it('should call `updateToggleSelectedTabText`', function () {
      expect(updateToggleSelectedTabTextSpy.calledOnce, '`updateToggleSelectedTabText` should have been called once').to.be.true;
    });

    it('should call `toggleActionClasses` with the correct arguments', function () {
      expect(toggleActionClassesSpy.calledOnceWithExactly({ inList: true }), '`toggleActionClasses` should have been called with the correct arguments').to.be.true;
    });
  });
});
