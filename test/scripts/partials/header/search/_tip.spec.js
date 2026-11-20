import {
  displaySearchTip,
  getSearchTips,
  handleSearchTipChange
} from '../../../../../assets/scripts/partials/header/search/_tip.js';
import { expect } from 'chai';
import { getSearchOptionsDropdown } from '../../../../../assets/scripts/partials/header/search/_search-options.js';
import sinon from 'sinon';

// Mock data for tips
const options = [
  {
    name: 'Keyword',
    selected: false,
    tip: 'This is a tip for `keyword`.',
    value: 'keyword'
  },
  {
    name: 'Title',
    selected: false,
    tip: 'This is a tip for `title`.',
    value: 'title'
  },
  {
    name: 'Author',
    selected: false,
    tip: 'This is a tip for `author`.',
    value: 'author'
  },
  {
    name: 'No tip',
    selected: false,
    value: 'no_tip'
  }
];

const tips = options
  .filter((option) => {
    return 'tip' in option;
  })
  .map((option) => {
    return `
      <p class="search-form__tip" data-value="${option.value}" style="display: none;">
        ${option.tip}
      </p>
    `;
  })
  .join('');

describe('search tip', function () {
  let searchField = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="search-form">
        <select aria-label="Select an option" class="search-form__inputs--select">
          ${options.map((option) => {
            return `
              <option value="${option.value}" ${option.selected ? 'selected' : ''}>
                ${option.name}
              </option>
            `;
          }).join('')}
        </select>
        ${tips}
      </form>
    `;

    searchField = () => {
      return document.querySelector('.search-form');
    };
  });

  afterEach(function () {
    searchField = null;
  });

  describe('getSearchTips()', function () {
    it('should return all search tips', function () {
      expect(getSearchTips({ searchField: searchField() }), '`getSearchTips` should return all search tips').to.deep.equal(document.querySelectorAll('form.search-form .search-form__tip'));
    });
  });

  describe('handleSearchTipChange()', function () {
    let getSearchTipsStub = null;
    let args = null;

    beforeEach(function () {
      getSearchTipsStub = sinon.stub().returns(getSearchTips({ searchField: searchField() }));
      args = {
        searchField: searchField(),
        searchTips: getSearchTipsStub,
        value: options[1].value
      };

      // Call the function
      handleSearchTipChange(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should call `getSearchTips` with the correct arguments', function () {
      expect(getSearchTipsStub.calledWith({ searchField: searchField() }), '`handleSearchTipChange` should call `getSearchTips` with the correct arguments').to.be.true;
    });

    it('should toggle visibility of search tips based on the selected value', function () {
      args.searchTips().forEach((tip) => {
        if (tip.getAttribute('data-value') === args.value) {
          expect(tip.style.display, '`handleSearchTipChange` should display the tip matching the selected value').to.equal('flex');
        } else {
          expect(tip.style.display, '`handleSearchTipChange` should hide tips not matching the selected value').to.equal('none');
        }
      });
    });
  });

  describe('displaySearchTip()', function () {
    let handleSearchTipChangeStub = null;
    let getSearchOptionsDropdownStub = null;
    let args = null;

    beforeEach(function () {
      handleSearchTipChangeStub = sinon.stub();
      getSearchOptionsDropdownStub = sinon.stub().returns(getSearchOptionsDropdown({ searchField: searchField() }));
      args = {
        handleTipChange: handleSearchTipChangeStub,
        searchField: searchField(),
        searchOptionsDropdown: getSearchOptionsDropdownStub
      };
    });

    afterEach(function () {
      handleSearchTipChangeStub = null;
      getSearchOptionsDropdownStub = null;
      args = null;
    });

    it('should return early if there is no search field', function () {
      // Call the function with no search field
      displaySearchTip({ ...args, searchField: null });
      // Check that `handleSearchTipChange` was not called again
      expect(getSearchOptionsDropdownStub.calledOnce, '`displaySearchTip` should return early if there is no search field').to.be.false;
    });

    it('should return early if there is no search options dropdown', function () {
      // Call the function with no search options dropdown
      displaySearchTip({ ...args, searchOptionsDropdown: () => {
        return null;
      } });
      // Check that `handleSearchTipChange` was not called again
      expect(getSearchOptionsDropdownStub.calledOnce, '`getSearchOptionsDropdown` should have been called once').to.be.false;
      expect(handleSearchTipChangeStub.calledOnce, '`displaySearchTip` should return early if there is no search options dropdown').to.be.false;
    });

    it('should call `handleSearchTipChange` on load with the selected value', function () {
      // Call the function
      displaySearchTip(args);
      // Check that `handleSearchTipChange` was called with the selected value
      expect(handleSearchTipChangeStub.calledWith({ searchField: searchField(), value: args.searchOptionsDropdown().value }), '`displaySearchTip` should call `handleSearchTipChange` on load with the selected value').to.be.true;
    });

    it('should call `handleSearchTipChange` on change with the selected value', function () {
      // Call the function
      displaySearchTip(args);
      // Apply the change event
      const event = new window.Event('change');
      args.searchOptionsDropdown({ searchField: args.searchField }).dispatchEvent(event);
      // Check that `handleSearchTipChange` was called with the new value
      expect(handleSearchTipChangeStub.calledWith({ searchField: args.searchField, value: event.target.value }), '`displaySearchTip` should call `handleSearchTipChange` on change with the selected value').to.be.true;
    });
  });
});
