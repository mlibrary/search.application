import {
  checkIfInList,
  getToggleSelectedTab,
  getToggleSelectedTabPanel,
  toggleActionClasses,
  toggleSelectedAction,
  toggleSelectedButton,
  updateToggleSelectedAction,
  updateToggleSelectedTabText
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_toggle-selected.js';
import { getDatastores, inTemporaryList } from '../../../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import sinon from 'sinon';
import { splitCheckboxValue } from '../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_checkbox.js';

describe('toggle selected', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="actions">
        <div role="tablist" class="actions__tablist">
          <button type="button" role="tab" id="actions__toggle-selected" aria-selected="false" aria-controls="actions__toggle-selected--tabpanel">
            Toggle&nbsp;selected
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

  describe('checkIfInList()', function () {
    let splitCheckboxValueStub = null;
    let inTemporaryListStub = null;
    let args = null;

    beforeEach(function () {
      splitCheckboxValueStub = sinon.stub().callsFake(({ value }) => {
        return splitCheckboxValue({ value });
      });
      inTemporaryListStub = sinon.stub().callsFake(({ list, recordDatastore, recordId }) => {
        return inTemporaryList({ list, recordDatastore, recordId });
      });
      args = {
        checkedValues: [],
        inList: inTemporaryListStub,
        list: global.temporaryList,
        splitValue: splitCheckboxValueStub,
        viewingList: false
      };

      // Generate the checked values
      args.checkedValues = getDatastores({ list: args.list }).flatMap((recordDatastore) => {
        return Object.keys(args.list[recordDatastore]).map((recordId) => {
          return `${recordDatastore},${recordId}`;
        });
      });
    });

    afterEach(function () {
      splitCheckboxValueStub = null;
      inTemporaryListStub = null;
      args = null;
    });

    it('should return `true` if viewing My Temporary List', function () {
      expect(checkIfInList({ ...args, viewingList: true }), 'The function should return `true` if viewing My Temporary List').to.be.true;
    });

    it('should return `false` if there are no checked records', function () {
      expect(checkIfInList({ ...args, checkedValues: [] }), 'The function should return `false` if there are no checked records').to.be.false;
    });

    it('should return `true` if all checked records are in My Temporary List', function () {
      expect(checkIfInList(args), 'The function should return `true` if all checked records are in My Temporary List').to.be.true;
    });

    it('should return `false` if not all checked records are in My Temporary List', function () {
      // Add a non-existent record to the checked values
      args.checkedValues.push('nonExistentDatastore,nonExistentRecordId');

      // Check that the function returns `false`
      expect(checkIfInList(args), 'The function should return `false` if not all checked records are in My Temporary List').to.be.false;
    });

    it('should call `splitCheckboxValue` for each checked value with the correct arguments', function () {
      // Call the function
      checkIfInList(args);

      // Check that `splitCheckboxValue` was called for each checked value
      expect(splitCheckboxValueStub.callCount, 'The `splitCheckboxValue` function should have been called for each checked value').to.equal(args.checkedValues.length);

      // Check that `splitCheckboxValue` was called for each checked value with the correct arguments
      args.checkedValues.forEach((value, index) => {
        expect(splitCheckboxValueStub.getCall(index).calledWithExactly({ value }), `The \`splitCheckboxValue\` function should have been called with the correct arguments for checked value ${value}`).to.be.true;
      });
    });

    it('should call `inTemporaryList` for each checked value with the correct arguments', function () {
      // Call the function
      checkIfInList(args);

      // Check that `inTemporaryList` was called for each checked value
      expect(inTemporaryListStub.callCount, 'The `inTemporaryList` function should have been called for each checked value').to.equal(args.checkedValues.length);

      // Check that `inTemporaryList` was called for each checked value with the correct arguments
      args.checkedValues.forEach((value, index) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value });
        expect(inTemporaryListStub.getCall(index).calledWithExactly({ list: args.list, recordDatastore, recordId }), `The \`inTemporaryList\` function should have been called with the correct arguments for checked value ${value}`).to.be.true;
      });
    });
  });

  describe('updateToggleSelectedTabText()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        fullRecord: false,
        inList: false,
        tab: getToggleSelectedTab()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should update the tab text to `Add selected`', function () {
      // Call the function
      updateToggleSelectedTabText(args);

      // Check that the tab text has been updated to `Add selected`
      expect(args.tab.textContent, 'The tab text should have been updated to `Add selected`').to.equal('Add selected');
    });

    it('should update the tab text to `Remove selected`', function () {
      // Call the function
      updateToggleSelectedTabText({ ...args, inList: true });

      // Check that the tab text has been updated to `Remove selected`
      expect(args.tab.textContent, 'The tab text should have been updated to `Remove selected`').to.equal('Remove selected');
    });

    it('should update the tab text to `Add record`', function () {
      // Call the function
      updateToggleSelectedTabText({ ...args, fullRecord: true });

      // Check that the tab text has been updated to `Add record`
      expect(args.tab.textContent, 'The tab text should have been updated to `Add record`').to.equal('Add record');
    });

    it('should update the tab text to `Remove record`', function () {
      // Call the function
      updateToggleSelectedTabText({ ...args, fullRecord: true, inList: true });

      // Check that the tab text has been updated to `Remove record`
      expect(args.tab.textContent, 'The tab text should have been updated to `Remove record`').to.equal('Remove record');
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

  describe('updateToggleSelectedAction()', function () {
    let checkIfInListStub = null;
    let toggleActionClassesSpy = null;
    let updateToggleSelectedTabTextSpy = null;
    let args = null;

    beforeEach(function () {
      checkIfInListStub = sinon.stub().callsFake(({ list }) => {
        return checkIfInList({ list });
      });
      toggleActionClassesSpy = sinon.spy();
      updateToggleSelectedTabTextSpy = sinon.spy();
      args = {
        checkIfAllInList: checkIfInListStub,
        list: global.temporaryList,
        toggleClasses: toggleActionClassesSpy,
        updateText: updateToggleSelectedTabTextSpy
      };

      // Call the function
      updateToggleSelectedAction(args);
    });

    afterEach(function () {
      checkIfInListStub = null;
      toggleActionClassesSpy = null;
      updateToggleSelectedTabTextSpy = null;
      args = null;
    });

    it('should call `checkIfAllInList` with the correct arguments', function () {
      expect(checkIfInListStub.calledOnceWithExactly({ list: args.list }), '`checkIfAllInList` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateToggleSelectedTabText` with the correct arguments', function () {
      expect(updateToggleSelectedTabTextSpy.calledOnceWithExactly({ inList: args.checkIfAllInList({ list: args.list }) }), '`updateToggleSelectedTabText` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleActionClasses` with the correct arguments', function () {
      expect(toggleActionClassesSpy.calledOnceWithExactly({ inList: args.checkIfAllInList({ list: args.list }) }), '`toggleClasses` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('toggleSelectedButton()', function () {
    let getButton = null;
    let args = null;

    beforeEach(function () {
      getButton = () => {
        return document.querySelector(`#actions__toggle-selected--tabpanel button`);
      };
      args = {
        button: getButton(),
        originalText: getButton().textContent,
        text: 'Disabled Text'
      };
    });

    afterEach(function () {
      getButton = null;
      args = null;
    });

    describe('when `disabled` is `true`', function () {
      beforeEach(function () {
        // Call the function
        args.disabled = true;
        toggleSelectedButton(args);
      });

      it('should update the button text', function () {
        expect(getButton().textContent, 'Button text should be updated').to.equal(args.text);
      });

      it('should disable the button', function () {
        expect(getButton().disabled, 'Button should be disabled').to.be.true;
      });
    });

    describe('when `disabled` is `false`', function () {
      beforeEach(function () {
        // Call the function
        args.disabled = false;
        toggleSelectedButton(args);
      });

      it('should restore the button text', function () {
        expect(getButton().textContent, 'Button text should be updated').to.equal(args.originalText);
      });

      it('should enable the button', function () {
        expect(getButton().disabled, 'Button should be enabled').to.be.false;
      });
    });
  });

  describe('toggleSelectedAction()', function () {
    let addSelectedSpy = null;
    let removeSelectedSpy = null;
    let updateToggleSelectedActionSpy = null;
    let args = null;

    beforeEach(function () {
      addSelectedSpy = sinon.spy();
      removeSelectedSpy = sinon.spy();
      updateToggleSelectedActionSpy = sinon.spy();
      args = {
        add: addSelectedSpy,
        list: global.temporaryList,
        remove: removeSelectedSpy,
        updateAction: updateToggleSelectedActionSpy
      };

      // Call the function
      toggleSelectedAction(args);
    });

    afterEach(function () {
      addSelectedSpy = null;
      removeSelectedSpy = null;
      updateToggleSelectedActionSpy = null;
      args = null;
    });

    it('should call `addSelected` with the correct arguments', function () {
      expect(addSelectedSpy.calledOnceWithExactly({ list: args.list }), '`add` should have been called with the correct arguments').to.be.true;
    });

    it('should call `removeSelected` with the correct arguments', function () {
      expect(removeSelectedSpy.calledOnceWithExactly({ list: args.list }), '`remove` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateToggleSelectedAction` with the correct arguments', function () {
      expect(updateToggleSelectedActionSpy.calledOnceWithExactly({ list: args.list }), '`updateAction` should have been called with the correct arguments').to.be.true;
    });
  });
});
