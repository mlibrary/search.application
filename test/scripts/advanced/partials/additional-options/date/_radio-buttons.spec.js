import {
  getDateTypeFieldset,
  handleDateTypeChanges,
  initializeDateTypes
} from '../../../../../../assets/scripts/advanced/partials/additional-options/date/_radio-buttons.js';
import { expect } from 'chai';
import { getYearElement } from '../../../../../../assets/scripts/advanced/partials/additional-options/date/_years.js';
import sinon from 'sinon';

describe('date radio buttons', function () {
  let getFieldset = null;
  let getRadioButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <fieldset class="additional-option__date--types">
        <legend class="visually-hidden">Select date type</legend>
        <label class="label-wrapper additional-option__date--types-type" data-filter-value="Before">
          <input type="radio" name="date_of_publication" value="Before" checked="">
          <span>Before</span>
        </label>
        <label class="label-wrapper additional-option__date--types-type" data-filter-value="After">
          <input type="radio" name="date_of_publication" value="After">
          <span>After</span>
        </label>
        <label class="label-wrapper additional-option__date--types-type" data-filter-value="Between">
          <input type="radio" name="date_of_publication" value="Between">
          <span>Between</span>
        </label>
        <label class="label-wrapper additional-option__date--types-type" data-filter-value="In">
          <input type="radio" name="date_of_publication" value="In">
          <span>In</span>
        </label>
      </fieldset>
    `;

    getFieldset = () => {
      return getDateTypeFieldset();
    };

    getRadioButton = () => {
      return getFieldset().querySelector(`input[type="radio"]`);
    };
  });

  afterEach(function () {
    getFieldset = null;
    getRadioButton = null;
  });

  describe('getDateTypeFieldset()', function () {
    it('should return the date type fieldset element', function () {
      expect(getFieldset(), 'the correct fieldset should be returned').to.deep.equal(document.querySelector('.additional-option__date--types'));
    });
  });

  describe('handleDateTypeChanges()', function () {
    let toggleYearElementsSpy = null;
    let args = null;
    let event = null;
    let checkedRadioButton = null;

    beforeEach(function () {
      toggleYearElementsSpy = sinon.spy();
      args = {
        endYear: getYearElement({ year: 'end' }),
        fieldset: getFieldset(),
        startYear: getYearElement({ year: 'start' }),
        toggleYears: toggleYearElementsSpy
      };

      // Call the function
      handleDateTypeChanges(args);

      // Create a change event
      event = new window.Event('change', { bubbles: true });

      // Make the radio button selected
      checkedRadioButton = getRadioButton();
      checkedRadioButton.checked = true;
      // Dispatch the change event
      checkedRadioButton.dispatchEvent(event);
    });

    afterEach(function () {
      toggleYearElementsSpy = null;
      args = null;
      event = null;
      checkedRadioButton = null;
    });

    it('should call `toggleYearElements` with the correct arguments when a radio button is changed', function () {
      expect(toggleYearElementsSpy.calledWith({ endYear: args.endYear, startYear: args.startYear, value: event.target.value }), '`toggleYearElements` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('initializeDateTypes()', function () {
    let getYearElementStub = null;
    let toggleYearElementsSpy = null;
    let handleDateTypeChangesSpy = null;
    let args = null;

    beforeEach(function () {
      getYearElementStub = sinon.stub().callsFake(({ year }) => {
        return getYearElement({ year });
      });
      toggleYearElementsSpy = sinon.spy();
      handleDateTypeChangesSpy = sinon.spy();
      args = {
        dateTypeChanges: handleDateTypeChangesSpy,
        fieldset: getFieldset(),
        getYear: getYearElementStub,
        toggleYears: toggleYearElementsSpy
      };

      // Call the function
      initializeDateTypes(args);
    });

    afterEach(function () {
      getYearElementStub = null;
      toggleYearElementsSpy = null;
      handleDateTypeChangesSpy = null;
      args = null;
    });

    it('should call `getYearElement` with the correct arguments', function () {
      ['start', 'end'].forEach((year) => {
        expect(getYearElementStub.calledWith({ year }), `\`getYearElement\` should have been called with the correct arguments for \`${year}\` year`).to.be.true;
      });
    });

    it('should call `toggleYearElements` with the correct arguments', function () {
      expect(toggleYearElementsSpy.calledWith({ endYear: args.getYear({ year: 'end' }), startYear: args.getYear({ year: 'start' }), value: getRadioButton().value || 'Before' }), '`toggleYearElements` should have been called with the correct arguments').to.be.true;
    });

    it('should call `handleDateTypeChanges` with the correct arguments', function () {
      expect(handleDateTypeChangesSpy.calledWith({ endYear: args.getYear({ year: 'end' }), fieldset: args.fieldset, startYear: args.getYear({ year: 'start' }) }), '`handleDateTypeChanges` should have been called with the correct arguments').to.be.true;
    });

    it('should not throw if the fieldset does not exist', function () {
      // Make the fieldset return null to simulate it not existing
      args.fieldset = null;
      // Check that `initializeDateTypes` does not throw when the fieldset is null
      expect(() => {
        return initializeDateTypes(args);
      }, '`initializeDateTypes` should not throw if the fieldset does not exist').to.not.throw();
    });
  });
});
