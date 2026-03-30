import { expect } from 'chai';
import { resultsList } from '../../../../assets/scripts/datastores/results/layout.js';
import sinon from 'sinon';

describe('results layout', function () {
  let getElement = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="results__content">
        <input type="checkbox" class="record__checkbox">
        <input type="checkbox" class="select-all__checkbox">
      </div>
    `;

    getElement = () => {
      return document.querySelector('.results__content');
    };
  });

  afterEach(function () {
    getElement = null;
  });

  describe('resultsList()', function () {
    let initializeActionsSpy = null;
    let handleActionsPanelChangeSpy = null;
    let selectAllSpy = null;
    let temporaryListBannerSpy = null;
    let args = null;

    beforeEach(function () {
      initializeActionsSpy = sinon.spy();
      handleActionsPanelChangeSpy = sinon.spy();
      selectAllSpy = sinon.spy();
      temporaryListBannerSpy = sinon.spy();
      args = {
        actionsPanel: initializeActionsSpy,
        handleActionsChange: handleActionsPanelChangeSpy,
        initializeSelectAll: selectAllSpy,
        list: global.temporaryList,
        showBanner: temporaryListBannerSpy
      };
    });

    afterEach(function () {
      initializeActionsSpy = null;
      handleActionsPanelChangeSpy = null;
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

      it('should call `selectAll` with the correct arguments', function () {
        expect(selectAllSpy.calledOnceWithExactly(), '`selectAll` should have been called with the correct arguments').to.be.true;
      });

      it('should call `handleActionsPanelChange` with the correct arguments', function () {
        expect(handleActionsPanelChangeSpy.calledOnceWithExactly({ element: getElement() }), '`handleActionsPanelChange` should have been called with the correct arguments').to.be.true;
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

      it('should not call `selectAll`', function () {
        expect(selectAllSpy.notCalled, '`selectAll` should not have been called').to.be.true;
      });

      it('should not call `handleActionsPanelChange`', function () {
        expect(handleActionsPanelChangeSpy.notCalled, '`handleActionsPanelChange` should not have been called').to.be.true;
      });
    });
  });
});
