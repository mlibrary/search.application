import {
  getBooleanGroup,
  getBooleanInputs,
  resetBooleanGroup,
  updateBooleanGroup,
  updateBooleanGroupLegend,
  updateBooleanInput,
  updateBooleanInputs
} from '../../../../../assets/scripts/advanced/partials/search-fields/_booleans.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('boolean group', function () {
  let searchField = null;
  let booleanGroup = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="advanced-search__search-field">
        <fieldset class="advanced-search__search-field--booleans" style="display: none;">
          <legend>Select a boolean operator for field 1</legend>
          <div class="checkbox">
            <input type="radio" id="AND-1" name="boolean-1" value="AND">
            <label for="AND-1">AND</label>
          </div>
          <div class="checkbox">
            <input type="radio" id="OR-1" name="boolean-1" value="OR" checked="">
            <label for="OR-1">OR</label>
          </div>
          <div class="checkbox">
            <input type="radio" id="NOT-1" name="boolean-1" value="NOT">
            <label for="NOT-1">NOT</label>
          </div>
        </fieldset>
      </form>
    `;

    searchField = () => {
      return document.querySelector('.advanced-search__search-field');
    };

    booleanGroup = () => {
      return document.querySelector('.advanced-search__search-field--booleans');
    };
  });

  afterEach(function () {
    searchField = null;
    booleanGroup = null;
  });

  describe('getBooleanGroup()', function () {
    it('should return the boolean group element', function () {
      expect(getBooleanGroup({ searchField: searchField() }), '`getBooleanGroup` should return the boolean group element').to.deep.equal(document.querySelector('.advanced-search__search-field--booleans'));
    });
  });

  describe('getBooleanInputs()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        booleanGroup: booleanGroup()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return the boolean input elements', function () {
      expect(getBooleanInputs(args), '`getBooleanInputs` should return the boolean input elements').to.deep.equal(document.querySelectorAll('input[type="radio"]'));
    });
  });

  describe('updateBooleanGroupLegend()', function () {
    let args = null;
    let legendText = null;
    let originalLegendText = null;

    beforeEach(function () {
      args = {
        booleanGroup: booleanGroup(),
        index: 2
      };

      legendText = () => {
        return document.querySelector('legend').textContent;
      };

      // Save the original legend text before calling the function
      originalLegendText = legendText();

      // Call the function
      updateBooleanGroupLegend(args);
    });

    afterEach(function () {
      args = null;
      legendText = null;
      originalLegendText = null;
    });

    it('should update the legend text to reflect the new index', function () {
      expect(legendText(), 'the legend text should be updated to reflect the new index').to.equal(originalLegendText.endsWith(` ${args.index}`) ? originalLegendText : `Select a boolean operator for field ${args.index}`);
    });
  });

  describe('updateBooleanInput()', function () {
    let args = null;
    let name = null;

    beforeEach(function () {
      args = {
        booleanInput: document.querySelector('input[type="radio"]'),
        index: 2
      };

      // Save the initial `name` attribute value before calling the function
      ({ name } = args.booleanInput);

      // Call the function
      updateBooleanInput(args);
    });

    afterEach(function () {
      args = null;
      name = null;
    });

    it('should update the `name` to reflect the new index', function () {
      expect(args.booleanInput.name, 'the `name` attribute value should be updated to reflect the new index').to.equal(name.endsWith(`-${args.index}`) ? name : `boolean-${args.index}`);
    });
  });

  describe('updateBooleanInputs()', function () {
    let getBooleanInputsStub = null;
    let updateBooleanInputSpy = null;
    let args = null;

    beforeEach(function () {
      getBooleanInputsStub = sinon.stub().callsFake((getBooleanInputsStubArgs) => {
        return getBooleanInputs({ booleanGroup: getBooleanInputsStubArgs.booleanGroup });
      });
      updateBooleanInputSpy = sinon.spy();
      args = {
        booleanGroup: booleanGroup(),
        booleanInputs: getBooleanInputsStub,
        index: 2,
        updateBoolean: updateBooleanInputSpy
      };

      // Call the function
      updateBooleanInputs(args);
    });

    afterEach(function () {
      getBooleanInputsStub = null;
      updateBooleanInputSpy = null;
      args = null;
    });

    it('should call `getBooleanInputs` with the correct arguments', function () {
      expect(getBooleanInputsStub.calledWith({ booleanGroup: args.booleanGroup }), '`getBooleanInputs` should be called with the correct arguments').to.be.true;
    });

    it('should call `updateBooleanInput` for each boolean input with the correct arguments', function () {
      args.booleanInputs({ booleanGroup: args.booleanGroup }).forEach((booleanInput) => {
        expect(updateBooleanInputSpy.calledWith({ booleanInput, index: args.index }), '`updateBooleanInput` should be called with the correct arguments').to.be.true;
      });
    });
  });

  describe('resetBooleanGroup()', function () {
    let getBooleanInputsStub = null;
    let args = null;

    beforeEach(function () {
      getBooleanInputsStub = sinon.stub().callsFake((getBooleanInputsStubArgs) => {
        return getBooleanInputs({ booleanGroup: getBooleanInputsStubArgs.booleanGroup });
      });
      args = {
        booleanGroup: booleanGroup(),
        booleanInputs: getBooleanInputsStub
      };

      // Check that the first boolean input is not checked before calling the function
      expect(getBooleanInputs({ booleanGroup: booleanGroup() })[0].checked, 'the first boolean input should not be checked before calling the function').to.be.false;

      // Call the function
      resetBooleanGroup(args);
    });

    afterEach(function () {
      getBooleanInputsStub = null;
      args = null;
    });

    it('should call `getBooleanInputs` with the correct arguments', function () {
      expect(getBooleanInputsStub.calledWith({ booleanGroup: args.booleanGroup }), '`getBooleanInputs` should be called with the correct arguments').to.be.true;
    });

    it('should check the first boolean input and uncheck the others', function () {
      args.booleanInputs({ booleanGroup: args.booleanGroup }).forEach((booleanInput, index) => {
        if (index === 0) {
          expect(booleanInput.checked, 'the first boolean input should be checked').to.be.true;
        } else {
          expect(booleanInput.checked, `the boolean input at index ${index} should be unchecked`).to.be.false;
        }
      });
    });
  });

  describe('updateBooleanGroup()', function () {
    let getBooleanGroupStub = null;
    let resetBooleanGroupStub = null;
    let updateBooleanInputsStub = null;
    let updateBooleanGroupLegendStub = null;
    let args = null;

    beforeEach(function () {
      getBooleanGroupStub = sinon.stub().callsFake((getBooleanGroupStubArgs) => {
        return getBooleanGroup({ searchField: getBooleanGroupStubArgs.searchField });
      });
      resetBooleanGroupStub = sinon.stub().callsFake((resetBooleanGroupStubArgs) => {
        return resetBooleanGroup({ booleanGroup: resetBooleanGroupStubArgs.booleanGroup });
      });
      updateBooleanInputsStub = sinon.stub().callsFake((updateBooleanInputsStubArgs) => {
        return updateBooleanInputs({ booleanGroup: updateBooleanInputsStubArgs.booleanGroup, index: updateBooleanInputsStubArgs.index });
      });
      updateBooleanGroupLegendStub = sinon.stub().callsFake((updateBooleanGroupLegendStubArgs) => {
        return updateBooleanGroupLegend({ booleanGroup: updateBooleanGroupLegendStubArgs.booleanGroup, index: updateBooleanGroupLegendStubArgs.index });
      });
      args = {
        getGroup: getBooleanGroupStub,
        index: 2,
        resetGroup: resetBooleanGroupStub,
        searchField: searchField(),
        updateInputs: updateBooleanInputsStub,
        updateLegend: updateBooleanGroupLegendStub
      };

      // Check that the boolean group is hidden before calling the function
      expect(getBooleanGroup({ searchField: args.searchField }).hasAttribute('style'), 'the boolean group should be hidden before calling the function').to.be.true;

      // Call the function
      updateBooleanGroup(args);
    });

    afterEach(function () {
      getBooleanGroupStub = null;
      resetBooleanGroupStub = null;
      updateBooleanInputsStub = null;
      updateBooleanGroupLegendStub = null;
      args = null;
    });

    it('should call `getBooleanGroup` with the correct arguments', function () {
      expect(getBooleanGroupStub.calledWith({ searchField: args.searchField }), '`getBooleanGroup` should be called with the correct arguments').to.be.true;
    });

    it('should remove the `style` attribute from the boolean group to make it visible', function () {
      expect(getBooleanGroupStub.returnValues[0].hasAttribute('style'), 'the `style` attribute should be removed from the boolean group to make it visible').to.be.false;
    });

    it('should call `updateBooleanGroupLegend` with the correct arguments', function () {
      expect(updateBooleanGroupLegendStub.calledWith({ booleanGroup: getBooleanGroupStub.returnValues[0], index: args.index }), '`updateBooleanGroupLegend` should be called with the correct arguments').to.be.true;
    });

    it('should call `updateBooleanInputs` with the correct arguments', function () {
      expect(updateBooleanInputsStub.calledWith({ booleanGroup: getBooleanGroupStub.returnValues[0], index: args.index }), '`updateBooleanInputs` should be called with the correct arguments').to.be.true;
    });

    it('should call `resetBooleanGroup` with the correct arguments', function () {
      expect(resetBooleanGroupStub.calledWith({ booleanGroup: getBooleanGroupStub.returnValues[0] }), '`resetBooleanGroup` should be called with the correct arguments').to.be.true;
    });
  });
});
