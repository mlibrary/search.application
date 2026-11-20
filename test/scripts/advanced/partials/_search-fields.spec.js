import {
  cloneSearchField,
  getAllSearchFields,
  getLastSearchField,
  getSearchFieldIndex,
  initializeSearchFields,
  updateSearchField
} from '../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('search fields', function () {
  let searchFields = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = Array.from({ length: 3 }, (element, index) => {
      return `<div class="advanced-search__search-field" id="search-field-${index}"></div>`;
    }).join('');

    searchFields = () => {
      return document.querySelectorAll('.advanced-search__search-field');
    };
  });

  afterEach(function () {
    searchFields = null;
  });

  describe('getAllSearchFields()', function () {
    it('should return all search fields', function () {
      expect(getAllSearchFields(), '`getAllSearchFields` should return all search fields').to.deep.equal(searchFields());
    });
  });

  describe('getLastSearchField()', function () {
    it('should return the last search field', function () {
      expect(getLastSearchField(), '`getLastSearchField` should return the last search field').to.deep.equal(searchFields()[searchFields().length - 1]);
    });
  });

  describe('cloneSearchField()', function () {
    let args = null;
    let clonedField = null;

    beforeEach(function () {
      args = {
        searchField: getLastSearchField()
      };

      // Call the function
      clonedField = cloneSearchField(args);
    });

    afterEach(function () {
      args = null;
      clonedField = null;
    });

    it('should clone the last search field', function () {
      expect(clonedField.isEqualNode(args.searchField), '`cloneSearchField` should clone the last search field').to.be.true;
    });
  });

  describe('getSearchFieldIndex()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        searchField: getLastSearchField()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return the correct index of a search field', function () {
      expect(getSearchFieldIndex(args), '`getSearchFieldIndex` should return the correct index of the last search field').to.equal(searchFields().length - 1);
    });
  });

  describe('updateSearchField()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        index: 5,
        searchField: getLastSearchField()
      };

      // Call the function
      updateSearchField(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the `id` attribute of the search field', function () {
      expect(args.searchField.id, '`updateSearchField` should update the `id` attribute of the search field').to.equal(`search-field-${args.index}`);
    });
  });

  describe('initializeSearchFields()', function () {
    let addSearchFieldSpy = null;
    let removeSearchFieldSpy = null;
    let args = null;

    beforeEach(function () {
      addSearchFieldSpy = sinon.spy();
      removeSearchFieldSpy = sinon.spy();
      args = {
        addField: addSearchFieldSpy,
        removeField: removeSearchFieldSpy
      };

      // Call the function
      initializeSearchFields(args);
    });

    afterEach(function () {
      addSearchFieldSpy = null;
      removeSearchFieldSpy = null;
      args = null;
    });

    it('should call `addSearchField` with the correct arguments', function () {
      expect(addSearchFieldSpy.calledOnceWithExactly(), '`addSearchField` should have been called with the correct arguments').to.be.true;
    });

    it('should call `removeSearchField` with the correct arguments', function () {
      expect(removeSearchFieldSpy.calledOnceWithExactly(), '`removeSearchField` should have been called with the correct arguments').to.be.true;
    });
  });
});
