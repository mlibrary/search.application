import {
  addSearchField,
  appendClonedSearchField,
  cloneLastSearchField,
  getAddSearchFieldButton,
  handleAddSearchField,
  resetSearchFieldValues,
  updateSearchFieldAttributes
} from '../../../../../assets/scripts/advanced/partials/search-fields/_add-field.js';
import { getAllSearchFields, getLastSearchField } from '../../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';
import { getRemoveSearchFieldButton } from '../../../../../assets/scripts/advanced/partials/search-fields/_remove-field.js';
import sinon from 'sinon';

const searchFieldGroup = (index) => {
  return `
    <div class="advanced-search__search-field" id="search-field-${index}">
      <select class="search-form__inputs--select">
        <option value="keyword">Keyword</option>
        <option value="title" selected>Title</option>
        <option value="author">Author</option>
      </select>
      <input type="search" aria-label="Query input for search field ${index}" name="search-field-${index}" class="advanced-search__search-field--term-input" value="" autocomplete="on">
      <div class="advanced-search__search-field--booleans">
        <input type="radio" value="AND">
        <input type="radio" value="OR" checked>
        <input type="radio" value="NOT">
      </div>
      <button class="advanced-search__remove-field" data-field-id="search-field-${index}">
        Remove field
      </button>
    </div>
  `;
};

