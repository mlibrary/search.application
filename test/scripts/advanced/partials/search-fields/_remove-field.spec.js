import {
  getAllRemoveSearchFieldButtons,
  getRemoveSearchFieldButton,
  handleRemoveSearchField,
  removeSearchField
} from '../../../../../assets/scripts/advanced/partials/search-fields/_remove-field.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('search fields', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="advanced-search__search-field" id="search-field-1">
        <button class="advanced-search__remove-field" data-field-id="search-field-1">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-2">
        <button class="advanced-search__remove-field" data-field-id="search-field-2">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-3">
        <button class="advanced-search__remove-field" data-field-id="search-field-3">
          Remove field
        </button>
      </div>
    `;
  });

  describe('getAllRemoveSearchFieldButtons()', function () {
    it('should return all remove search field buttons', function () {
      expect(getAllRemoveSearchFieldButtons(), '`getAllRemoveSearchFieldButtons` should return all remove search field buttons').to.deep.equal(document.querySelectorAll('.advanced-search__remove-field'));
    });
  });

  describe('getRemoveSearchFieldButton()', function () {
    it('should return the remove search field button for a given search field', function () {
      const searchField = document.querySelector('.advanced-search__search-field');
      expect(getRemoveSearchFieldButton({ searchField }), '`getRemoveSearchFieldButton` should return the remove search field button for the given search field').to.equal(searchField.querySelector('.advanced-search__remove-field'));
    });
  });

  describe('handleRemoveSearchField()', function () {
    let dataFieldId = null;
    let getSearchField = null;
    let args = null;

    beforeEach(function () {
      dataFieldId = getAllRemoveSearchFieldButtons()[0].dataset.fieldId;
      getSearchField = (id = dataFieldId) => {
        return document.getElementById(id);
      };
      args = {
        id: dataFieldId
      };

      // Check that the field exists before calling the function
      expect(getSearchField(args.id), `'#${args.id}' should exist before calling the function`).to.exist;

      // Call the function
      handleRemoveSearchField(args);
    });

    afterEach(function () {
      dataFieldId = null;
      getSearchField = null;
      args = null;
    });

    it('should remove the search field element from the DOM when a remove button is clicked', function () {
      expect(getSearchField(args.id), `'#${args.id}' should not exist after calling the function`).to.not.exist;
    });
  });

  describe('removeSearchField()', function () {
    let handleRemoveSearchFieldSpy = null;
    let args = null;

    beforeEach(function () {
      handleRemoveSearchFieldSpy = sinon.spy();

      args = {
        handleRemoveField: handleRemoveSearchFieldSpy,
        removeSearchFieldButtons: getAllRemoveSearchFieldButtons()
      };

      // Call the function
      removeSearchField(args);
    });

    afterEach(function () {
      handleRemoveSearchFieldSpy = null;
      args = null;
    });

    it('should call `handleRemoveSearchField` with the correct arguments when a remove button is clicked', function () {
      // Loop through all the buttons
      args.removeSearchFieldButtons.forEach((button) => {
        // Simulate a click event on the button
        const event = new window.Event('click');
        button.dispatchEvent(event);
        // Get the field id
        const id = button.dataset.fieldId;
        // Check that `handleRemoveSearchField` was called with the correct arguments
        expect(handleRemoveSearchFieldSpy.calledWith({ id }), '`handleRemoveSearchField` should be called with the correct arguments').to.be.true;
      });
    });
  });
});
