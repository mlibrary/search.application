import {
  getYearElement,
  handleDateChanges,
  handleEndDateChange,
  handleStartDateChange,
  initializeYearChanges,
  toggleYearElement,
  toggleYearElements
} from '../../../../../../assets/scripts/advanced/partials/additional-options/date/_years.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('date year changes', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__date--years">
        <div class="additional-option__date--year additional-option__date--year-start">
          <label for="additional-option__date--year-start">
            <span>Start Date</span>
          </label>
          <input type="number" min="1000" max="2025" autocomplete="off" id="additional-option__date--year-start">
          <small>Please enter this format: YYYY</small>
        </div>
        <div class="additional-option__date--year additional-option__date--year-end">
          <label for="additional-option__date--year-end">
            <span>End Date</span>
          </label>
          <input type="number" min="1001" max="2026" autocomplete="off" id="additional-option__date--year-end">
          <small>Please enter this format: YYYY</small>
        </div>
      </div>
    `;
  });

  describe('getYearElement()', function () {
    it('should return the correct year element', function () {
      ['start', 'end'].forEach((year) => {
        expect(getYearElement({ year }), `\`getYearElement\` should return the correct element for the ${year} year`).to.deep.equal(document.querySelector(`.additional-option__date--year-${year}`));
      });
    });
  });

  describe('toggleYearElement()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        yearElement: getYearElement({ year: 'start' })
      };
    });

    afterEach(function () {
      args = null;
    });

    describe('when `hide` is true', function () {
      beforeEach(function () {
        // Set `hide` to true
        args.hide = true;

        // Call the function
        toggleYearElement(args);
      });
      it('should hide the year element when `hide` is true', function () {
        expect(args.yearElement.style.display).to.equal('none');
      });

      it('should disable the year input when `hide` is true', function () {
        expect(args.yearElement.querySelector('input').disabled).to.be.true;
      });
    });

    describe('when `hide` is false', function () {
      beforeEach(function () {
        // Set `hide` to false
        args.hide = false;

        // Call the function
        toggleYearElement(args);
      });

      it('should show the year element when `hide` is false', function () {
        expect(args.yearElement.style.display).to.equal('');
      });

      it('should enable the year input when `hide` is false', function () {
        expect(args.yearElement.querySelector('input').disabled).to.be.false;
      });
    });
  });

  describe('toggleYearElements()', function () {
    let toggleYearElementSpy = null;
    let args = null;

    beforeEach(function () {
      toggleYearElementSpy = sinon.spy();
      args = {
        endYear: getYearElement({ year: 'end' }),
        hideYearElement: toggleYearElementSpy,
        startYear: getYearElement({ year: 'start' }),
        value: 'Before'
      };

      // Call the function
      toggleYearElements(args);
    });

    afterEach(function () {
      toggleYearElementSpy = null;
      args = null;
    });

    it('should call `toggleYearElement` with the correct arguments', function () {
      const toggleYearElementArgs = {
        endYear: {
          hide: ['After', 'In'].includes(args.value),
          yearElement: args.endYear
        },
        startYear: {
          hide: args.value === 'Before',
          yearElement: args.startYear
        }
      };
      Object.keys(toggleYearElementArgs).forEach((key) => {
        expect(toggleYearElementSpy.calledWithExactly(toggleYearElementArgs[key]), `\`toggleYearElement\` should have been called with the correct arguments for the ${key}`).to.be.true;
      });
    });
  });

  describe('handleStartDateChange()', function () {
    let args = null;
    let event = null;

    beforeEach(function () {
      args = {
        endDateNumber: getYearElement({ year: 'end' }).querySelector('input'),
        startDateNumber: getYearElement({ year: 'start' }).querySelector('input')
      };

      // Add a value to the end year element
      args.endDateNumber.value = '2025';

      // Check that the end date input is enabled
      expect(args.endDateNumber.disabled, '`endDateNumber` should be enabled when the end date has a value').to.be.false;
    });

    afterEach(function () {
      args = null;
      event = null;
    });

    describe('when the start date is not empty', function () {
      beforeEach(function () {
        // Add a value to the start year element
        args.startDateNumber.value = '2020';

        // Call the function
        handleStartDateChange(args);

        // Simulate a change event
        event = new window.Event('change');
        args.startDateNumber.dispatchEvent(event);
      });

      it('should set the `min` attribute of the end date to be one more of the start date value', function () {
        expect(args.endDateNumber.min).to.equal(String(Number(args.startDateNumber.value) + 1));
      });

      it('should enable the end date input', function () {
        expect(args.endDateNumber.disabled, '`endDateNumber` should be enabled when the start date is not empty').to.be.false;
      });
    });

    describe('when the start date is empty', function () {
      beforeEach(function () {
        // Add a value to the start year element
        args.startDateNumber.value = '';

        // Call the function
        handleStartDateChange(args);

        // Simulate a change event
        event = new window.Event('change');
        args.startDateNumber.dispatchEvent(event);
      });

      it('should disable the end date input', function () {
        expect(args.endDateNumber.disabled, '`endDateNumber` should be disabled when the start date is empty').to.be.true;
      });

      it('should clear the value of the end date input', function () {
        expect(args.endDateNumber.value, '`endDateNumber` value should be cleared when the start date is empty').to.equal('');
      });
    });
  });

  describe('handleEndDateChange()', function () {
    let args = null;
    let event = null;

    beforeEach(function () {
      args = {
        endDateNumber: getYearElement({ year: 'end' }).querySelector('input'),
        startDateNumber: getYearElement({ year: 'start' }).querySelector('input')
      };

      // Add a value to the end year element
      args.endDateNumber.value = '2025';

      // Call the function
      handleEndDateChange(args);

      // Simulate a change event
      event = new window.Event('change');
      args.endDateNumber.dispatchEvent(event);
    });

    afterEach(function () {
      args = null;
      event = null;
    });

    it('should set the `max` attribute of the start date to be one less of the end date value', function () {
      expect(args.startDateNumber.max).to.equal(String(Number(args.endDateNumber.value) - 1));
    });
  });

  describe('handleDateChanges()', function () {
    let handleEndDateChangeSpy = null;
    let handleStartDateChangeSpy = null;
    let args = null;

    beforeEach(function () {
      handleEndDateChangeSpy = sinon.spy();
      handleStartDateChangeSpy = sinon.spy();
      args = {
        endDateChange: handleEndDateChangeSpy,
        endDateNumber: getYearElement({ year: 'end' }).querySelector('input'),
        startDateChange: handleStartDateChangeSpy,
        startDateNumber: getYearElement({ year: 'start' }).querySelector('input')
      };

      // Call the function
      handleDateChanges(args);
    });

    afterEach(function () {
      handleEndDateChangeSpy = null;
      handleStartDateChangeSpy = null;
      args = null;
    });

    it('should call `handleStartDateChange` with the correct arguments', function () {
      expect(handleStartDateChangeSpy.calledOnceWithExactly({ endDateNumber: args.endDateNumber, startDateNumber: args.startDateNumber }), '`handleStartDateChange` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `handleEndDateChange` with the correct arguments', function () {
      expect(handleEndDateChangeSpy.calledOnceWithExactly({ endDateNumber: args.endDateNumber, startDateNumber: args.startDateNumber }), '`handleEndDateChange` should have been called once with the correct arguments').to.be.true;
    });
  });

  describe('initializeYearChanges()', function () {
    let getYearElementStub = null;
    let handleDateChangesSpy = null;
    let args = null;

    beforeEach(function () {
      getYearElementStub = sinon.stub().callsFake(({ year }) => {
        return getYearElement({ year });
      });
      handleDateChangesSpy = sinon.spy();
      args = {
        dateChanges: handleDateChangesSpy,
        yearElement: getYearElementStub
      };

      // Call the function
      initializeYearChanges(args);
    });

    afterEach(function () {
      getYearElementStub = null;
      handleDateChangesSpy = null;
      args = null;
    });

    it('should call `getYearElement` with the correct arguments', function () {
      ['start', 'end'].forEach((year) => {
        expect(getYearElementStub.calledWithExactly({ year }), `\`getYearElement\` should have been called with the correct arguments for the \`${year}\` year`).to.be.true;
      });
    });

    it('should call `handleDateChanges` with the correct arguments', function () {
      expect(handleDateChangesSpy.calledOnceWithExactly({ endDateNumber: getYearElementStub({ year: 'end' }).querySelector('input'), startDateNumber: getYearElementStub({ year: 'start' }).querySelector('input') }), '`handleDateChanges` should have been called once with the correct arguments').to.be.true;
    });

    it('should not throw if `getYearElement` input is missing', function () {
      // Stub `getYearElement` to return null to simulate missing input
      args.yearElement = sinon.stub().returns(null);
      // Check that `initializeYearChanges` does not throw when `getYearElement` returns null
      expect(() => {
        initializeYearChanges(args);
      }, '`initializeYearChanges` should not throw if `getYearElement` input is missing').to.not.throw();
    });
  });
});
