import { expect } from 'chai';
// Import sinon from 'sinon';
import toggleMetadata from '../../../../../assets/scripts/datastores/partials/_metadata.js';

describe('toggleMetadata', function () {
  let getHeader = null;
  let getList = null;
  let getListItems = null;
  let getButton = null;
  const fieldTitle = 'List Items';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <table class="metadata">
        <tbody>
          <tr>
            <th>${fieldTitle}</th>
            <td>
              <ul>
                <li>List item 1</li>
                <li>List item 2</li>
                <li>List item 3</li>
                <li>List item 4</li>
                <li>List item 5</li>
                <li>List item 6</li>
                <li>List item 7</li>
              </ul>
              <button class="metadata__toggle">Show all</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;

    getHeader = () => {
      return document.querySelector('th');
    };

    getList = () => {
      return document.querySelector('ul');
    };

    getListItems = () => {
      return getList().querySelectorAll('li');
    };

    getButton = () => {
      return document.querySelector('button');
    };

    // Call the function
    toggleMetadata();
  });

  afterEach(function () {
    getHeader = null;
    getList = null;
    getListItems = null;
    getButton = null;
  });

  it('should show the button if list has more than three items', function () {
    // Check that the list has more than three items
    expect(getList().children.length, 'the list should have more than three items').to.be.greaterThan(3);

    // Check that the button is visible
    expect(getButton().style.display, 'the button should be displaying').to.equal('block');
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
    expect(getList().children.length, 'the list should have three or less items').to.be.lessThan(4);

    // Check that the button is not visible
    expect(getButton().style.display, 'the button should not be displaying').to.equal('none');
  });

  it('should change the text if there is a header', function () {
    // Check that the header exists and is not empty
    expect(getHeader(), 'the header should exist').to.not.be.null;
    expect(getHeader().textContent, 'the header should contain the field title').to.equal(fieldTitle);

    // Check that the button text has changed
    expect(getButton().textContent, `the button text should be "Show all ${getListItems().length} ${fieldTitle}"`).to.equal(`Show all ${getListItems().length} ${fieldTitle}`);
  });

  it('should only show the first three list items', function () {
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
    /*
    ARIA ATTRIBUTES
    */
    // Click the button to show all items
    getButton().click();

    // Check that all items are visible
    const allItems = getListItems();
    allItems.forEach((item) => {
      expect(item.style.display, 'the item should be visible after clicking the button').to.not.equal('none');
    });
  });

  it('should toggle button text', function () {
    // Click the button to show all items
    getButton().click();

    // Check that the button text has changed
    expect(getButton().textContent.startsWith('Show fewer'), 'the button text should start with "Show fewer" after clicking').to.be.true;
  });
});
