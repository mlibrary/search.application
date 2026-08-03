import {
  getShowSelectedButton,
  handleShowSelectedFilters,
  initializeShowSelected,
  isShowSelectedButtonPressed,
  toggleShowSelectedButtonClass,
  toggleShowSelectedButtonItems,
  toggleShowSelectedButtonPressed,
  toggleShowSelectedButtonText,
  toggleShowSelectedButtonVisibility,
  updateShowSelectedButtonCount
} from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_show-selected.js';
import { expect } from 'chai';
import { getSelectionsCheckboxesByState } from '../../../../../../assets/scripts/advanced/partials/additional-options/selections/_checkboxes.js';
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
        <button class="additional-option__selections--show-selected" style="display: none;" aria-pressed="false">
          <span class="additional-option__selections--show-selected-not-pressed">Show only selected options (<span class="additional-option__selections--show-selected-count">0</span>)</span>
          <span class="additional-option__selections--show-selected-pressed" style="display: none;">Show all options</span>
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

  describe('isShowSelectedButtonPressed()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return the correct pressed state of the button', function () {
      expect(isShowSelectedButtonPressed({ button: args.button }), '`isShowSelectedButtonPressed` should return the correct pressed state').to.equal(args.button.getAttribute('aria-pressed') === 'true');
    });
  });

  describe('toggleShowSelectedButtonPressed()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        isPressed: isShowSelectedButtonPressed({ button: getButton() })
      };

      // Check that the `aria-pressed` attribute is initially set
      expect(args.button.getAttribute('aria-pressed'), 'Button should initially have aria-pressed attribute').to.equal(String(args.isPressed));

      // Call the function
      toggleShowSelectedButtonPressed(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the pressed state of the button', function () {
      expect(args.button.getAttribute('aria-pressed'), '`toggleShowSelectedButtonPressed` should toggle the pressed state').to.equal(String(!args.isPressed));
    });
  });

  describe('toggleShowSelectedButtonClass()', function () {
    let args = null;
    const buttonClass = 'button__ghost--active';
    let hasClass = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        isPressed: false
      };

      hasClass = args.button.classList.contains(buttonClass);

      // Check that the button has the class or not
      expect(hasClass, `the button ${hasClass ? 'should' : 'should not'} initially have the active class`).to.be[hasClass];

      // Call the function
      toggleShowSelectedButtonClass(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the active class of the button', function () {
      expect(args.button.classList.contains(buttonClass), '`toggleShowSelectedButtonClass` should toggle the active class').to.be[!args.isPressed];
    });
  });

  describe('toggleShowSelectedButtonText()', function () {
    let args = null;
    let notPressedText = null;
    let pressedText = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        isPressed: false
      };
      notPressedText = () => {
        return args.button.querySelector('.additional-option__selections--show-selected-not-pressed');
      };
      pressedText = () => {
        return args.button.querySelector('.additional-option__selections--show-selected-pressed');
      };

      // Call the function
      toggleShowSelectedButtonText(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the button text', function () {
      // Check that the appropriate content is visible
      if (args.isPressed) {
        expect(notPressedText().hasAttribute('style'), 'Not pressed text should be visible').to.be.false;
        expect(pressedText().getAttribute('style'), 'Pressed text should not be visible').to.equal('display: none;');
      } else {
        expect(notPressedText().hasAttribute('style'), 'Not pressed text should be visible').to.be.false;
        expect(pressedText().getAttribute('style'), 'Pressed text should not be visible').to.equal('display: none;');
      }
    });
  });

  describe('toggleShowSelectedButtonItems()', function () {
    let toggleShowSelectedButtonClassSpy = null;
    let toggleShowSelectedButtonPressedSpy = null;
    let toggleShowSelectedButtonTextSpy = null;
    let args = null;

    beforeEach(function () {
      toggleShowSelectedButtonClassSpy = sinon.spy();
      toggleShowSelectedButtonPressedSpy = sinon.spy();
      toggleShowSelectedButtonTextSpy = sinon.spy();
      args = {
        button: getButton(),
        toggleClass: toggleShowSelectedButtonClassSpy,
        togglePressed: toggleShowSelectedButtonPressedSpy,
        toggleText: toggleShowSelectedButtonTextSpy
      };

      // Call the function
      toggleShowSelectedButtonItems(args);
    });

    afterEach(function () {
      toggleShowSelectedButtonClassSpy = null;
      toggleShowSelectedButtonPressedSpy = null;
      toggleShowSelectedButtonTextSpy = null;
      args = null;
    });

    it('should call `toggleShowSelectedButtonClass` with the correct arguments', function () {
      expect(toggleShowSelectedButtonClassSpy.calledOnceWithExactly({ button: args.button }), '`toggleShowSelectedButtonClass` should have been called once').to.be.true;
    });

    it('should call `toggleShowSelectedButtonPressed` with the correct arguments', function () {
      expect(toggleShowSelectedButtonPressedSpy.calledOnceWithExactly({ button: args.button }), '`toggleShowSelectedButtonPressed` should have been called once').to.be.true;
    });

    it('should call `toggleShowSelectedButtonText` with the correct arguments', function () {
      expect(toggleShowSelectedButtonTextSpy.calledOnceWithExactly({ button: args.button }), '`toggleShowSelectedButtonText` should have been called once').to.be.true;
    });
  });

  describe('toggleShowSelectedButtonVisibility()', function () {
    let getSelectionsCheckboxesByStateStub = null;
    let args = null;

    beforeEach(function () {
      getSelectionsCheckboxesByStateStub = sinon.stub().callsFake(({ checked, selections }) => {
        return getSelectionsCheckboxesByState({ checked, selections });
      });
      args = {
        button: getButton(),
        getCheckedCheckboxes: getSelectionsCheckboxesByStateStub,
        selections: getSelections()
      };

      // Check the button is initially hidden
      expect(args.button.style.display, 'Button should initially be hidden').to.equal('none');

      // Call the function
      toggleShowSelectedButtonVisibility(args);
    });

    afterEach(function () {
      getSelectionsCheckboxesByStateStub = null;
      args = null;
    });

    it('should call `getSelectionsCheckboxesByState` with the correct arguments', function () {
      expect(getSelectionsCheckboxesByStateStub.calledOnceWithExactly({ checked: true, selections: args.selections }), '`getSelectionsCheckboxesByState` should have been called once').to.be.true;
    });

    it('should toggle the show selected button', function () {
      // Check that the button's visibility is toggled based on the count of checked checkboxes
      if (getSelectionsCheckboxesByStateStub({ checked: true, selections: args.selections }).length > 0) {
        expect(args.button.hasAttribute('style'), '`toggleShowSelectedButtonVisibility` should toggle the display').to.be.false;
      } else {
        expect(args.button.style.display, '`toggleShowSelectedButtonVisibility` should hide the button when count is 0').to.equal('none');
      }
    });
  });

  describe('handleShowSelectedFilters()', function () {
    let toggleShowSelectedButtonItemsSpy = null;
    let toggleUncheckedCheckboxesSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      toggleShowSelectedButtonItemsSpy = sinon.spy();
      toggleUncheckedCheckboxesSpy = sinon.spy();
      args = {
        button: getButton(),
        selections: getSelections(),
        toggleButtonItems: toggleShowSelectedButtonItemsSpy,
        toggleUncheckedCheckboxes: toggleUncheckedCheckboxesSpy
      };

      // Call the function
      handleShowSelectedFilters(args);

      // Check that `toggleShowSelectedButtonItems` was not called before clicking
      expect(toggleShowSelectedButtonItemsSpy.called, '`toggleShowSelectedButtonItems` should not have been called before clicking').to.be.false;
      // Check that `toggleUncheckedCheckboxes` was not called before clicking
      expect(toggleUncheckedCheckboxesSpy.called, '`toggleUncheckedCheckboxes` should not have been called before clicking').to.be.false;

      // Simulate a click event on the button
      event = new window.Event('click');
      args.button.dispatchEvent(event);
    });

    afterEach(function () {
      toggleUncheckedCheckboxesSpy = null;
      args = null;
      event = null;
    });

    it('should call `toggleShowSelectedButtonItems` with the correct arguments when the button is clicked', function () {
      expect(toggleShowSelectedButtonItemsSpy.calledOnceWithExactly({ button: args.button }), '`toggleShowSelectedButtonItems` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleUncheckedCheckboxes` with the correct arguments when the button is clicked', function () {
      expect(toggleUncheckedCheckboxesSpy.calledOnceWithExactly({ selections: args.selections }), '`toggleUncheckedCheckboxes` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('initializeShowSelected()', function () {
    let getShowSelectedButtonStub = null;
    let handleShowSelectedFiltersSpy = null;
    let toggleShowSelectedButtonVisibilitySpy = null;
    let args = null;

    beforeEach(function () {
      getShowSelectedButtonStub = sinon.stub().callsFake(({ selections }) => {
        return getShowSelectedButton({ selections });
      });
      toggleShowSelectedButtonVisibilitySpy = sinon.spy();
      handleShowSelectedFiltersSpy = sinon.spy();
      args = {
        handleShowSelected: handleShowSelectedFiltersSpy,
        selections: getSelections(),
        showSelectedButton: getShowSelectedButtonStub,
        toggleButtonVisibility: toggleShowSelectedButtonVisibilitySpy
      };

      // Call the function
      initializeShowSelected(args);
    });

    afterEach(function () {
      toggleShowSelectedButtonVisibilitySpy = null;
      handleShowSelectedFiltersSpy = null;
      args = null;
    });

    it('should call `getShowSelectedButton` with the correct arguments', function () {
      expect(getShowSelectedButtonStub.calledOnceWithExactly({ selections: args.selections }), '`getShowSelectedButton` should have been called once').to.be.true;
    });

    it('should call `toggleShowSelectedButtonVisibility`with the correct arguments', function () {
      expect(toggleShowSelectedButtonVisibilitySpy.calledOnceWithExactly({ button: getShowSelectedButtonStub({ selections: args.selections }), selections: args.selections }), '`toggleShowSelectedButtonVisibility` should have been called once').to.be.true;
    });

    it('should call `handleShowSelectedFilters` with the correct arguments', function () {
      expect(handleShowSelectedFiltersSpy.calledOnceWithExactly({ button: getShowSelectedButtonStub({ selections: args.selections }), selections: args.selections }), '`handleShowSelectedFilters` should have been called once').to.be.true;
    });
  });
});
