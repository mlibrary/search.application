import {
  getSearchInput,
  resetSearchInputValue,
  updateSearchInput,
  updateSearchInputLabel
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

  describe('updateSearchInputLabel()', function () {
    let getSearchInputStub = null;
    let args = null;

    beforeEach(function () {
      getSearchInputStub = sinon.stub().callsFake((getSearchInputStubArgs) => {
        return getSearchInput({ searchField: getSearchInputStubArgs.searchField });
      });
      args = {
        index: 5,
        searchField: searchField(),
        searchInput: getSearchInputStub
      };

      // Call the function
      updateSearchInputLabel(args);
    });

    afterEach(function () {
      getSearchInputStub = null;
      args = null;
    });

    it('should call `getSearchInput` with the correct arguments', function () {
      expect(getSearchInputStub.calledWith({ searchField: searchField() }), '`getSearchInput` should be called with the correct arguments').to.be.true;
    });

    it('should update the `aria-label` attribute of the search input', function () {
      expect(searchInput().getAttribute('aria-label'), 'the `aria-label` attribute of the search input should be updated with the new index').to.equal(`Query input for search field ${args.index}`);
    });
  });

  describe('resetSearchInputValue()', function () {
    let getSearchInputStub = null;
    let args = null;

    beforeEach(function () {
      getSearchInputStub = sinon.stub().returns(getSearchInput({ searchField: searchField() }));
      args = {
        searchField: searchField(),
        searchInput: getSearchInputStub
      };

      // Call the function
      resetSearchInputValue(args);
    });

    afterEach(function () {
      getSearchInputStub = null;
      args = null;
    });

    it('should call `getSearchInput` with the correct arguments', function () {
      expect(getSearchInputStub.calledWith({ searchField: searchField() }), '`getSearchInput` should be called with the correct arguments').to.be.true;
    });

    it('should reset the value of the search input to an empty string', function () {
      expect(searchInput().value, 'the value of the search input should be reset to an empty string').to.equal('');
    });
  });

  describe('updateSearchInput()', function () {
    let updateSearchInputLabelSpy = null;
    let resetSearchInputValueSpy = null;
    let args = null;

    beforeEach(function () {
      updateSearchInputLabelSpy = sinon.spy();
      resetSearchInputValueSpy = sinon.spy();
      args = {
        index: 3,
        resetSearchInput: resetSearchInputValueSpy,
        searchField: searchField(),
        updateLabel: updateSearchInputLabelSpy
      };

      // Call the function
      updateSearchInput(args);
    });

    it('should call `updateSearchInputLabel` with the correct arguments', function () {
      expect(updateSearchInputLabelSpy.calledWith({ index: args.index, searchField: args.searchField }), '`updateSearchInputLabel` should be called with the correct arguments').to.be.true;
    });

    it('should call `resetSearchInputValue` with the correct arguments', function () {
      expect(resetSearchInputValueSpy.calledWith({ searchField: args.searchField }), '`resetSearchInputValue` should be called with the correct arguments').to.be.true;
    });
  });
});
