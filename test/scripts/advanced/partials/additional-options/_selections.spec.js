import {
  getAllSelections,
  initializeAllSelections,
  initializeSelections
} from '../../../../../assets/scripts/advanced/partials/additional-options/_selections.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('selections', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__selections"></div>
    `;
  });

  describe('getAllSelections()', function () {
    it('should return all selections', function () {
      expect(getAllSelections(), '`getAllSelections` should return all elements with the class `additional-option__selections`').to.deep.equal(document.querySelectorAll('.additional-option__selections'));
    });
  });

  describe('initializeSelections()', function () {
    let initializeSelectionsFilterSpy = null;
    let initializeSelectionsCheckboxesSpy = null;
    let initializeShowSelectedSpy = null;
    let args = null;

    beforeEach(function () {
      initializeSelectionsFilterSpy = sinon.spy();
      initializeSelectionsCheckboxesSpy = sinon.spy();
      initializeShowSelectedSpy = sinon.spy();
      args = {
        initializeCheckboxes: initializeSelectionsCheckboxesSpy,
        initializeFilter: initializeSelectionsFilterSpy,
        initializeShowSelectedButton: initializeShowSelectedSpy,
        selections: getAllSelections()[0]
      };

      // Call the function
      initializeSelections(args);
    });

    afterEach(function () {
      initializeSelectionsCheckboxesSpy = null;
      initializeSelectionsFilterSpy = null;
      initializeShowSelectedSpy = null;
      args = null;
    });

    it('should call `initializeSelectionsFilter` for each selection with the correct arguments', function () {
      expect(initializeSelectionsFilterSpy.calledOnceWithExactly({ selections: args.selections }), '`initializeSelectionsFilter` should be called with the correct arguments').to.be.true;
    });

    it('should call `initializeSelectionsCheckboxes` for each selection with the correct arguments', function () {
      expect(initializeSelectionsCheckboxesSpy.calledOnceWithExactly({ selections: args.selections }), '`initializeSelectionsCheckboxes` should be called with the correct arguments').to.be.true;
    });

    it('should call `initializeShowSelected` for each selection with the correct arguments', function () {
      expect(initializeShowSelectedSpy.calledOnceWithExactly({ selections: args.selections }), '`initializeShowSelected` should be called with the correct arguments').to.be.true;
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
