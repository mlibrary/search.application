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
    let regenerateCitationsSpy = null;
    let selectAllCheckboxStateSpy = null;
    let updateCSLDataSpy = null;
    let updateSelectedCountSpy = null;
    let updateToggleSelectedActionSpy = null;
    let args = null;

    beforeEach(function () {
      actionsPanelTextSpy = sinon.spy();
      disableActionTabsSpy = sinon.spy();
      regenerateCitationsSpy = sinon.spy();
      selectAllCheckboxStateSpy = sinon.spy();
      updateSelectedCountSpy = sinon.spy();
      updateToggleSelectedActionSpy = sinon.spy();
      updateCSLDataSpy = sinon.spy();
      args = {
        actionsText: actionsPanelTextSpy,
        disableTabs: disableActionTabsSpy,
        selectAllCheckbox: selectAllCheckboxStateSpy,
        updateCSL: updateCSLDataSpy,
        updateCitations: regenerateCitationsSpy,
        updateCount: updateSelectedCountSpy,
        updateToggleSelected: updateToggleSelectedActionSpy
      };

      // Call the function
      handleSelectionChange(args);

      // Simulate a change event
      getCheckbox('.record__checkbox').dispatchEvent(new window.Event('change', { bubbles: true }));
    });

    afterEach(function () {
      actionsPanelTextSpy = null;
      disableActionTabsSpy = null;
      regenerateCitationsSpy = null;
      selectAllCheckboxStateSpy = null;
      updateCSLDataSpy = null;
      updateSelectedCountSpy = null;
      updateToggleSelectedActionSpy = null;
      args = null;
    });

    it('should call `updateToggleSelectedAction` with the correct arguments', function () {
      expect(updateToggleSelectedActionSpy.calledOnceWithExactly(), '`updateToggleSelectedAction` should have been called on change').to.be.true;
    });

    it('should call `actionsPanelText` with the correct arguments', function () {
      expect(actionsPanelTextSpy.calledOnceWithExactly(), '`actionsPanelText` should have been called on change').to.be.true;
    });

    it('should call `disableActionTabs` with the correct arguments', function () {
      expect(disableActionTabsSpy.calledOnceWithExactly(), '`disableActionTabs` should have been called on change').to.be.true;
    });

    it('should call `updateCSLData` with the correct arguments', function () {
      expect(updateCSLDataSpy.calledOnceWithExactly(), '`updateCSLData` should have been called on change').to.be.true;
    });

    it('should call `regenerateCitations` with the correct arguments', function () {
      expect(regenerateCitationsSpy.calledOnceWithExactly(), '`regenerateCitations` should have been called on change').to.be.true;
    });

    it('should call `selectAllCheckboxState` with the correct arguments', function () {
      expect(selectAllCheckboxStateSpy.calledOnceWithExactly(), '`selectAllCheckboxState` should have been called on change').to.be.true;
    });

    it('should call `updateSelectedCount` with the correct arguments', function () {
      expect(updateSelectedCountSpy.calledOnceWithExactly(), '`updateSelectedCount` should have been called on change').to.be.true;
    });
  });

  describe('resultsList()', function () {
    let initializeActionsSpy = null;
    let actionsPanelTextSpy = null;
    let disableActionTabsSpy = null;
    let handleSelectionChangeSpy = null;
    let selectAllSpy = null;
    let temporaryListBannerSpy = null;
    let args = null;

    beforeEach(function () {
      initializeActionsSpy = sinon.spy();
      actionsPanelTextSpy = sinon.spy();
      disableActionTabsSpy = sinon.spy();
      handleSelectionChangeSpy = sinon.spy();
      selectAllSpy = sinon.spy();
      temporaryListBannerSpy = sinon.spy();
      args = {
        actionsPanel: initializeActionsSpy,
        actionsText: actionsPanelTextSpy,
        disableTabs: disableActionTabsSpy,
        handleChange: handleSelectionChangeSpy,
        initializeSelectAll: selectAllSpy,
        list: global.temporaryList,
        showBanner: temporaryListBannerSpy
      };
    });

    afterEach(function () {
      initializeActionsSpy = null;
      actionsPanelTextSpy = null;
      disableActionTabsSpy = null;
      handleSelectionChangeSpy = null;
      selectAllSpy = null;
      temporaryListBannerSpy = null;
      args = null;
    });

    describe('when there is at least one checkbox', function () {
      beforeEach(function () {
        // Call the function
        resultsList({ ...args, checkboxCount: 1 });
      });

      it('should call `temporaryListBanner` with the correct arguments', function () {
        expect(temporaryListBannerSpy.calledOnceWithExactly({ list: global.temporaryList }), '`temporaryListBanner` should have been called with the correct arguments').to.be.true;
      });

      it('should call `initializeActions` with the correct arguments', function () {
        expect(initializeActionsSpy.calledOnceWithExactly({ list: global.temporaryList }), '`initializeActions` should have been called with the correct arguments').to.be.true;
      });

      it('should call `actionsPanelText` with the correct arguments', function () {
        expect(actionsPanelTextSpy.calledOnceWithExactly(), '`actionsPanelText` should have been called with the correct arguments').to.be.true;
      });

      it('should call `disableActionTabs` with the correct arguments', function () {
        expect(disableActionTabsSpy.calledOnceWithExactly(), '`disableActionTabs` should have been called with the correct arguments').to.be.true;
      });

      it('should call `selectAll` with the correct arguments', function () {
        expect(selectAllSpy.calledOnceWithExactly(), '`selectAll` should have been called with the correct arguments').to.be.true;
      });

      it('should call `handleSelectionChange` with the correct arguments', function () {
        expect(handleSelectionChangeSpy.calledOnceWithExactly({ list: global.temporaryList }), '`handleSelectionChange` should have been called with the correct arguments').to.be.true;
      });
    });

    describe('when there are no checkboxes', function () {
      beforeEach(function () {
        // Call the function
        resultsList({ ...args, checkboxCount: 0 });
      });

      it('should not call `temporaryListBanner`', function () {
        expect(temporaryListBannerSpy.notCalled, '`temporaryListBanner` should not have been called').to.be.true;
      });

      it('should not call `initializeActions`', function () {
        expect(initializeActionsSpy.notCalled, '`initializeActions` should not have been called').to.be.true;
      });

      it('should not call `actionsPanelText`', function () {
        expect(actionsPanelTextSpy.notCalled, '`actionsPanelText` should not have been called').to.be.true;
      });

      it('should not call `disableActionTabs`', function () {
        expect(disableActionTabsSpy.notCalled, '`disableActionTabs` should not have been called').to.be.true;
      });

      it('should not call `selectAll`', function () {
        expect(selectAllSpy.notCalled, '`selectAll` should not have been called').to.be.true;
      });

      it('should not call `handleSelectionChange`', function () {
        expect(handleSelectionChangeSpy.notCalled, '`handleSelectionChange` should not have been called').to.be.true;
      });
    });
  });
});
