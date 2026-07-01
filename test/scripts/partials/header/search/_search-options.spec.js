import {
  getSearchOptions,
  getSearchOptionsDropdown,
  updateSearchOptionsDropdown
} from '../../../../../assets/scripts/partials/header/search/_search-options.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('search options dropdown', function () {
  let searchField = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="advanced-search__search-field">
        <select class="search-form__inputs--select">
          <option value="keyword">Keyword</option>
          <option value="title" selected>Title</option>
          <option value="author">Author</option>
        </select>
      </form>
    `;

    searchField = () => {
      return document.querySelector('.advanced-search__search-field');
    };
  });

  afterEach(function () {
    searchField = null;
  });

  describe('getSearchOptionsDropdown()', function () {
    it('should return the search options dropdown element', function () {
      expect(getSearchOptionsDropdown({ searchField: searchField() }), '`getSearchOptionsDropdown` should return the search options dropdown element').to.deep.equal(document.querySelector('select'));
    });
  });

  describe('getSearchOptions()', function () {
    it('should return a list of the search options', function () {
      expect(getSearchOptions({ searchField: searchField() }), '`getSearchOptions` should return a list of the search options').to.deep.equal(document.querySelectorAll('option'));
    });
  });

  describe('updateSearchOptionsDropdown()', function () {
    let getSearchOptionsStub = null;
    let args = null;

    beforeEach(function () {
      getSearchOptionsStub = sinon.stub().returns(document.querySelectorAll('option'));
      args = {
        searchField: searchField(),
        searchOptions: getSearchOptionsStub
      };

      // Check that the first option is not selected before calling the function
      expect(args.searchOptions()[0].selected, 'the first option should not be selected before calling the function').to.be.false;

      // Call the function
      updateSearchOptionsDropdown(args);
    });

    afterEach(function () {
      getSearchOptionsStub = null;
      args = null;
    });

    it('should call `getSearchOptions` with the correct arguments', function () {
      expect(getSearchOptionsStub.calledWith({ searchField: searchField() }), '`getSearchOptions` should be called with the correct arguments').to.be.true;
    });

    it('should set the first option as selected and the others as not selected', function () {
      args.searchOptions().forEach((option, index) => {
        if (index === 0) {
          expect(option.selected, 'the first option should be selected').to.be.true;
        } else {
          expect(option.selected, `the option at index ${index} should not be selected`).to.be.false;
        }
      });
    });
  });
});
