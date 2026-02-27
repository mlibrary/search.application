import {
  getToggleButtonInformation,
  getToggleButtons,
  removeToggleButton,
  setToggleButtonInformation,
  toggleDisplayedItems,
  toggleItems
} from '../../../../assets/scripts/datastores/partials/_toggle.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('toggle items', function () {
  let getItems = null;
  let getButton = null;
  const toggleCount = 3;
  const id = 'toggle-id';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <li>
        <ul id="${id}">
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
          <li>List item 4</li>
          <li>List item 5</li>
          <li>List item 6</li>
          <li>List item 7</li>
        </ul>
        <button class="metadata__toggle" aria-expanded="true" aria-controls="${id}" data-toggle="${toggleCount}">
          Show fewer
        </button>
      </li>
    `;

    getItems = () => {
      return document.querySelectorAll(`#${id} > *`);
    };

    getButton = () => {
      return document.querySelector('button');
    };
  });

  afterEach(function () {
    getItems = null;
    getButton = null;
  });

  describe('getToggleButtons()', function () {
    it('should get the toggle buttons', function () {
      expect(getToggleButtons(), 'should return all buttons with `data-toggle` attribute').to.deep.equal(document.querySelectorAll('button[data-toggle]'));
    });
  });

  describe('removeToggleButton()', function () {
    beforeEach(function () {
      // Check that the button exists in the DOM
      expect(getButton(), 'the toggle button should exist before removal').to.not.be.null;

      // Call the function
      removeToggleButton({ listItem: document.querySelector('li') });
    });

    it('should remove the toggle button from the list item', function () {
      expect(getButton(), 'the toggle button should be removed').to.be.null;
    });
  });

  describe('getToggleButtonInformation()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return an object', function () {
      expect(getToggleButtonInformation(args), 'should return an object').to.be.an('object');
    });

    describe('count property', function () {
      it('should return a number equal to the `data-toggle` attribute on the button', function () {
        const { count } = getToggleButtonInformation(args);
        expect(count, 'the count should match the `data-toggle` attribute on the button').to.equal(toggleCount);
      });

      it('should default to 5 if the `data-toggle` attribute is not a number', function () {
        args.button.setAttribute('data-toggle', 'not-a-number');
        const { count } = getToggleButtonInformation(args);
        expect(count, 'the count should default to 5 if `data-toggle` is not a number').to.equal(5);
      });
    });

    describe('items property', function () {
      it('should return all direct children of the controlled element', function () {
        const { items } = getToggleButtonInformation(args);
        expect(items, 'the items should match the direct children of the controlled element').to.deep.equal(getItems());
      });
    });

    describe('length property', function () {
      it('should return the number of direct children of the controlled element', function () {
        const { length } = getToggleButtonInformation(args);
        expect(length, 'the length should match the number of direct children of the controlled element').to.equal(getItems().length);
      });
    });
  });

  describe('toggleDisplayedItems()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        count: toggleCount,
        isExpanded: false,
        items: getItems()
      };

      // Check that `isExpanded` is false
      expect(args.isExpanded, '`isExpanded` should be false before calling `toggleDisplayedItems`').to.be.false;

      // Call the function
      toggleDisplayedItems(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should only hide the items beyond the count when `isExpanded` is false', function () {
      args.items.forEach((item, index) => {
        if (index > (toggleCount - 1)) {
          expect(item.style.display, 'the item should be hidden').to.equal('none');
        } else {
          expect(item.getAttribute('style'), 'the item should be visible').to.be.null;
        }
      });
    });

    it('should show all items when `isExpanded` is true', function () {
      // Update `isExpanded` to true
      args.isExpanded = true;
      expect(args.isExpanded, '`isExpanded` should be true before calling `toggleDisplayedItems`').to.be.true;

      // Call the function again
      toggleDisplayedItems(args);

      // Check that all items are visible
      expect([...args.items].every((item) => {
        return item.getAttribute('style') === null;
      }), 'all items should be visible when `isExpanded` is true').to.be.true;
    });
  });

  describe('setToggleButtonInformation()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        length: getItems().length
      };

      // Check initial state of the button's `aria-expanded` attribute
      expect(args.button.getAttribute('aria-expanded'), '`aria-expanded` should be "true" before calling `setToggleButtonInformation`').to.equal('true');

      // Check initial text of the button
      expect(args.button.textContent.trim(), 'the button text should be "Show fewer" before calling `setToggleButtonInformation`').to.equal('Show fewer');

      // Call the function
      setToggleButtonInformation(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the `aria-expanded` attribute on the button', function () {
      expect(args.button.getAttribute('aria-expanded'), '`aria-expanded` should be "false" after calling `setToggleButtonInformation`').to.equal('false');
    });

    it('should update the button text accordingly', function () {
      expect(args.button.textContent.trim(), `the button text should be "Show all ${args.length}" after calling \`setToggleButtonInformation\``).to.equal(`Show all ${args.length}`);
    });
  });

  describe('toggleItems()', function () {
    let getToggleButtonInformationSpy = null;
    let toggleDisplayedItemsSpy = null;
    let setToggleButtonInformationSpy = null;
    let args = null;

    beforeEach(function () {
      getToggleButtonInformationSpy = sinon.spy(getToggleButtonInformation);
      toggleDisplayedItemsSpy = sinon.spy();
      setToggleButtonInformationSpy = sinon.spy();

      args = {
        buttonInformation: getToggleButtonInformationSpy,
        buttons: getToggleButtons(),
        displayItems: toggleDisplayedItemsSpy,
        setButtonInformation: setToggleButtonInformationSpy
      };

      // Call the function
      toggleItems(args);
    });

    afterEach(function () {
      getToggleButtonInformationSpy = null;
      toggleDisplayedItemsSpy = null;
      setToggleButtonInformationSpy = null;
      args = null;
    });

    it('should call `getToggleButtonInformation` for each button with the correct arguments', function () {
      args.buttons.forEach((button) => {
        expect(getToggleButtonInformationSpy.calledWithExactly({ button }), '`getToggleButtonInformation` should be called with the correct arguments').to.be.true;
      });
    });

    it('should hide the button if there are not enough items', function () {
      // Set the `data-toggle` attribute to a number larger than the number of items
      const button = getButton();
      button.setAttribute('data-toggle', getItems().length + 1);

      // Call the function again
      toggleItems(args);

      // Check that the button is hidden
      expect(button.style.display, 'the button should be hidden if there are not enough items').to.equal('none');
    });

    it('should call `toggleDisplayedItems` for each button with the correct arguments', function () {
      args.buttons.forEach((button) => {
        const { count, items } = getToggleButtonInformation({ button });
        expect(toggleDisplayedItemsSpy.calledWithExactly({ count, isExpanded: false, items }), '`toggleDisplayedItems` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `setToggleButtonInformation` for each button with the correct arguments', function () {
      args.buttons.forEach((button) => {
        const { length } = getToggleButtonInformation({ button });
        expect(setToggleButtonInformationSpy.calledWithExactly({ button, length }), '`setToggleButtonInformation` should be called with the correct arguments').to.be.true;
      });
    });

    it('should call `toggleDisplayedItems` for each button on click with the correct arguments', function () {
      args.buttons.forEach((button) => {
        // Reset the spy call history
        toggleDisplayedItemsSpy.resetHistory();

        // Click the button
        button.click();

        const { count, items } = getToggleButtonInformation({ button });
        expect(toggleDisplayedItemsSpy.calledWithExactly({ count, isExpanded: !(button.getAttribute('aria-expanded') === 'true'), items }), '`toggleDisplayedItems` should be called with the correct arguments on click').to.be.true;
      });
    });

    it('should call `setToggleButtonInformation` for each button on click with the correct arguments', function () {
      args.buttons.forEach((button) => {
        // Reset the spy call history
        setToggleButtonInformationSpy.resetHistory();

        // Click the button
        button.click();

        const { length } = getToggleButtonInformation({ button });
        expect(setToggleButtonInformationSpy.calledWithExactly({ button, length }), '`setToggleButtonInformation` should be called with the correct arguments on click').to.be.true;
      });
    });
  });
});
