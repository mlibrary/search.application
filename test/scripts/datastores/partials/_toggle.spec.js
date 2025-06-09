import { expect } from 'chai';
import toggleItems from '../../../../assets/scripts/datastores/partials/_toggle.js';

describe('toggleItems', function () {
  let getItems = null;
  let getButton = null;
  const count = 3;
  const id = 'toggle-id';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ul id="${id}">
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
        <li>List item 4</li>
        <li>List item 5</li>
        <li>List item 6</li>
        <li>List item 7</li>
      </ul>
      <button aria-expanded="true" aria-controls="${id}" data-toggle="${count}">
        Show fewer
      </button>
    `;

    getItems = () => {
      return document.querySelectorAll(`#${id} > *`);
    };

    getButton = () => {
      return document.querySelector('button');
    };

    // Call the function
    toggleItems();
  });

  afterEach(function () {
    getItems = null;
    getButton = null;
  });

  it(`should show the button if list has more than ${count} items`, function () {
    // Check that the list has more than three items
    expect(getItems().length, `the list should have more than ${count} items`).to.be.greaterThan(count);

    // Check that the button is visible
    expect(getButton().hasAttribute('style'), 'the button should be displaying').to.be.false;
  });

  it(`should not show the button if list has ${count} or less items`, function () {
    getItems().forEach((item, index) => {
      if (index > (count - 1)) {
        item.remove();
      }
    });

    // Call the function again
    toggleItems();

    // Check that the list has three or less items
    expect(getItems().length, `the list should have ${count} or less items`).to.be.lessThan(count + 1);

    // Check that the button is not visible
    expect(getButton().style.display, 'the button should not be displaying').to.equal('none');
  });

  it(`should initially show the first ${count} list items`, function () {
    // Check that the first three list items are visible
    const visibleItems = Array.from(getItems()).slice(0, count);
    visibleItems.forEach((item) => {
      expect(item.style.display, 'the item should be visible').to.not.equal('none');
    });

    // Check that the remaining items are hidden
    const hiddenItems = Array.from(getItems()).slice(count);
    hiddenItems.forEach((item) => {
      expect(item.style.display, 'the item should be hidden').to.equal('none');
    });
  });

  it('should set the count to 5 if `data-toggle` is not a number', function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ul id="${id}">
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
        <li>List item 4</li>
        <li>List item 5</li>
        <li>List item 6</li>
        <li>List item 7</li>
      </ul>
      <button aria-expanded="true" aria-controls="${id}" data-toggle="not-a-number">
        Show fewer
      </button>
    `;

    // Call the function again
    toggleItems();

    // Check that the first five list items are visible
    const visibleItems = Array.from(getItems()).slice(0, 5);
    visibleItems.forEach((item) => {
      expect(item.style.display, 'the item should be visible').to.not.equal('none');
    });

    // Check that the remaining items are hidden
    const hiddenItems = Array.from(getItems()).slice(5);
    hiddenItems.forEach((item) => {
      expect(item.style.display, 'the item should be hidden').to.equal('none');
    });
  });

  it('should toggle the remaining list items', function () {
    // Check that `aria-expanded` is set to false initially
    expect(getButton().getAttribute('aria-expanded'), 'the button should have `aria-expanded` set to `false`').to.equal('false');

    // Click the button to show all items
    getButton().click();

    // Check that `aria-expanded` is set to true after clicking
    expect(getButton().getAttribute('aria-expanded'), 'the button should have `aria-expanded` set to `true` after clicking').to.equal('true');
    // Check that all items are visible
    expect(Array.from(getItems()).every((item) => {
      return item.style.display !== 'none';
    }), 'all list items should be visible after clicking the button').to.be.true;
  });

  it('should toggle button text', function () {
    // Check that the button encourages you to show all items
    expect(getButton().textContent.trim(), `the button text should be "Show all ${getItems().length}"`).to.equal(`Show all ${getItems().length}`);

    // Click the button to show all items
    getButton().click();

    // Check that the button text has changed
    expect(getButton().textContent.trim(), `the button text should start with "Show fewer" after clicking`).to.equal(`Show fewer`);
  });
});
