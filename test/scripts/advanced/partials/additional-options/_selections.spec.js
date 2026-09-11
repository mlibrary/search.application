import {
  getAllSelections,
  initializeAllSelections,
  initializeSelections
} from '../../../../../assets/scripts/advanced/partials/additional-options/_selections.js';
import { expect } from 'chai';
import { getShowSelectedButton } from '../../../../../assets/scripts/advanced/partials/additional-options/selections/_show-selected.js';
import sinon from 'sinon';

describe('selections', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__selections">
        <button class="button__ghost hide__no-javascript additional-option__selections--show-selected" type="button" aria-pressed="false">
          <span class="additional-option__selections--show-selected-not-pressed">Show only selected options (<span class="additional-option__selections--show-selected-count">1</span>)</span>
          <span class="additional-option__selections--show-selected-pressed" style="display: none;">Show all options</span>
        </button>
      </div>
    `;
  });

  describe('getAllSelections()', function () {
    it('should return all selections', function () {
      expect(getAllSelections(), '`getAllSelections` should return all elements with the class `additional-option__selections`').to.deep.equal(document.querySelectorAll('.additional-option__selections'));
    });
  });

  describe('initializeSelections()', function () {
    let getShowSelectedButtonStub = null;
    let initializeSelectionsFilterSpy = null;
    let initializeSelectionsCheckboxesSpy = null;
    let initializeShowSelectedSpy = null;
    let args = null;

    beforeEach(function () {
      getShowSelectedButtonStub = sinon.stub().callsFake((getShowSelectedButtonArgs) => {
        return getShowSelectedButton({ selections: getShowSelectedButtonArgs.selections });
      });
      initializeSelectionsFilterSpy = sinon.spy();
      initializeSelectionsCheckboxesSpy = sinon.spy();
      initializeShowSelectedSpy = sinon.spy();
      args = {
        getButton: getShowSelectedButtonStub,
        initializeCheckboxes: initializeSelectionsCheckboxesSpy,
        initializeFilter: initializeSelectionsFilterSpy,
        initializeShowSelectedButton: initializeShowSelectedSpy,
        selections: getAllSelections()[0]
      };

      // Call the function
      initializeSelections(args);
    });

    afterEach(function () {
      getShowSelectedButtonStub = null;
      initializeSelectionsCheckboxesSpy = null;
      initializeSelectionsFilterSpy = null;
      initializeShowSelectedSpy = null;
      args = null;
    });

    it('should call `getShowSelectedButton` with the correct arguments', function () {
      expect(getShowSelectedButtonStub.calledOnceWithExactly({ selections: args.selections }), '`getShowSelectedButton` should be called with the correct arguments').to.be.true;
    });

    it('should call `initializeSelectionsFilter` for each selection with the correct arguments', function () {
      expect(initializeSelectionsFilterSpy.calledOnceWithExactly({ button: args.getButton({ selections: args.selections }), selections: args.selections }), '`initializeSelectionsFilter` should be called with the correct arguments').to.be.true;
    });

    it('should call `initializeSelectionsCheckboxes` for each selection with the correct arguments', function () {
      expect(initializeSelectionsCheckboxesSpy.calledOnceWithExactly({ button: args.getButton({ selections: args.selections }), selections: args.selections }), '`initializeSelectionsCheckboxes` should be called with the correct arguments').to.be.true;
    });

    it('should call `initializeShowSelected` for each selection with the correct arguments', function () {
      expect(initializeShowSelectedSpy.calledOnceWithExactly({ button: args.getButton({ selections: args.selections }), selections: args.selections }), '`initializeShowSelected` should be called with the correct arguments').to.be.true;
    });
  });

  describe('initializeAllSelections()', function () {
    let initializeSelectionsSpy = null;
    let args = null;

    beforeEach(function () {
      initializeSelectionsSpy = sinon.spy();
      args = {
        allSelections: getAllSelections(),
        initialize: initializeSelectionsSpy
      };

      // Call the function
      initializeAllSelections(args);
    });

    afterEach(function () {
      initializeSelectionsSpy = null;
      args = null;
    });

    it('should call `initializeSelections` for each selection with the correct arguments', function () {
      args.allSelections.forEach((selections) => {
        expect(initializeSelectionsSpy.calledWith({ selections }), '`initializeSelections` should be called with the correct arguments').to.be.true;
      });
    });
  });
});
