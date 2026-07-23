import {
  getSelectionsFilter,
  handleSelectionsFilterChange,
  initializeSelectionsFilter
} from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_filter.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('selections filter', function () {
  let getSelections = null;
  let getInput = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__selections">
        <input type="text" class="additional-option__selections--text" value="" />
      </div>
    `;

    getSelections = () => {
      return document.querySelector('.additional-option__selections');
    };

    getInput = () => {
      return document.querySelector('.additional-option__selections--text');
    };
  });

  afterEach(function () {
    getSelections = null;
    getInput = null;
  });

  describe('getSelectionsFilter()', function () {
    it('should return the selections filter element', function () {
      expect(getSelectionsFilter({ selections: getSelections() }), '`getSelectionsFilter` should return the element with the class `additional-option__selections--text`').to.equal(document.querySelector('.additional-option__selections--text'));
    });
  });

  describe('handleSelectionsFilterChange()', function () {
    let getSelectionsFilterStub = null;
    let filterSelectionsCheckboxesSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      getSelectionsFilterStub = sinon.stub().callsFake(({ selections }) => {
        return selections.querySelector('.additional-option__selections--text');
      });
      filterSelectionsCheckboxesSpy = sinon.spy();
      args = {
        filterCheckboxes: filterSelectionsCheckboxesSpy,
        selections: getSelections(),
        selectionsFilter: getSelectionsFilterStub
      };

      // Call the function
      handleSelectionsFilterChange(args);
    });

    afterEach(function () {
      getSelectionsFilterStub = null;
      filterSelectionsCheckboxesSpy = null;
      args = null;
      event = null;
    });

    it('should call `getSelectionsFilter` with the correct arguments', function () {
      expect(getSelectionsFilterStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsFilter` should be called with the correct arguments').to.be.true;
    });

    it('should call `filterSelectionsCheckboxes` with the correct arguments when the filter value changes', function () {
      // Check that `filterSelectionsCheckboxes` has not been called yet
      expect(filterSelectionsCheckboxesSpy.notCalled, '`filterSelectionsCheckboxes` should not have been called yet').to.be.true;

      // Simulate input event
      event = new window.Event('input', { bubbles: true });
      const filter = getInput();
      filter.value = 'test';
      filter.dispatchEvent(event);

      // Check that `filterSelectionsCheckboxes` was called with the correct arguments
      expect(filterSelectionsCheckboxesSpy.calledWith({ filter: filter.value, selections: args.selections }), '`filterSelectionsCheckboxes` should be called with the correct value').to.be.true;
    });
  });

  describe('initializeSelectionsFilter()', function () {
    let handleSelectionsFilterChangeSpy = null;
    let args = null;

    beforeEach(function () {
      handleSelectionsFilterChangeSpy = sinon.spy();
      args = {
        handleFilterChange: handleSelectionsFilterChangeSpy,
        selections: getSelections()
      };

      // Call the function
      initializeSelectionsFilter(args);
    });

    afterEach(function () {
      handleSelectionsFilterChangeSpy = null;
      args = null;
    });

    it('should call `handleFilterChange` with the correct arguments', function () {
      expect(handleSelectionsFilterChangeSpy.calledOnceWithExactly({ selections: args.selections }), '`handleFilterChange` should be called with the correct arguments').to.be.true;
    });
  });
});
