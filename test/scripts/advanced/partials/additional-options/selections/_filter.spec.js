import {
  checkSelectionsCheckboxValueByFilter,
  getSelectionsFilter,
  getSelectionsFilterValue,
  handleSelectionsFilterChange,
  initializeSelectionsFilter
} from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_filter.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('selections filter', function () {
  let getSelections = null;
  let getInput = null;
  let getCheckboxes = null;
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__selections">
        <input type="text" class="additional-option__selections--text" value="test" />
        <fieldset class="additional-option__selections--checkboxes">
          <legend class="visually-hidden">Select one or more filters</legend>
          <label class="label-wrapper additional-option__selections--checkbox" data-filter-value="Academic Discipline">
            <input type="checkbox" name="academic_discipline" value="Academic Discipline">
            <span>Academic Discipline</span>
          </label>
          <label class="label-wrapper additional-option__selections--checkbox" data-filter-value="Test">
            <input type="checkbox" name="academic_discipline" value="Test">
            <span>Test</span>
          </label>
        </fieldset>
        <button class="button__ghost hide__no-javascript additional-option__selections--show-selected" type="button" aria-pressed="false">
          <span class="additional-option__selections--show-selected-not-pressed">Show skip selected options (<span class="additional-option__selections--show-selected-count">1</span>)</span>
          <span class="additional-option__selections--show-selected-pressed" style="display: none;">Show all options</span>
        </button>
      </div>
    `;

    getSelections = () => {
      return document.querySelector('.additional-option__selections');
    };

    getInput = () => {
      return document.querySelector('.additional-option__selections--text');
    };

    getCheckboxes = () => {
      return document.querySelectorAll('.additional-option__selections--checkbox');
    };

    getButton = () => {
      return document.querySelector('.additional-option__selections--show-selected');
    };
  });

  afterEach(function () {
    getSelections = null;
    getInput = null;
    getCheckboxes = null;
    getButton = null;
  });

  describe('getSelectionsFilter()', function () {
    it('should return the selections filter element', function () {
      expect(getSelectionsFilter({ selections: getSelections() }), '`getSelectionsFilter` should return the element with the class `additional-option__selections--text`').to.equal(document.querySelector('.additional-option__selections--text'));
    });
  });

  describe('getSelectionsFilterValue()', function () {
    let getSelectionsFilterStub = null;
    let args = null;

    beforeEach(function () {
      getSelectionsFilterStub = sinon.stub().callsFake((getSelectionsFilterArgs) => {
        return getSelectionsFilter({ selections: getSelectionsFilterArgs.selections });
      });
      args = {
        selections: getSelections(),
        selectionsFilter: getSelectionsFilterStub
      };
    });

    afterEach(function () {
      getSelectionsFilterStub = null;
      args = null;
    });

    it('should call `getSelectionsFilter` with the correct arguments', function () {
      // Call the function
      getSelectionsFilterValue(args);
      // Check if `getSelectionsFilter` was called with the correct arguments
      expect(getSelectionsFilterStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsFilter` should be called with the correct arguments').to.be.true;
    });

    it('should return the value of the selections filter input', function () {
      expect(getSelectionsFilterValue(args), '`getSelectionsFilterValue` should return the value of the selections filter input').to.equal(getInput().value);
    });
  });

  describe('checkSelectionsCheckboxValueByFilter()', function () {
    let getSelectionsFilterValueStub = null;
    let args = null;

    beforeEach(function () {
      getSelectionsFilterValueStub = sinon.stub().callsFake((getSelectionsFilterValueArgs) => {
        return getSelectionsFilterValue({ selections: getSelectionsFilterValueArgs.selections });
      });
      args = {
        checkbox: getCheckboxes()[1],
        getFilterValue: getSelectionsFilterValueStub,
        selections: getSelections()
      };
    });

    afterEach(function () {
      getSelectionsFilterValueStub = null;
      args = null;
    });

    it('should call `getSelectionsFilterValue` with the correct arguments', function () {
      // Call the function
      checkSelectionsCheckboxValueByFilter(args);
      // Check that `getSelectionsFilterValue` was called with the correct arguments
      expect(getSelectionsFilterValueStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsFilterValue` should be called with the correct arguments').to.be.true;
    });

    it('should return `true` if the checkbox value matches the filter value', function () {
      expect(checkSelectionsCheckboxValueByFilter(args), '`checkSelectionsCheckboxValueByFilter` should return the correct boolean value').to.be.true;
    });

    it('should return `false` if the checkbox value does not match the filter value', function () {
      // Change the checkbox value to something that does not match the filter value
      [args.checkbox] = getCheckboxes();
      // Check that the function returns `false`
      expect(checkSelectionsCheckboxValueByFilter(args), '`checkSelectionsCheckboxValueByFilter` should return the correct boolean value').to.be.false;
    });

    it('should return `true` if the filter value is empty', function () {
      // Stub the `getFilterValue` function to return an empty string
      args.getFilterValue = sinon.stub().returns('');
      expect(checkSelectionsCheckboxValueByFilter(args), '`checkSelectionsCheckboxValueByFilter` should return the correct boolean value').to.be.true;
    });
  });

  describe('handleSelectionsFilterChange()', function () {
    let getSelectionsFilterStub = null;
    let filterSelectionsCheckboxesSpy = null;
    let getSelectionsVisibleCheckedCheckboxesStub = null;
    let updateShowSelectedButtonCountSpy = null;
    let args = null;

    beforeEach(function () {
      getSelectionsFilterStub = sinon.stub().callsFake((getSelectionsFilterArgs) => {
        return getSelectionsFilter({ selections: getSelectionsFilterArgs.selections });
      });
      filterSelectionsCheckboxesSpy = sinon.spy();
      getSelectionsVisibleCheckedCheckboxesStub = sinon.stub().returns([]);
      updateShowSelectedButtonCountSpy = sinon.spy();
      args = {
        button: getButton(),
        filterCheckboxes: filterSelectionsCheckboxesSpy,
        getVisibleCheckedCheckboxes: getSelectionsVisibleCheckedCheckboxesStub,
        selections: getSelections(),
        selectionsFilter: getSelectionsFilterStub,
        updateButtonCount: updateShowSelectedButtonCountSpy
      };

      // Call the function
      handleSelectionsFilterChange(args);
    });

    afterEach(function () {
      getSelectionsFilterStub = null;
      filterSelectionsCheckboxesSpy = null;
      getSelectionsVisibleCheckedCheckboxesStub = null;
      updateShowSelectedButtonCountSpy = null;
      args = null;
    });

    it('should call `getSelectionsFilter` with the correct arguments', function () {
      expect(getSelectionsFilterStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsFilter` should be called with the correct arguments').to.be.true;
    });

    describe('trigger input event', function () {
      let event = null;
      let filter = null;

      beforeEach(function () {
        // Check that the remaining functions were not called
        expect(filterSelectionsCheckboxesSpy.notCalled, '`filterSelectionsCheckboxes` should not have been called yet').to.be.true;
        expect(getSelectionsVisibleCheckedCheckboxesStub.notCalled, '`getSelectionsVisibleCheckedCheckboxes` should not have been called yet').to.be.true;
        expect(updateShowSelectedButtonCountSpy.notCalled, '`updateShowSelectedButtonCount` should not have been called yet').to.be.true;

        // Simulate input event
        event = new window.Event('input', { bubbles: true });
        filter = getInput();
        filter.dispatchEvent(event);
      });

      afterEach(function () {
        event = null;
        filter = null;
      });

      it('should call `filterSelectionsCheckboxes` with the correct arguments when the filter value changes', function () {
        expect(filterSelectionsCheckboxesSpy.calledWith({ button: args.button, filter: event.target.value, selections: args.selections }), '`filterSelectionsCheckboxes` should be called with the correct value').to.be.true;
      });

      it('should call `getSelectionsVisibleCheckedCheckboxes` with the correct arguments when the filter value changes', function () {
        expect(getSelectionsVisibleCheckedCheckboxesStub.calledWith({ selections: args.selections }), '`getSelectionsVisibleCheckedCheckboxes` should be called with the correct value').to.be.true;
      });

      it('should call `updateShowSelectedButtonCount` with the correct arguments when the filter value changes', function () {
        expect(updateShowSelectedButtonCountSpy.calledWith({ button: args.button, count: getSelectionsVisibleCheckedCheckboxesStub.returnValues[0].length }), '`updateShowSelectedButtonCount` should be called with the correct value').to.be.true;
      });
    });
  });

  describe('initializeSelectionsFilter()', function () {
    let handleSelectionsFilterChangeSpy = null;
    let args = null;

    beforeEach(function () {
      handleSelectionsFilterChangeSpy = sinon.spy();
      args = {
        button: getButton(),
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
      expect(handleSelectionsFilterChangeSpy.calledOnceWithExactly({ button: args.button, selections: args.selections }), '`handleFilterChange` should be called with the correct arguments').to.be.true;
    });
  });
});