describe('search fields', function () {
  let addFieldButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      ${searchFieldGroup(4)}
      ${searchFieldGroup(1)}
      ${searchFieldGroup(23)}
      <button class="advanced-search__add-field">Add another field</button>
    `;

    addFieldButton = () => {
      return document.querySelector('.advanced-search__add-field');
    };
  });

  afterEach(function () {
    addFieldButton = null;
  });

  describe('getAddSearchFieldButton()', function () {
    it('should return the add search field button', function () {
      expect(getAddSearchFieldButton(), '`getAddSearchFieldButton` should return the add search field button').to.deep.equal(addFieldButton());
    });
  });

  describe('cloneLastSearchField()', function () {
    let args = null;
    let clonedField = null;

    beforeEach(function () {
      args = {
        searchField: getLastSearchField()
      };

      // Call the function
      clonedField = cloneLastSearchField(args);
    });

    afterEach(function () {
      args = null;
      clonedField = null;
    });

    it('should clone the last search field', function () {
      expect(clonedField.isEqualNode(args.searchField), '`cloneLastSearchField` should clone the last search field').to.be.true;
    });
  });

  describe('appendClonedSearchField()', function () {
    let cloneLastSearchFieldStub = null;
    let stubArgs = null;
    let args = null;
    let searchFieldCount = null;

    beforeEach(function () {
      stubArgs = {
        searchField: getAllSearchFields()[1]
      };
      cloneLastSearchFieldStub = sinon.stub().callsFake(({ searchField = stubArgs.searchField } = {}) => {
        return searchField.cloneNode(true);
      });

      args = {
        clonedSearchField: cloneLastSearchFieldStub,
        lastSearchField: getLastSearchField(),
        ...stubArgs
      };

      // Get the initial count of search fields
      searchFieldCount = getAllSearchFields().length;

      // Call the function
      appendClonedSearchField(args);
    });

    afterEach(function () {
      cloneLastSearchFieldStub = null;
      stubArgs = null;
      args = null;
      searchFieldCount = null;
    });

    it('should add a new search field to the DOM', function () {
      expect(getAllSearchFields().length, 'The number of search fields should increase by 1').to.equal(searchFieldCount + 1);
    });

    it('should append the cloned search field to be the last search field', function () {
      expect(args.lastSearchField.nextElementSibling, 'The newly cloned field should be the next sibling of the last search field').to.equal(getLastSearchField());
    });
  });

  describe('updateSearchFieldAttributes()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        allSearchFields: getAllSearchFields(),
        removeSearchFieldButton: sinon.stub().callsFake(({ searchField }) => {
          return getRemoveSearchFieldButton({ searchField });
        })
      };

      // Call the function
      updateSearchFieldAttributes(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the attributes of all search fields', function () {
      // Loop through all search fields and check the attributes
      args.allSearchFields.forEach((searchField, index) => {
        // Create the expected ID based on the index
        const expectedId = `search-field-${index}`;
        // Check the search field ID
        expect(searchField.id, `The id of search field ${index} should be updated to '${expectedId}'`).to.equal(expectedId);
        // Get the remove button in the search field
        const removeButton = args.removeSearchFieldButton({ searchField });
        // Check that the `data-field-id` of the remove button is updated to match the search field ID
        expect(removeButton.dataset.fieldId, `The data-field-id of the remove button for search field ${index} should be updated to '${expectedId}'`).to.equal(expectedId);
      });
    });
  });

  describe('resetSearchFieldValues()', function () {
    let emptySearchInputSpy = null;
    let updateBooleanGroupSpy = null;
    let updateSearchOptionsDropdownSpy = null;
    let args = null;

    beforeEach(function () {
      emptySearchInputSpy = sinon.spy();
      updateBooleanGroupSpy = sinon.spy();
      updateSearchOptionsDropdownSpy = sinon.spy();
      args = {
        emptyInput: emptySearchInputSpy,
        lastSearchField: getLastSearchField(),
        updateBoolean: updateBooleanGroupSpy,
        updateSearchOptions: updateSearchOptionsDropdownSpy
      };

      // Call the function
      resetSearchFieldValues(args);
    });

    afterEach(function () {
      emptySearchInputSpy = null;
      updateBooleanGroupSpy = null;
      updateSearchOptionsDropdownSpy = null;
      args = null;
    });

    it('should call `updateBoolean` with the correct arguments', function () {
      expect(updateBooleanGroupSpy.calledWith({ searchField: args.lastSearchField }), '`updateBoolean` should be called with the correct arguments').to.be.true;
    });

    it('should call `updateSearchOptions` with the correct arguments', function () {
      expect(updateSearchOptionsDropdownSpy.calledWith({ searchField: args.lastSearchField }), '`updateSearchOptions` should be called with the correct arguments').to.be.true;
    });

    it('should call `emptyInput` with the correct arguments', function () {
      expect(emptySearchInputSpy.calledWith({ searchField: args.lastSearchField }), '`emptyInput` should be called with the correct arguments').to.be.true;
    });
  });

  describe('handleAddSearchField()', function () {
    let appendClonedFieldSpy = null;
    let resetValuesSpy = null;
    let updateAttributesSpy = null;
    let args = null;

    beforeEach(function () {
      appendClonedFieldSpy = sinon.spy();
      resetValuesSpy = sinon.spy();
      updateAttributesSpy = sinon.spy();
      args = {
        appendClonedField: appendClonedFieldSpy,
        resetValues: resetValuesSpy,
        searchField: getLastSearchField(),
        updateAttributes: updateAttributesSpy
      };

      // Call the function
      handleAddSearchField(args);
    });

    afterEach(function () {
      appendClonedFieldSpy = null;
      resetValuesSpy = null;
      updateAttributesSpy = null;
      args = null;
    });

    it('should call `appendClonedSearchField` with the correct arguments', function () {
      expect(appendClonedFieldSpy.calledOnceWithExactly({ searchField: args.searchField }), '`appendClonedSearchField` should be called with the correct arguments').to.be.true;
    });

    it('should call `updateSearchFieldAttributes`', function () {
      expect(updateAttributesSpy.calledOnceWithExactly(), '`updateSearchFieldAttributes` should be called with the correct arguments').to.be.true;
    });

    it('should call `resetSearchFieldValues` with the correct arguments', function () {
      expect(resetValuesSpy.calledOnceWithExactly(), '`resetSearchFieldValues` should be called with the correct arguments').to.be.true;
    });
  });

  describe('addSearchField()', function () {
    let handleAddSearchFieldStub = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleAddSearchFieldStub = sinon.stub().callsFake(({ searchField }) => {
        return handleAddSearchField({ searchField });
      });

      args = {
        addSearchFieldButton: getAddSearchFieldButton(),
        handleAddSearch: handleAddSearchFieldStub,
        lastSearchField: getLastSearchField()
      };

      // Call the function
      addSearchField(args);

      // Simulate the click event on the add search field button
      event = new window.Event('click');
      args.addSearchFieldButton.dispatchEvent(event);
    });

    afterEach(function () {
      handleAddSearchFieldStub = null;
      args = null;
      event = null;
    });

    it('should call `handleAddSearchField` with the correct arguments on click', function () {
      expect(handleAddSearchFieldStub.calledOnceWithExactly({ searchField: args.lastSearchField }), '`handleAddSearchField` should be called once on click with the correct arguments').to.be.true;
    });
  });
});
