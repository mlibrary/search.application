import {
  filterSelectionsCheckboxes,
  getSelectionsCheckboxes,
  getSelectionsCheckboxesByState,
  getSelectionsVisibleCheckedCheckboxes,
  handleSelectionsCheckboxChange,
  initializeSelectionsCheckboxes,
  selectionsCheckboxChange,
  toggleSelectionsUncheckedCheckboxes
} from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_checkboxes.js';
import { checkSelectionsCheckboxValueByFilter } from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_filter.js';
import { expect } from 'chai';
import { isShowSelectedButtonPressed } from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_show-selected.js';
import sinon from 'sinon';

const createCheckbox = ({ checked = false, index, visible = true }) => {
  const value = `Value ${index}`;
  return `
    <label class="additional-option__selections--checkbox" data-filter-value="${value}" ${visible && index === 2 ? '' : 'style="display: none;"'}>
      <input type="checkbox" name="filter_type" value="${value}" ${checked ? 'checked' : ''}>
    </label>
  `;
};

describe('selections checkboxes', function () {
  let getSelections = null;
  let getFilter = null;
  let getLabels = null;
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__selections">
        <input type="text" class="additional-option__selections--text" value="Value" />
        <fieldset class="additional-option__selections--checkboxes">
          <legend>Select one or more filters</legend>
          ${createCheckbox({ index: 1 })}
          ${createCheckbox({ checked: true, index: 2 })}
          ${createCheckbox({ checked: true, index: 3 })}
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

    getFilter = () => {
      return document.querySelector('.additional-option__selections--text');
    };

    getLabels = ({ checked = false }) => {
      const state = checked ? ':checked' : ':not(:checked)';
      return Array.from(document.querySelectorAll(`input[type="checkbox"]${state}`))
        .map((checkbox) => {
          return checkbox.parentElement;
        });
    };

    getButton = () => {
      return document.querySelector('.additional-option__selections--show-selected');
    };
  });

  afterEach(function () {
    getSelections = null;
    getFilter = null;
    getLabels = null;
    getButton = null;
  });

  describe('getSelectionsCheckboxes()', function () {
    it('should return all selection checkboxes', function () {
      expect(getSelectionsCheckboxes({ selections: getSelections() }), '`getSelectionsCheckboxes` should return all checkboxes').to.deep.equal(document.querySelectorAll('label'));
    });
  });

  describe('getSelectionsCheckboxesByState()', function () {
    let getSelectionsCheckboxesStub = null;
    let args = null;

    beforeEach(function () {
      const selections = getSelections();
      getSelectionsCheckboxesStub = sinon.stub().callsFake((getSelectionsCheckboxesArgs) => {
        return getSelectionsCheckboxes({ selections: getSelectionsCheckboxesArgs.selections });
      });
      args = {
        checkboxes: getSelectionsCheckboxesStub,
        checked: false,
        selections
      };
    });

    afterEach(function () {
      getSelectionsCheckboxesStub = null;
      args = null;
    });

    it('should call `getSelectionsCheckboxes` with the correct arguments', function () {
      // Call the function
      getSelectionsCheckboxesByState(args);
      // Check that `getSelectionsCheckboxes` was called with the correct arguments
      expect(getSelectionsCheckboxesStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsCheckboxes` should be called once with the correct arguments').to.be.true;
    });

    it('should return only unchecked selection checkboxes', function () {
      expect(getSelectionsCheckboxesByState(args), '`getSelectionsCheckboxesByState` should return only unchecked checkboxes').to.deep.equal(getLabels({ checked: args.checked }));
    });

    it('should return only checked selection checkboxes', function () {
      args.checked = true;
      expect(getSelectionsCheckboxesByState(args), '`getSelectionsCheckboxesByState` should return only checked checkboxes').to.deep.equal(getLabels({ checked: args.checked }));
    });
  });

  describe('getSelectionsVisibleCheckedCheckboxes()', function () {
    let getSelectionsCheckboxesByStateStub = null;
    let args = null;

    beforeEach(function () {
      const selections = getSelections();

      getSelectionsCheckboxesByStateStub = sinon.stub().callsFake((getSelectionsCheckboxesByStateArgs) => {
        return getSelectionsCheckboxesByState({ checked: getSelectionsCheckboxesByStateArgs.checked, selections: getSelectionsCheckboxesByStateArgs.selections });
      });

      args = {
        getCheckedCheckboxes: getSelectionsCheckboxesByStateStub,
        selections
      };
    });

    afterEach(function () {
      getSelectionsCheckboxesByStateStub = null;
      args = null;
    });

    it('should call `getSelectionsCheckboxesByState` with the correct arguments', function () {
      // Call the function
      getSelectionsVisibleCheckedCheckboxes(args);
      expect(getSelectionsCheckboxesByStateStub.calledOnceWithExactly({ checked: true, selections: args.selections }), '`getSelectionsCheckboxesByState` should be called once with the correct arguments').to.be.true;
    });

    it('should return only the visible checked selection checkboxes', function () {
      const visibleCheckedCheckboxes = Array.from(getLabels({ checked: true })).filter((checkbox) => {
        return checkbox.style.display !== 'none';
      });
      expect(getSelectionsVisibleCheckedCheckboxes(args), '`getSelectionsVisibleCheckedCheckboxes` should return only visible checked checkboxes').to.deep.equal(visibleCheckedCheckboxes);
    });
  });

  describe('toggleSelectionsUncheckedCheckboxes()', function () {
    let isShowSelectedButtonPressedStub = null;
    let checkSelectionsCheckboxValueByFilterStub = null;
    let args = null;

    beforeEach(function () {
      const selections = getSelections();
      isShowSelectedButtonPressedStub = sinon.stub().callsFake((isShowSelectedButtonPressedArgs) => {
        return isShowSelectedButtonPressed({ button: isShowSelectedButtonPressedArgs.button });
      });
      checkSelectionsCheckboxValueByFilterStub = sinon.stub().callsFake((checkSelectionsCheckboxValueByFilterArgs) => {
        return checkSelectionsCheckboxValueByFilter({ checkbox: checkSelectionsCheckboxValueByFilterArgs.checkbox, selections: checkSelectionsCheckboxValueByFilterArgs.selections });
      });
      args = {
        button: getButton(),
        buttonPressed: isShowSelectedButtonPressedStub,
        checkCheckboxValueByFilter: checkSelectionsCheckboxValueByFilterStub,
        selections,
        uncheckedCheckboxes: getSelectionsCheckboxesByState({ checked: false, selections })
      };
    });

    afterEach(function () {
      isShowSelectedButtonPressedStub = null;
      checkSelectionsCheckboxValueByFilterStub = null;
      args = null;
    });

    it('should call `isShowSelectedButtonPressed` with the correct arguments', function () {
      // Call the function
      toggleSelectionsUncheckedCheckboxes(args);
      expect(isShowSelectedButtonPressedStub.calledOnceWithExactly({ button: args.button }), '`isShowSelectedButtonPressed` should have been called with the correct arguments for each unchecked checkbox').to.be.true;
    });

    it('should call `checkSelectionsCheckboxValueByFilter` if the button is not pressed', function () {
      // Call the function
      toggleSelectionsUncheckedCheckboxes(args);
      // Check that the button is not pressed
      expect(args.buttonPressed({ button: args.button }), '`isShowSelectedButtonPressed` should return false if the button is not pressed').to.be.false;
      // Check if `checkSelectionsCheckboxValueByFilter` was called with the correct arguments for each unchecked checkbox
      const uncheckedCheckboxes = getSelectionsCheckboxesByState({ checked: false, selections: args.selections });
      uncheckedCheckboxes.forEach((checkbox) => {
        expect(checkSelectionsCheckboxValueByFilterStub.calledWithExactly({ checkbox, selections: args.selections }), '`checkSelectionsCheckboxValueByFilter` should have been called with the correct arguments for each unchecked checkbox').to.be.true;
      });
    });

    it('should hide unchecked checkboxes if the button is not pressed and the filter value does not match', function () {
      // Check that the button is not pressed
      expect(args.buttonPressed({ button: args.button }), '`isShowSelectedButtonPressed` should return false if the button is not pressed').to.be.false;
      // Update the filter value
      getFilter().value = 'test';
      // Call the function
      toggleSelectionsUncheckedCheckboxes(args);
      // Check if all unchecked checkboxes are visible
      args.uncheckedCheckboxes.forEach((checkbox) => {
        expect(checkbox.style.display, 'the unchecked checkbox should be hidden when the button is pressed').to.equal('none');
      });
    });

    it('should show unchecked checkboxes if the button is not pressed and the filter value does match', function () {
      // Call the function
      toggleSelectionsUncheckedCheckboxes(args);
      // Check that the button is not pressed
      expect(args.buttonPressed({ button: args.button }), '`isShowSelectedButtonPressed` should return false if the button is not pressed').to.be.false;
      // Check if all unchecked checkboxes are visible
      args.uncheckedCheckboxes.forEach((checkbox) => {
        expect(checkbox.hasAttribute('style'), 'the unchecked checkbox should not have a style attribute when the button is not pressed').to.be.false;
      });
    });

    it('should hide unchecked checkboxes if the button is pressed', function () {
      // Simulate the button being pressed
      args.buttonPressed = () => {
        return true;
      };
      // Call the function
      toggleSelectionsUncheckedCheckboxes(args);
      // Check if all unchecked checkboxes are visible
      args.uncheckedCheckboxes.forEach((checkbox) => {
        expect(checkbox.style.display, 'the unchecked checkbox should be hidden when the button is pressed').to.equal('none');
      });
    });
  });

  describe('filterSelectionsCheckboxes()', function () {
    let isShowSelectedButtonPressedStub = null;
    let getSelectionsCheckboxesStub = null;
    let getSelectionsCheckboxesByStateStub = null;
    let args = null;

    beforeEach(function () {
      isShowSelectedButtonPressedStub = sinon.stub().callsFake((isShowSelectedButtonPressedArgs) => {
        return isShowSelectedButtonPressed({ button: isShowSelectedButtonPressedArgs.button });
      });
      getSelectionsCheckboxesByStateStub = sinon.stub().callsFake((getSelectionsCheckboxesByStateArgs) => {
        return getSelectionsCheckboxesByState({ checked: getSelectionsCheckboxesByStateArgs.checked, selections: getSelectionsCheckboxesByStateArgs.selections });
      });
      getSelectionsCheckboxesStub = sinon.stub().callsFake((getSelectionsCheckboxesArgs) => {
        return getSelectionsCheckboxes({ selections: getSelectionsCheckboxesArgs.selections });
      });
      args = {
        button: getButton(),
        filter: 'Value 1',
        getCheckboxes: getSelectionsCheckboxesStub,
        getCheckedCheckboxes: getSelectionsCheckboxesByStateStub,
        isButtonPressed: isShowSelectedButtonPressedStub,
        selections: getSelections()
      };
    });

    afterEach(function () {
      isShowSelectedButtonPressedStub = null;
      getSelectionsCheckboxesStub = null;
      getSelectionsCheckboxesByStateStub = null;
      args = null;
    });

    it('should call `isShowSelectedButtonPressed` with the correct arguments', function () {
      // Call the function
      filterSelectionsCheckboxes(args);
      // Check if `isShowSelectedButtonPressed` was called with the correct arguments
      expect(isShowSelectedButtonPressedStub.calledOnceWithExactly({ button: args.button }), '`isShowSelectedButtonPressed` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `getSelectionsCheckboxes` with the correct arguments if the show selected button is not pressed', function () {
      // Update the stub to simulate the show selected button not being pressed
      isShowSelectedButtonPressedStub.returns(false);
      // Call the function
      filterSelectionsCheckboxes(args);
      // Check that `getSelectionsCheckboxes` was called with the correct arguments
      expect(getSelectionsCheckboxesStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsCheckboxes` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `getSelectionsCheckboxesByState` with the correct arguments if the show selected button is pressed', function () {
      // Update the stub to simulate the show selected button not being pressed
      isShowSelectedButtonPressedStub.returns(true);
      // Call the function
      filterSelectionsCheckboxes(args);
      // Check that `getSelectionsCheckboxesByState` was called with the correct arguments
      expect(getSelectionsCheckboxesByStateStub.calledOnceWithExactly({ checked: true, selections: args.selections }), '`getSelectionsCheckboxesByState` should have been called once with the correct arguments').to.be.true;
    });

    it('should toggle the visibility of the checkboxes correctly', function () {
      // Call the function
      filterSelectionsCheckboxes(args);
      // Get the appropriate checkboxes
      const checkboxes = isShowSelectedButtonPressed({ button: args.button }) ? getSelectionsCheckboxesByState({ checked: true, selections: args.selections }) : getSelectionsCheckboxes({ selections: args.selections });
      // Assert that the checkboxes are correctly toggled
      checkboxes.forEach((checkbox) => {
        // Check if the `data-filter-value` value includes the filter string
        if (checkbox.dataset.filterValue.toLowerCase().includes(args.filter.toLowerCase())) {
          // Check if the checkbox is visible
          expect(checkbox.hasAttribute('style'), 'the checkbox should be visible').to.be.false;
        } else {
          // Check if the checkbox is hidden
          expect(checkbox.style.display, 'the checkbox should be hidden').to.equal('none');
        }
      });
    });
  });

  describe('handleSelectionsCheckboxChange()', function () {
    let toggleShowSelectedButtonVisibilitySpy = null;
    let getSelectionsVisibleCheckedCheckboxesStub = null;
    let updateShowSelectedButtonCountSpy = null;
    let args = null;

    beforeEach(function () {
      toggleShowSelectedButtonVisibilitySpy = sinon.spy();
      getSelectionsVisibleCheckedCheckboxesStub = sinon.stub().callsFake((getSelectionsVisibleCheckedCheckboxesArgs) => {
        return getSelectionsVisibleCheckedCheckboxes({ selections: getSelectionsVisibleCheckedCheckboxesArgs.selections });
      });
      updateShowSelectedButtonCountSpy = sinon.spy();
      args = {
        button: getButton(),
        getVisibleCheckedCheckboxes: getSelectionsVisibleCheckedCheckboxesStub,
        selections: getSelections(),
        showSelectedButton: toggleShowSelectedButtonVisibilitySpy,
        updateButtonCount: updateShowSelectedButtonCountSpy
      };

      // Call the function
      handleSelectionsCheckboxChange(args);
    });

    afterEach(function () {
      toggleShowSelectedButtonVisibilitySpy = null;
      getSelectionsVisibleCheckedCheckboxesStub = null;
      updateShowSelectedButtonCountSpy = null;
      args = null;
    });

    it('should call `getSelectionsVisibleCheckedCheckboxes` with the correct arguments', function () {
      expect(getSelectionsVisibleCheckedCheckboxesStub.calledOnceWithExactly({ selections: args.selections }), '`getSelectionsVisibleCheckedCheckboxes` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `updateShowSelectedButtonCount` with the correct arguments', function () {
      expect(updateShowSelectedButtonCountSpy.calledOnceWithExactly({ button: args.button, count: getSelectionsVisibleCheckedCheckboxes({ selections: args.selections }).length, selections: args.selections }), '`updateShowSelectedButtonCount` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `toggleShowSelectedButtonVisibility` with the correct arguments', function () {
      expect(toggleShowSelectedButtonVisibilitySpy.calledOnceWithExactly({ button: args.button, count: getSelectionsVisibleCheckedCheckboxes({ selections: args.selections }).length, selections: args.selections }), '`toggleShowSelectedButtonVisibility` should have been called once with the correct arguments').to.be.true;
    });
  });

  describe('selectionsCheckboxChange()', function () {
    let handleSelectionsCheckboxChangeSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleSelectionsCheckboxChangeSpy = sinon.spy();
      args = {
        button: getButton(),
        handleCheckboxChange: handleSelectionsCheckboxChangeSpy,
        selections: getSelections()
      };

      // Call the function
      selectionsCheckboxChange(args);

      event = new window.Event('change', { bubbles: true });
    });

    afterEach(function () {
      handleSelectionsCheckboxChangeSpy = null;
      args = null;
      event = null;
    });

    it('should call `handleSelectionsCheckboxChange` with the correct arguments when a selection checkbox is changed', function () {
      // Simulate a change event on a checkbox
      const checkbox = document.querySelector('input[type="checkbox"]');
      checkbox.dispatchEvent(event);
      // Add your expectations here based on what selectionsCheckboxChange should do
      expect(handleSelectionsCheckboxChangeSpy.calledOnceWithExactly({ button: args.button, selections: args.selections }), '`handleSelectionsCheckboxChange` should have been called once with the correct arguments').to.be.true;
    });

    it('should not call `handleSelectionsCheckboxChange` when a non-checkbox element is changed', function () {
      // Simulate a change event on a non-checkbox element
      const fieldset = document.querySelector('fieldset');
      const nonCheckbox = document.createElement('input');
      nonCheckbox.type = 'text';
      fieldset.appendChild(nonCheckbox);
      nonCheckbox.dispatchEvent(event);
      // Add your expectations here based on what selectionsCheckboxChange should do
      expect(handleSelectionsCheckboxChangeSpy.notCalled, '`handleSelectionsCheckboxChange` should not have been called').to.be.true;
      fieldset.removeChild(nonCheckbox);
    });
  });

  describe('initializeSelectionsCheckboxes()', function () {
    let selectionsCheckboxChangeSpy = null;
    let args = null;

    beforeEach(function () {
      selectionsCheckboxChangeSpy = sinon.spy();
      args = {
        button: getButton(),
        checkboxChange: selectionsCheckboxChangeSpy,
        selections: getSelections()
      };
      // Call the function
      initializeSelectionsCheckboxes(args);
    });

    afterEach(function () {
      selectionsCheckboxChangeSpy = null;
      args = null;
    });

    it('should call `selectionsCheckboxChange` with the correct arguments', function () {
      expect(selectionsCheckboxChangeSpy.calledOnceWithExactly({ button: args.button, selections: args.selections }), '`selectionsCheckboxChange` should have been called once with the correct arguments').to.be.true;
    });
  });
});
