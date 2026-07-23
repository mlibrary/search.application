import {
  getAllSelections,
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
    let args = null;

    beforeEach(function () {
      initializeSelectionsFilterSpy = sinon.spy();
      args = {
        allSelections: getAllSelections(),
        initializeFilter: initializeSelectionsFilterSpy
      };

      // Call the function
      initializeSelections(args);
    });

    afterEach(function () {
      initializeSelectionsFilterSpy = null;
      args = null;
    });

    it('should call `initializeSelectionsFilter` for each selection with the correct arguments', function () {
      args.allSelections.forEach((selections) => {
        expect(initializeSelectionsFilterSpy.calledWith({ selections }), '`initializeSelectionsFilter` should be called with the correct arguments').to.be.true;
      });
    });
  });
});
