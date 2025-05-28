import { expect } from 'chai';
import toggleMetadata from '../../../../assets/scripts/datastores/partials/_metadata.js';

describe('toggleMetadata', function () {
  let getListItems = null;
  let getButton = null;
  const fieldTitle = 'List Items';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ul id="metadata__toggle--partial">
        <li>List item 1</li>
        <li>List item 2</li>
        <li>List item 3</li>
        <li>List item 4</li>
        <li>List item 5</li>
        <li>List item 6</li>
        <li>List item 7</li>
      </ul>
      <button class="metadata__toggle" aria-expanded="true" aria-controls="metadata__toggle--partial">
        Show fewer ${fieldTitle}
      </button>
    `;

    getListItems = (id = 'metadata__toggle--partial') => {
      return document.querySelectorAll(`ul#${id} > li`);
    };

    getButton = () => {
      return document.querySelector('button');
    };

    // Call the function
    toggleMetadata();
  });

  afterEach(function () {
    getListItems = null;
    getButton = null;
  });

  it('should show the button if list has more than three items', function () {
    // Check that the list has more than three items
    expect(getListItems().length, 'the list should have more than three items').to.be.greaterThan(3);

    // Check that the button is visible
    expect(getButton().hasAttribute('style'), 'the button should be displaying').to.be.false;
  });

  it('should not show the button if list has three or less items', function () {
    getListItems().forEach((item, index) => {
      if (index > 2) {
        item.remove();
      }
    });

    // Call the function again
    toggleMetadata();

    // Check that the list has three or less items
    expect(getListItems().length, 'the list should have three or less items').to.be.lessThan(4);

    // Check that the button is not visible
    expect(getButton().style.display, 'the button should not be displaying').to.equal('none');
  });

  it('should initially show the first three list items', function () {
    // Check that the first three list items are visible
    const visibleItems = Array.from(getListItems()).slice(0, 3);
    visibleItems.forEach((item) => {
      expect(item.style.display, 'the item should be visible').to.not.equal('none');
    });

    // Check that the remaining items are hidden
    const hiddenItems = Array.from(getListItems()).slice(3);
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
    expect(Array.from(getListItems()).every((item) => {
      return item.style.display !== 'none';
    }), 'all list items should be visible after clicking the button').to.be.true;
  });

  it('should toggle button text', function () {
    // Check that the button encourages you to show all items
    expect(getButton().textContent.trim(), `the button text should be "Show all ${getListItems().length} ${fieldTitle}"`).to.equal(`Show all ${getListItems().length} ${fieldTitle}`);

    // Click the button to show all items
    getButton().click();

    // Check that the button text has changed
    expect(getButton().textContent.trim(), `the button text should start with "Show fewer ${fieldTitle}" after clicking`).to.equal(`Show fewer ${fieldTitle}`);
  });
});
