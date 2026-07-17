import {
  addSearchField,
  appendClonedSearchField,
  getAddSearchFieldButton
} from '../../../../../assets/scripts/advanced/partials/search-fields/_add-field.js';
import { getAllSearchFields, getLastSearchField } from '../../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';
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

  describe('appendClonedSearchField()', function () {
    let cloneSearchFieldStub = null;
    let stubArgs = null;
    let args = null;
    let searchFieldCount = null;

    beforeEach(function () {
      stubArgs = {
        searchField: getAllSearchFields()[1]
      };
      cloneSearchFieldStub = sinon.stub().callsFake(({ searchField = stubArgs.searchField } = {}) => {
        return searchField.cloneNode(true);
      });

      args = {
        clonedSearchField: cloneSearchFieldStub,
        lastSearchField: getLastSearchField(),
        ...stubArgs
      };

      // Get the initial count of search fields
      searchFieldCount = getAllSearchFields().length;

      // Call the function
      appendClonedSearchField(args);
    });

    afterEach(function () {
      cloneSearchFieldStub = null;
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

  describe('addSearchField()', function () {
    let appendClonedSearchFieldStub = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      appendClonedSearchFieldStub = sinon.stub().callsFake(({ searchField }) => {
        return appendClonedSearchField({ searchField });
      });

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
