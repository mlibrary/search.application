import { expect } from 'chai';
import selectAll from '../../../../../assets/scripts/datastores/list/partials/_select-all.js';

describe('selectAll', function () {
  let getButton = null;
  let allCheckboxesChecked = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <button class="list__button--select-all">Select all</button>
      <input type="checkbox" class="list__item--checkbox" value="Item 1" checked>
      <input type="checkbox" class="list__item--checkbox" value="Item 2">
      <input type="checkbox" class="list__item--checkbox" value="Item 3">
    `;

    getButton = () => {
      return document.querySelector('button');
    };

    allCheckboxesChecked = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      return [...checkboxes].every((checkbox) => {
        return checkbox.checked;
      });
    };

    // Call the function
    selectAll();
  });

  afterEach(function () {
    getButton = null;
    allCheckboxesChecked = null;
  });

  it('should show the button if not all checkboxes are checked', function () {
    // Check to make sure not all checkboxes are checked
    expect(allCheckboxesChecked(), 'all checkboxes should not be checked').to.be.false;

    // Check that the button is visible
    expect(getButton().hasAttribute('style'), 'the `Select all` button should be visible when not all checkboxes are checked').to.be.false;
  });

  it('should select all the checkboxes', function () {
    // Click the button
    getButton().click();

    // Check to make sure not all checkboxes are checked
    expect(allCheckboxesChecked(), 'all checkboxes should be checked').to.be.true;
  });

  it('should hide the button if all checkboxes are checked', function () {
    // Click the button
    getButton().click();

    // Call the function again
    selectAll();

    // Check that the button is not visible
    expect(getButton().style.display, 'the `Select all` button should not be visible when all checkboxes are checked').to.equal('none');
  });
});
