import { expect } from 'chai';
import { getTemporaryList } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';
import removeSelected from '../../../../../assets/scripts/datastores/list/partials/_remove-selected.js';

describe('removeSelected', function () {
  let getButton = null;
  let someCheckboxesChecked = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--remove-selected">Remove selected</button>
      <input type="checkbox" class="list__item--checkbox" value="Item 1" checked>
      <input type="checkbox" class="list__item--checkbox" value="Item 2">
      <input type="checkbox" class="list__item--checkbox" value="Item 3">
    `;

    getButton = () => {
      return document.querySelector('button');
    };

    someCheckboxesChecked = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      return [...checkboxes].some((checkbox) => {
        return checkbox.checked;
      });
    };

    global.sessionStorage = window.sessionStorage;

    // Call the function
    removeSelected();
  });

  afterEach(function () {
    getButton = null;
    someCheckboxesChecked = null;

    delete global.sessionStorage;
  });

  it('should show the button if some checkboxes are checked', function () {
    // Check to make sure not all checkboxes are checked
    expect(someCheckboxesChecked(), 'some checkboxes should be checked').to.be.true;

    // Check that the button is visible
    expect(getButton().hasAttribute('style'), 'the `Remove selected` button should be displaying when some checkboxes are checked').to.be.false;
  });

  it.skip('should remove the checked items from `sessionStorage`', function () {
    // Get the current list
    const currentList = getTemporaryList();

    // Click the button
    getButton().click();

    // Check that the list has updated
    expect(currentList, 'the checked items should have been removed from the temporary list').to.not.deep.equal(getTemporaryList());
  });

  it('should hide the button if all checkboxes are checked', function () {
    // Click the button
    getButton().click();

    // Check that the button is not visible
    expect(getButton().style.display, 'the `Remove selected` button should not be displaying when no checkboxes are checked').to.equal('none');
  });
});
