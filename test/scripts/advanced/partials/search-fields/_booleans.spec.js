import {
  getBooleanGroup,
  updateBooleanGroup
} from '../../../../../assets/scripts/advanced/partials/search-fields/_booleans.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('boolean group', function () {
  let booleanGroup = null;
  let searchField = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="advanced-search__search-field">
        <div class="advanced-search__search-field--booleans">
          <input type="radio" value="AND">
          <input type="radio" value="OR" checked>
          <input type="radio" value="NOT">
        </div>
      </form>
    `;

    booleanGroup = () => {
      return document.querySelector('.advanced-search__search-field--booleans');
    };

    searchField = () => {
      return document.querySelector('.advanced-search__search-field');
    };
  });

  afterEach(function () {
    booleanGroup = null;
    searchField = null;
  });

  describe('getBooleanGroup()', function () {
    it('should return the boolean group element', function () {
      expect(getBooleanGroup({ searchField: searchField() }), '`getBooleanGroup` should return the boolean group element').to.deep.equal(booleanGroup());
    });
  });

  describe('updateBooleanGroup()', function () {
    let getBooleanGroupStub = null;
    let args = null;
    let getBooleanInputs = null;

    beforeEach(function () {
      getBooleanGroupStub = sinon.stub().returns(booleanGroup({ searchField }));
      args = {
        booleanGroup: getBooleanGroupStub,
        searchField
      };

      getBooleanInputs = () => {
        return booleanGroup({ searchField }).querySelectorAll('input[type="radio"]');
      };

      // Check that the first boolean input is not checked before calling the function
      expect(getBooleanInputs()[0].checked, 'the first boolean input should not be checked before calling the function').to.be.false;

      // Call the function
      updateBooleanGroup(args);
    });

    afterEach(function () {
      getBooleanGroupStub = null;
      args = null;
    });

    it('should call `getBooleanGroup` with the correct arguments', function () {
      expect(getBooleanGroupStub.calledWith({ searchField }), '`getBooleanGroup` should be called with the correct arguments').to.be.true;
    });

    it('should check the first boolean input and uncheck the others', function () {
      getBooleanInputs().forEach((booleanInput, index) => {
        if (index === 0) {
          expect(booleanInput.checked, 'the first boolean input should be checked').to.be.true;
        } else {
          expect(booleanInput.checked, `the boolean input at index ${index} should be unchecked`).to.be.false;
        }
      });
    });
  });
});
