import { handleSelectionChange, resultsList } from '../../../../assets/scripts/datastores/results/layout.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('results layout', function () {
  let getCheckbox = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="results__content">
        <input type="checkbox" class="record__checkbox">
        <input type="checkbox" class="select-all__checkbox">
      </div>
    `;

    getCheckbox = (selector) => {
      return document.querySelector(selector);
    };
  });

  afterEach(function () {
    getCheckbox = null;
  });

  describe('handleSelectionChange()', function () {
    let actionsPanelTextSpy = null;
    let disableActionTabsSpy = null;
    let selectAllCheckboxStateSpy = null;
    let updateSelectedCountSpy = null;
    let args = null;

    beforeEach(function () {
      actionsPanelTextSpy = sinon.spy();
      disableActionTabsSpy = sinon.spy();
      selectAllCheckboxStateSpy = sinon.spy();
      updateSelectedCountSpy = sinon.spy();
      args = {
        actionsPanel: actionsPanelTextSpy,
        disableTabs: disableActionTabsSpy,
        selectAllCheckbox: selectAllCheckboxStateSpy,
        updateCount: updateSelectedCountSpy
      };

      // Call the function
      handleSelectionChange(args);

      // Simulate a change event
      getCheckbox('.record__checkbox').dispatchEvent(new window.Event('change', { bubbles: true }));
    });

    afterEach(function () {
      actionsPanelTextSpy = null;
      disableActionTabsSpy = null;
      selectAllCheckboxStateSpy = null;
      updateSelectedCountSpy = null;
      args = null;
    });

    it('should call `actionsPanelText` on change', function () {
      expect(actionsPanelTextSpy.calledOnce, '`actionsPanelText` should have been called on change').to.be.true;
    });

    it('should call `disableActionTabs` on change', function () {
      expect(disableActionTabsSpy.calledOnce, '`disableActionTabs` should have been called on change').to.be.true;
    });

    it('should call `selectAllCheckboxState` on change', function () {
      expect(selectAllCheckboxStateSpy.calledOnce, '`selectAllCheckboxState` should have been called on change').to.be.true;
    });

    it('should call `updateSelectedCount` on change', function () {
      expect(updateSelectedCountSpy.calledOnce, '`updateSelectedCount` should have been called on change').to.be.true;
    });
  });

  describe('resultsList()', function () {
    let actionsPanelTextSpy = null;
    let disableActionTabsSpy = null;
    let handleSelectionChangeSpy = null;
    let args = null;

    beforeEach(function () {
      actionsPanelTextSpy = sinon.spy();
      disableActionTabsSpy = sinon.spy();
      handleSelectionChangeSpy = sinon.spy();
      args = {
        actionsPanel: actionsPanelTextSpy,
        disableTabs: disableActionTabsSpy,
        handleChange: handleSelectionChangeSpy
      };

      // Call the function
      resultsList(args);
    });

    afterEach(function () {
      actionsPanelTextSpy = null;
      disableActionTabsSpy = null;
      handleSelectionChangeSpy = null;
      args = null;
    });

    it('should call `actionsPanelText`', function () {
      expect(actionsPanelTextSpy.calledOnce, '`actionsPanelText` should have been called').to.be.true;
    });

    it('should call `disableActionTabs`', function () {
      expect(disableActionTabsSpy.calledOnce, '`disableActionTabs` should have been called').to.be.true;
    });

    it('should call `handleSelectionChange`', function () {
      expect(handleSelectionChangeSpy.calledOnce, '`handleSelectionChange` should have been called').to.be.true;
    });
  });
});
