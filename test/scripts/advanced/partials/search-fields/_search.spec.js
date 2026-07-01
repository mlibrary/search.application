import {
  emptySearchInput,
  getSearchInput
} from '../../../../../assets/scripts/advanced/partials/search-fields/_search.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('search input', function () {
  let searchInput = null;
  let searchField = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="advanced-search__search-field">
        <input type="search" aria-label="Query input for search field 0" name="search-field-0" class="advanced-search__search-field--term-input" value="example" autocomplete="on">
      </form>
    `;

    searchInput = () => {
      return document.querySelector('.advanced-search__search-field--term-input');
    };

    searchField = () => {
      return document.querySelector('.advanced-search__search-field');
    };
  });

  afterEach(function () {
    searchInput = null;
    searchField = null;
  });

  describe('getSearchInput()', function () {
    it('should return the search input element', function () {
      expect(getSearchInput({ searchField: searchField() }), '`getSearchInput` should return the search input element').to.deep.equal(searchInput());
    });
  });

  describe('emptySearchInput()', function () {
    let getSearchInputStub = null;
    let args = null;

    beforeEach(function () {
      getSearchInputStub = sinon.stub().returns(getSearchInput({ searchField: searchField() }));
      args = {
        searchField: searchField(),
        searchInput: getSearchInputStub
      };

      // Check that the search input has a value before calling the function
      expect(searchInput().value, 'the search input should have a value before calling the function').to.not.equal('');

      // Call the function
      emptySearchInput(args);
    });

    afterEach(function () {
      getSearchInputStub = null;
      args = null;
    });

    it('should call `getSearchInput` with the correct arguments', function () {
      expect(getSearchInputStub.calledWith({ searchField: searchField() }), '`getSearchInput` should be called with the correct arguments').to.be.true;
    });

    it('should empty the search input value', function () {
      expect(searchInput().value, 'the search input should be empty after calling the function').to.equal('');
    });
  });
});
