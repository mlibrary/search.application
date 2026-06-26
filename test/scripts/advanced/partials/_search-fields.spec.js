import {
  getAllSearchFields,
  getLastSearchField,
  getSearchField
} from '../../../../assets/scripts/advanced/partials/_search-fields.js';
import { expect } from 'chai';

describe('search fields', function () {
  let searchFields = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="advanced-search__search-field" id="search-field-1">
        <button class="advanced-search__remove-field" data-field-id="search-field-0">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-2">
        <button class="advanced-search__remove-field" data-field-id="search-field-1">
          Remove field
        </button>
      </div>
      <div class="advanced-search__search-field" id="search-field-3">
        <button class="advanced-search__remove-field" data-field-id="search-field-2">
          Remove field
        </button>
      </div>
    `;

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

  describe('getSearchField()', function () {
    it('should return the search field element', function () {
      // Get the ID of the first search field
      const searchFieldId = searchFields()[0].id;
      // Check that `getSearchField` returns the correct element
      expect(getSearchField({ id: searchFieldId }), '`getSearchField` should return the correct search field element').to.deep.equal(document.getElementById(searchFieldId));
    });
  });
});
