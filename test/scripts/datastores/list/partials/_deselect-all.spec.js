import deselectAll from '../../../../../assets/scripts/datastores/list/partials/_deselect-all.js';
import { expect } from 'chai';

describe('deselectAll', function () {
  let getButton = null;
  let someCheckboxesChecked = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--deselect-all">Deselect all</button>
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

    // Call the function
    deselectAll();
  });

  afterEach(function () {
    getButton = null;
    someCheckboxesChecked = null;
  });

  it('should show the button if some checkboxes are checked', function () {
    // Check to make sure some checkboxes are checked
    expect(someCheckboxesChecked(), 'some checkboxes should be checked').to.be.true;

    // Check that the button is visible
    expect(getButton().hasAttribute('style'), 'the `Deselect all` button should be displaying when some checkboxes are checked').to.be.false;
  });

  it('should deselect all the checkboxes', function () {
    // Call the function
    deselectAll();

    // Click the button
    getButton().click();

    // Check to make sure all checkboxes are not checked
    expect(someCheckboxesChecked(), 'all checkboxes should not be checked').to.be.false;
  });

  it('should hide the button if no checkboxes are checked', function () {
    // Click the button
    getButton().click();

    // Call the function again
    deselectAll();

    // Check that the button is not visible
    expect(getButton().style.display, 'the `Deselect all` button should not be displaying when no checkboxes are checked').to.equal('none');
  });
});
