import {
  getAllRemoveSearchFieldButtons,
  getRemoveSearchFieldButton,
  handleRemoveSearchField,
  removeSearchField,
  removeSearchFieldEventListener,
  updateRemoveSearchFieldButton,
  updateRemoveSearchFieldButtonDataFieldId
} from '../../../../../assets/scripts/advanced/partials/search-fields/_remove-field.js';
import { expect } from 'chai';
import { getLastSearchField } from '../../../../../assets/scripts/advanced/partials/_search-fields.js';
import sinon from 'sinon';

describe('remove search field', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="advanced-search__search-field" id="search-field-1">
        <button class="advanced-search__remove-field" data-field-id="search-field-1" style="display: none;">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-2">
        <button class="advanced-search__remove-field" data-field-id="search-field-2" style="display: none;">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-3">
        <button class="advanced-search__remove-field" data-field-id="search-field-3" style="display: none;">
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

  describe('removeSearchFieldEventListener()', function () {
    let handleRemoveSearchFieldSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleRemoveSearchFieldSpy = sinon.spy();
      args = {
        handleRemoveField: handleRemoveSearchFieldSpy,
        removeSearchFieldButton: getAllRemoveSearchFieldButtons()[0]
      };

      // Call the function
      removeSearchFieldEventListener(args);

      // Click the button to trigger the event listener
      event = new window.Event('click', { bubbles: true });
      args.removeSearchFieldButton.dispatchEvent(event);
    });

    afterEach(function () {
      handleRemoveSearchFieldSpy = null;
      args = null;
      event = null;
    });

    it('should call the `handleRemoveSearchField` function with the correct arguments', function () {
      expect(handleRemoveSearchFieldSpy.calledWith({ id: args.removeSearchFieldButton.dataset.fieldId }), '`handleRemoveSearchField` should be called with the correct arguments').to.be.true;
    });
  });

  describe('updateRemoveSearchFieldButtonDataFieldId()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        index: 5,
        removeSearchFieldButton: getAllRemoveSearchFieldButtons()[0]
      };

      // Call the function
      updateRemoveSearchFieldButtonDataFieldId(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the `data-field-id` attribute value of the remove search field button', function () {
      expect(args.removeSearchFieldButton.dataset.fieldId, '`data-field-id` attribute value should be updated').to.equal(`search-field-${args.index}`);
    });
  });

  describe('updateRemoveSearchFieldButton()', function () {
    let removeSearchFieldButton = null;
    let getRemoveFieldButtonStub = null;
    let updateDataFieldIdSpy = null;
    let removeSearchFieldEventListenerSpy = null;
    let args = null;

    beforeEach(function () {
      getRemoveFieldButtonStub = sinon.stub().returns(getRemoveSearchFieldButton({ searchField: getLastSearchField() }));
      updateDataFieldIdSpy = sinon.spy();
      removeSearchFieldEventListenerSpy = sinon.spy();

      args = {
        getRemoveFieldButton: getRemoveFieldButtonStub,
        index: 5,
        removeSearchFieldEvent: removeSearchFieldEventListenerSpy,
        searchField: document.querySelector('.advanced-search__search-field'),
        updateDataFieldId: updateDataFieldIdSpy
      };

      // Check that the remove search field button has a `style` attribute before calling the function
      removeSearchFieldButton = getRemoveSearchFieldButton({ searchField: args.searchField });
      expect(removeSearchFieldButton.hasAttribute('style'), 'the remove search field button should have a `style` attribute before calling the function').to.be.true;

      // Call the function
      updateRemoveSearchFieldButton(args);
    });

    afterEach(function () {
      removeSearchFieldButton = null;
      getRemoveFieldButtonStub = null;
      updateDataFieldIdSpy = null;
      removeSearchFieldEventListenerSpy = null;
      args = null;
    });

    it('should call `getRemoveSearchFieldButton` with the correct arguments', function () {
      expect(getRemoveFieldButtonStub.calledWith({ searchField: args.searchField }), '`getRemoveSearchFieldButton` should be called with the correct arguments').to.be.true;
    });

    it('should call `updateRemoveSearchFieldButtonDataFieldId` with the correct arguments', function () {
      expect(updateDataFieldIdSpy.calledWith({ index: args.index, removeSearchFieldButton: args.getRemoveFieldButton() }), '`updateRemoveSearchFieldButtonDataFieldId` should be called with the correct arguments').to.be.true;
    });

    it('should remove the `style` attribute from the remove search field button', function () {
      expect(args.getRemoveFieldButton().hasAttribute('style'), 'the remove search field button should not have a `style` attribute').to.be.false;
    });

    it('should call `removeSearchFieldEventListener` with the correct arguments', function () {
      expect(removeSearchFieldEventListenerSpy.calledWith({ removeSearchFieldButton: args.getRemoveFieldButton() }), '`removeSearchFieldEventListener` should be called with the correct arguments').to.be.true;
    });
  });

  describe('removeSearchField()', function () {
    let removeSearchFieldEventListenerSpy = null;
    let args = null;

    beforeEach(function () {
      removeSearchFieldEventListenerSpy = sinon.spy();

      args = {
        removeSearchFieldButtons: getAllRemoveSearchFieldButtons(),
        removeSearchFieldEvent: removeSearchFieldEventListenerSpy
      };

      // Call the function
      removeSearchField(args);
    });

    afterEach(function () {
      removeSearchFieldEventListenerSpy = null;
      args = null;
    });

    it('should call `removeSearchFieldEventListener` with the correct arguments when a remove button is clicked', function () {
      // Loop through all the buttons
      args.removeSearchFieldButtons.forEach((removeSearchFieldButton) => {
        // Check that `removeSearchFieldEventListener` was called with the correct arguments
        expect(removeSearchFieldEventListenerSpy.calledWith({ removeSearchFieldButton }), '`removeSearchFieldEventListener` should be called with the correct arguments').to.be.true;
      });
    });
  });
});
