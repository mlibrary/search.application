import {
  getShowSelectedButton,
  handleShowSelectedFilters,
  showSelectedFilters,
  toggleShowSelectedButton,
  updateShowSelectedButtonCount
} from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_show-selected.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('show selected', function () {
  let getSelections = null;
  let getButton = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <div class="additional-option__selections">
        <fieldset class="additional-option__selections--checkboxes">
        <legend class="visually-hidden">Select one or more academic discipline filters</legend>
          <label class="label-wrapper additional-option__selections--checkbox" data-filter-value="Academic and Specialized News">
            <input type="checkbox" name="academic_discipline" value="Academic and Specialized News">
            <span>Academic and Specialized News</span>
          </label>
          <label class="label-wrapper additional-option__selections--checkbox" data-filter-value="Aerospace Engineering">
            <input type="checkbox" name="academic_discipline" value="Aerospace Engineering" checked>
            <span>Aerospace Engineering</span>
          </label>
          <label class="label-wrapper additional-option__selections--checkbox" data-filter-value="African American Studies">
            <input type="checkbox" name="academic_discipline" value="African American Studies">
            <span>African American Studies</span>
          </label>        
        </fieldset>
        <button class="additional-option__selections--show-selected" style="display: none;">
          Show Selected (<span class="additional-option__selections--show-selected-count">0</span>)
        </button>
      </div>
    `;

    getSelections = () => {
      return document.querySelector('.additional-option__selections');
    };

    getButton = () => {
      return document.querySelector('.additional-option__selections--show-selected');
    };
  });

  afterEach(function () {
    getSelections = null;
    getButton = null;
  });

  describe('getShowSelectedButton()', function () {
    it('should return the show selected button element', function () {
      expect(getShowSelectedButton({ selections: getSelections() }), '`getShowSelectedButton` should return the correct button element').to.deep.equal(getButton());
    });
  });

  describe('updateShowSelectedButtonCount()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        count: 5
      };

      // Call the function
      updateShowSelectedButtonCount(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the show selected button count', function () {
      expect(args.button.querySelector('.additional-option__selections--show-selected-count').textContent, '`updateShowSelectedButtonCount` should update the count').to.equal(String(args.count));
    });
  });

  describe('toggleShowSelectedButton()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        count: 5
      };

      // Check that the button is initially hidden
      expect(args.button.style.display, 'Button should initially be hidden').to.equal('none');

      // Call the function
      toggleShowSelectedButton(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the show selected button', function () {
      if (args.count > 0) {
        expect(args.button.style.display, '`toggleShowSelectedButton` should toggle the display').to.not.equal('none');
      } else {
        expect(args.button.style.display, '`toggleShowSelectedButton` should hide the button when count is 0').to.equal('none');
      }
    });
  });

  describe('handleShowSelectedFilters()', function () {
    let toggleUncheckedCheckboxesSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      toggleUncheckedCheckboxesSpy = sinon.spy();
      args = {
        button: getButton(),
        selections: getSelections(),
        toggleUncheckedCheckboxes: toggleUncheckedCheckboxesSpy
      };

      // Call the function
      handleShowSelectedFilters(args);

      // Simulate a click event on the button
      event = new window.Event('click');
      args.button.dispatchEvent(event);
    });

    afterEach(function () {
      toggleUncheckedCheckboxesSpy = null;
      args = null;
      event = null;
    });

    it('should call `toggleUncheckedCheckboxes` with the correct arguments when the button is clicked', function () {
      expect(toggleUncheckedCheckboxesSpy.calledOnceWithExactly({ selections: args.selections }), '`toggleUncheckedCheckboxes` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('showSelectedFilters()', function () {
    let getShowSelectedButtonStub = null;
    let toggleShowSelectedButtonSpy = null;
    let handleShowSelectedFiltersSpy = null;
    let args = null;

    beforeEach(function () {
      getShowSelectedButtonStub = sinon.stub().returns(getButton());
      toggleShowSelectedButtonSpy = sinon.spy();
      handleShowSelectedFiltersSpy = sinon.spy();

      args = {
        checkedCheckboxes: Array.from(getSelections().querySelectorAll('input[type="checkbox"]:checked')),
        handleShowSelected: handleShowSelectedFiltersSpy,
        selections: getSelections(),
        showSelectedButton: getShowSelectedButtonStub,
        toggleButton: toggleShowSelectedButtonSpy
      };

      // Call the function
      showSelectedFilters(args);
    });

    afterEach(function () {
      getShowSelectedButtonStub = null;
      toggleShowSelectedButtonSpy = null;
      handleShowSelectedFiltersSpy = null;
      args = null;
    });

    it('should call `getShowSelectedButton` with the correct arguments', function () {
      expect(getShowSelectedButtonStub.calledOnceWithExactly({ selections: args.selections }), '`getShowSelectedButton` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleShowSelectedButton` with the correct arguments', function () {
      expect(toggleShowSelectedButtonSpy.calledOnceWithExactly({ button: getShowSelectedButtonStub(), count: args.checkedCheckboxes.length }), '`toggleShowSelectedButton` should have been called with the correct arguments').to.be.true;
    });

    it('should call `handleShowSelected` with the correct arguments', function () {
      expect(handleShowSelectedFiltersSpy.calledOnceWithExactly({ button: getShowSelectedButtonStub(), selections: args.selections }), '`handleShowSelected` should have been called with the correct arguments').to.be.true;
    });
  });
});
