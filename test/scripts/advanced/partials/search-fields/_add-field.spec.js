import {
  addSearchField,
  appendClonedSearchField,
  cloneAndUpdateSearchField,
  getAddSearchFieldButton
} from '../../../../../assets/scripts/advanced/partials/search-fields/_add-field.js';
import { getAllSearchFields, getLastSearchField, getSearchFieldIndex } from '../../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';
import sinon from 'sinon';

const searchFieldGroup = (index) => {
  return `
    <div class="advanced-search__search-field" id="search-field-${index}">
      <fieldset class="advanced-search__search-field--booleans">
        <legend class="visually-hidden">Select a boolean operator for field ${index}</legend>
        <label class="label-wrapper">
          <input type="radio" name="boolean-${index}" value="AND">
          <span class="label-wrapper__text">AND</span>
        </label>
        <label class="label-wrapper">
          <input type="radio" name="boolean-${index}" value="OR" checked="">
          <span class="label-wrapper__text">OR</span>
        </label>
        <label class="label-wrapper">
          <input type="radio" name="boolean-${index}" value="NOT">
          <span class="label-wrapper__text">NOT</span>
        </label>
      </fieldset>
      <select aria-label="Select an option for search field ${index}" class="search-form__inputs--select" name="search_option" autocomplete="off">
        <option value="keyword">
          Keyword
        </option>
        <option value="title" selected="">
          Title
        </option>
        <option value="author">
          Author
        </option>
      </select>
      <input type="search" aria-label="Query input for search field ${index}" name="search-field-${index}" class="advanced-search__search-field--term-input" value="" autocomplete="on">
      <button class="advanced-search__remove-field" data-field-id="search-field-${index}">
        Remove field
      </button>
    </div>
  `;
};

describe('add search field', function () {
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

  describe('cloneAndUpdateSearchField()', function () {
    let cloneSearchFieldStub = null;
    let getSearchFieldIndexStub = null;
    let updateBooleanGroupSpy = null;
    let updateSearchOptionsDropdownSpy = null;
    let updateSearchFieldSpy = null;
    let updateRemoveSearchFieldButtonSpy = null;
    let updateSearchInputSpy = null;
    let args = null;

    beforeEach(function () {
      cloneSearchFieldStub = sinon.stub().returns(({ searchField }) => {
        return cloneAndUpdateSearchField({ searchField });
      });
      getSearchFieldIndexStub = sinon.stub().callsFake(({ searchField }) => {
        return getSearchFieldIndex({ searchField });
      });
      updateBooleanGroupSpy = sinon.spy();
      updateSearchOptionsDropdownSpy = sinon.spy();
      updateSearchFieldSpy = sinon.spy();
      updateRemoveSearchFieldButtonSpy = sinon.spy();
      updateSearchInputSpy = sinon.spy();

      args = {
        clonedSearchField: cloneSearchFieldStub,
        lastSearchField: getLastSearchField(),
        searchFieldIndex: getSearchFieldIndexStub,
        updateBooleans: updateBooleanGroupSpy,
        updateDropdown: updateSearchOptionsDropdownSpy,
        updateFieldAttributes: updateSearchFieldSpy,
        updateRemoveButton: updateRemoveSearchFieldButtonSpy,
        updateSearch: updateSearchInputSpy
      };

      // Call the function
      cloneAndUpdateSearchField(args);
    });

    afterEach(function () {
      cloneSearchFieldStub = null;
      getSearchFieldIndexStub = null;
      updateBooleanGroupSpy = null;
      updateSearchOptionsDropdownSpy = null;
      updateSearchFieldSpy = null;
      updateRemoveSearchFieldButtonSpy = null;
      updateSearchInputSpy = null;
      args = null;
    });

    it('should call `cloneSearchField` with the correct arguments', function () {
      expect(cloneSearchFieldStub.calledOnceWithExactly({ searchField: args.lastSearchField }), '`cloneSearchField` should be called once with the correct arguments').to.be.true;
    });

    it('should call `getSearchFieldIndex` with the correct arguments', function () {
      expect(getSearchFieldIndexStub.calledOnceWithExactly({ searchField: args.lastSearchField }), '`getSearchFieldIndex` should be called once with the correct arguments').to.be.true;
    });

    it('should update all elements of the cloned search field with the correct arguments', function () {
      const expectedArgs = {
        index: getSearchFieldIndexStub({ searchField: args.lastSearchField }) + 1,
        searchField: cloneSearchFieldStub({ searchField: args.lastSearchField })
      };

      ['updateFieldAttributes', 'updateBooleans', 'updateDropdown', 'updateSearch', 'updateRemoveButton'].forEach((method) => {
        expect(args[method].calledOnceWithExactly(expectedArgs), `\`${method}\` should be called once with the correct arguments`).to.be.true;
      });
    });

    it('should return the cloned search field', function () {
      const clonedField = cloneSearchFieldStub({ searchField: args.lastSearchField });
      expect(cloneAndUpdateSearchField(args), '`cloneAndUpdateSearchField` should return the cloned search field').to.equal(clonedField);
    });
  });

  describe('appendClonedSearchField()', function () {
    let args = null;
    let searchFieldCount = null;

    beforeEach(function () {
      args = {
        clonedSearchField: getLastSearchField().cloneNode(true),
        lastSearchField: getLastSearchField()
      };

      // Get the initial count of search fields
      searchFieldCount = getAllSearchFields().length;

      // Call the function
      appendClonedSearchField(args);
    });

    afterEach(function () {
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

  describe('addSearchField()', function () {
    let appendClonedSearchFieldStub = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      appendClonedSearchFieldStub = sinon.stub().returns(appendClonedSearchField());

      args = {
        addSearchFieldButton: getAddSearchFieldButton(),
        appendClonedField: appendClonedSearchFieldStub
      };

      // Call the function
      addSearchField(args);

      // Simulate the click event on the add search field button
      event = new window.Event('click');
      args.addSearchFieldButton.dispatchEvent(event);
    });

    afterEach(function () {
      appendClonedSearchFieldStub = null;
      args = null;
      event = null;
    });

    it('should call `appendClonedSearchField` with the correct arguments on click', function () {
      expect(appendClonedSearchFieldStub.calledOnceWithExactly(), '`appendClonedSearchField` should be called once on click with the correct arguments').to.be.true;
    });
  });
});
