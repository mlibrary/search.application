import { resultsList, toggleFiltersDetails } from '../../../../assets/scripts/datastores/results/layout.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('results layout', function () {
  let getDetails = null;
  let getElement = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <aside class="results__sidebar">
        <details>
          <summary>
            Filters
          </summary>
        </details>
      </aside>
      <div class="results__content">
        <input type="checkbox" class="record__checkbox">
        <input type="checkbox" class="select-all__checkbox">
      </div>
    `;

    getDetails = () => {
      return document.querySelector('details');
    };

    getElement = () => {
      return document.querySelector('.results__content');
    };
  });

  afterEach(function () {
    getDetails = null;
    getElement = null;
  });

  describe('toggleFiltersDetails()', function () {
    let args = null;
    let originalInnerWidth = null;
    let event = null;

    beforeEach(function () {
      args = { details: getDetails() };

      // Check if the details element is closed by default
      expect(args.details.hasAttribute('open'), 'The details element should not have the `open` attribute by default').to.be.false;

      // Call the function
      toggleFiltersDetails(args);

      // Save the original window.innerWidth value
      originalInnerWidth = window.innerWidth;

      // Create a resize event
      event = new window.Event('resize', { bubbles: true });
    });

    afterEach(function () {
      args = null;
      window.innerWidth = originalInnerWidth;
      event = null;
    });

    it('should keep the details element open on resize if the window width is greater than or equal to 980px', function () {
      // Set the window width to 980px
      window.innerWidth = 980;

      // Dispatch the resize event
      window.dispatchEvent(event);

      // Check if the details element is still open
      expect(args.details.hasAttribute('open'), 'The details element should still have the `open` attribute').to.be.true;
    });

    it('should not add the open attribute to the details element on resize if the window width is less than 980px', function () {
      // Set the window width to 979px
      window.innerWidth = 979;

      // Remove the open attribute from the details element
      args.details.removeAttribute('open');

      // Dispatch the resize event
      window.dispatchEvent(event);

      // Check if the details element does not have the open attribute
      expect(args.details.hasAttribute('open'), 'The details element should not have the `open` attribute').to.be.false;
    });

    it('should not throw an error if the details element is not found', function () {
      // Call the function with an invalid details element
      expect(() => {
        return toggleFiltersDetails({ details: null });
      }, 'The function should not throw an error if the details element is not found').to.not.throw();
    });
  });

  describe('resultsList()', function () {
    let initializeActionsSpy = null;
    let handleActionsPanelChangeSpy = null;
    let selectAllSpy = null;
    let temporaryListBannerSpy = null;
    let toggleFiltersDetailsSpy = null;
    let args = null;

    beforeEach(function () {
      initializeActionsSpy = sinon.spy();
      handleActionsPanelChangeSpy = sinon.spy();
      selectAllSpy = sinon.spy();
      temporaryListBannerSpy = sinon.spy();
      toggleFiltersDetailsSpy = sinon.spy();
      args = {
        actionsPanel: initializeActionsSpy,
        handleActionsChange: handleActionsPanelChangeSpy,
        initializeSelectAll: selectAllSpy,
        list: global.temporaryList,
        showBanner: temporaryListBannerSpy,
        toggleFiltersDropdown: toggleFiltersDetailsSpy
      };
    });

    afterEach(function () {
      initializeActionsSpy = null;
      handleActionsPanelChangeSpy = null;
      selectAllSpy = null;
      temporaryListBannerSpy = null;
      toggleFiltersDetailsSpy = null;
      args = null;
    });

    describe('when there is at least one checkbox', function () {
      beforeEach(function () {
        // Call the function
        resultsList({ ...args, checkboxCount: 1 });
      });

      it('should call `toggleFiltersDetails` with the correct arguments', function () {
        expect(toggleFiltersDetailsSpy.calledOnceWithExactly(), '`toggleFiltersDetails` should have been called with the correct arguments').to.be.true;
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

      it('should call `toggleFiltersDetails` with the correct arguments', function () {
        expect(toggleFiltersDetailsSpy.calledOnceWithExactly(), '`toggleFiltersDetails` should have been called with the correct arguments').to.be.true;
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
