import {
  getRemoveSearchFieldButtons,
  getSearchField,
  handleRemoveSearchField,
  removeSearchField
} from '../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('search fields', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="search-field-1">
        <button class="advanced-search__remove-field" data-field-id="search-field-1">
          Remove field
        </button>
      </div>
      <div id="search-field-2">
        <button class="advanced-search__remove-field" data-field-id="search-field-2">
          Remove field
        </button>
      </div>
      <div id="search-field-3">
        <button class="advanced-search__remove-field" data-field-id="search-field-3">
          Remove field
        </button>
      </div>
    `;
  });

  describe('getSearchField()', function () {
    it('should return the search field element', function () {
      const id = 'search-field-1';
      expect(getSearchField({ id }), '`getSearchField` should return the correct search field element').to.deep.equal(document.getElementById(id));
    });
  });

  describe('getRemoveSearchFieldButtons()', function () {
    it('should return all remove search field buttons', function () {
      expect(getRemoveSearchFieldButtons(), '`getRemoveSearchFieldButtons` should return all remove search field buttons').to.deep.equal(document.querySelectorAll('.advanced-search__remove-field'));
    });
  });

  describe('handleRemoveSearchField()', function () {
    let dataFieldId = null;
    let getSearchFieldStub = null;
    let args = null;

    beforeEach(function () {
      dataFieldId = getRemoveSearchFieldButtons()[0].dataset.fieldId;
      getSearchFieldStub = sinon.stub().returns(getSearchField({ id: dataFieldId }));
      args = {
        id: dataFieldId,
        searchField: getSearchFieldStub
      };

      // Check that the field exists before calling the function
      expect(getSearchField({ id: args.id }), `'#${args.id}' should exist before calling the function`).to.exist;

      // Call the function
      handleRemoveSearchField(args);
    });

    afterEach(function () {
      dataFieldId = null;
      getSearchFieldStub = null;
      args = null;
    });

    it('should call `getSearchField` with the correct arguments when a remove button is clicked', function () {
      expect(getSearchFieldStub.calledWith({ id: args.id }), '`getSearchField` should be called with the correct arguments').to.be.true;
    });

    it('should remove the search field element from the DOM when a remove button is clicked', function () {
      expect(getSearchField({ id: args.id }), `'#${args.id}' should not exist after calling the function`).to.not.exist;
    });
  });

  describe('removeSearchField()', function () {
    let handleRemoveSearchFieldSpy = null;
    let args = null;

    beforeEach(function () {
      handleRemoveSearchFieldSpy = sinon.spy();

      args = {
        handleRemoveField: handleRemoveSearchFieldSpy,
        removeSearchFieldButtons: getRemoveSearchFieldButtons()
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
