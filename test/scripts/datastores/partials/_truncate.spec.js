import {
  getTruncateButtonInformation,
  getTruncatedTextInformation,
  getTruncateTextButtons,
  handleTruncatedElements,
  toggleTruncateButton,
  toggleTruncatedElements,
  truncateText
} from '../../../../assets/scripts/datastores/partials/_truncate.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('truncate', function () {
  let controls = null;
  let getButton = null;

  beforeEach(function () {
    controls = [
      {
        count: 20,
        id: 'test-control-1'
      },
      {
        count: 50,
        id: 'test-control-2'
      }
    ];

    // Apply HTML to the body
    document.body.innerHTML = controls.map((control) => {
      const { count, id } = control;
      return `
        <div>
          <span id="${id}">This is some sample text that will be truncated if it exceeds the specified character count.</span>
          <button data-truncate="${count}" aria-controls="${id}" aria-expanded="true">Show less</button>
        </div>
      `;
    }).join('');

    getButton = () => {
      return document.querySelector('button');
    };
  });

  afterEach(function () {
    controls = null;
    getButton = null;
  });

  describe('getTruncateTextButtons()', function () {
    it('should return all buttons with the `data-truncate` attribute', function () {
      controls.forEach((control) => {
        expect([...getTruncateTextButtons()].includes(document.querySelector(`button[data-truncate="${control.count}"][aria-controls="${control.id}"]`)), `Button with data-truncate="${control.count}" and aria-controls="${control.id}" should be included`).to.be.true;
      });
    });
  });

  describe('getTruncateButtonInformation()', function () {
    let args = null;
    let calledFunction = null;

    beforeEach(function () {
      args = {
        button: document.querySelector(`button`),
        defaultCount: 100
      };

      // Call the function
      calledFunction = getTruncateButtonInformation(args);
    });

    afterEach(function () {
      args = null;
      calledFunction = null;
    });

    it('should return an object', function () {
      expect(calledFunction, '`getTruncateButtonInformation` should return an object').to.be.an('object');
    });

    it('should return the text content of the control element', function () {
      expect(calledFunction.text, '`getTruncateButtonInformation` should return the text content of the control element').to.equal(document.getElementById(args.button.getAttribute('aria-controls')).textContent.trim());
    });

    it('should return the character count from the attribute', function () {
      expect(calledFunction.count, '`getTruncateButtonInformation` should return the character count from the attribute').to.equal(Number(args.button.getAttribute('data-truncate')));
    });

    it('should return the default character count if the attribute is not a number', function () {
      // Set the `data-truncate` attribute to a non-numeric value
      args.button.setAttribute('data-truncate', 'not-a-number');

      // Call the function again
      calledFunction = getTruncateButtonInformation(args);

      // Check that the count is the default count
      expect(calledFunction.count, '`getTruncateButtonInformation` should return the default count if the attribute is not a number').to.equal(args.defaultCount);
    });
  });

  describe('getTruncatedTextInformation()', function () {
    let getTruncateButtonInformationStub = null;
    let args = null;
    let calledFunction = null;

    beforeEach(function () {
      getTruncateButtonInformationStub = sinon.stub().callsFake(({ button }) => {
        const { count, text } = getTruncateButtonInformation({ button });
        return { count, text };
      });
      args = {
        button: getButton(),
        getButtonInformation: getTruncateButtonInformationStub,
        trimCount: 10
      };

      // Call the function
      calledFunction = getTruncatedTextInformation(args);
    });

    afterEach(function () {
      getTruncateButtonInformationStub = null;
      args = null;
      calledFunction = null;
    });

    it('should call `getTruncateButtonInformation` with the correct arguments', function () {
      expect(getTruncateButtonInformationStub.calledWithExactly({ button: args.button }), '`getTruncateButtonInformation` should have been called with the correct arguments').to.be.true;
    });

    it('should return an object', function () {
      expect(calledFunction, '`getTruncatedTextInformation` should return an object').to.be.an('object');
    });

    it('should return the full text content of the control element', function () {
      expect(calledFunction.full, '`getTruncatedTextInformation` should return the full text content of the control element').to.equal(getTruncateButtonInformationStub.returnValues[0].text);
    });

    it('should return the truncated text of the control element', function () {
      expect(calledFunction.truncated, '`getTruncatedTextInformation` should return the truncated text of the control element').to.equal(`${getTruncateButtonInformationStub.returnValues[0].text.substring(0, getTruncateButtonInformationStub.returnValues[0].count - args.trimCount)}...`);
    });

    it('should return `null` for the truncated text of the control element', function () {
      // Set the `data-truncate` attribute to a value that is less than or equal to the trim count
      args.button.setAttribute('data-truncate', String(args.trimCount));

      // Call the function again
      calledFunction = getTruncatedTextInformation(args);

      // Check that the truncated text is `null`
      expect(calledFunction.truncated, '`getTruncatedTextInformation` should return `null` for the truncated text of the control element').to.be.null;
    });
  });

  describe('toggleTruncateButton()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        button: getButton(),
        isExpanded: !(getButton().getAttribute('aria-expanded') === 'true')
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should toggle the `aria-expanded` attribute', function () {
      // Get the current state of the button
      const currentlyExpanded = args.button.getAttribute('aria-expanded') === 'true';

      // Call the function
      toggleTruncateButton(args);

      // Check that the `aria-expanded` attribute has been updated
      expect(args.button.getAttribute('aria-expanded'), 'the `aria-expanded` attribute should have been updated').to.equal(String(!currentlyExpanded));
    });

    it('should toggle the button text', function () {
      // Get the current state of the button
      const currentText = args.button.textContent;

      // Call the function
      toggleTruncateButton(args);

      // Check that the button text has been updated
      expect(args.button.textContent, 'the button text should have been updated').to.not.equal(currentText);
    });
  });

  describe('toggleTruncatedElements()', function () {
    let toggleTruncateButtonSpy = null;
    let args = null;
    let currentExpanded = null;

    beforeEach(function () {
      toggleTruncateButtonSpy = sinon.spy();
      args = {
        button: getButton(),
        full: 'Full text',
        toggleButton: toggleTruncateButtonSpy,
        truncated: 'Truncated text'
      };

      // Call the function
      toggleTruncatedElements(args);

      // Get the current state of the button
      currentExpanded = args.button.getAttribute('aria-expanded') === 'true';
    });

    afterEach(function () {
      toggleTruncateButtonSpy = null;
      args = null;
      currentExpanded = null;
    });

    it('should toggle the element text content between full and truncated based on the button\'s expanded state', function () {
      const element = document.getElementById(args.button.getAttribute('aria-controls'));
      expect(element.textContent, 'the element text content should be toggled between full and truncated based on the button\'s expanded state').to.equal(currentExpanded ? args.truncated : args.full);
    });

    it('should call `toggleTruncateButton` with the correct arguments', function () {
      expect(args.toggleButton.calledWithExactly({ button: args.button, isExpanded: !currentExpanded }), '`toggleTruncateButton` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('handleTruncatedElements()', function () {
    let toggleTruncatedElementsSpy = null;
    let args = null;

    beforeEach(function () {
      toggleTruncatedElementsSpy = sinon.spy();
      args = {
        button: getButton(),
        full: 'Full text',
        toggleElements: toggleTruncatedElementsSpy,
        truncated: 'Truncated text'
      };

      // Call the function
      handleTruncatedElements(args);
    });

    afterEach(function () {
      toggleTruncatedElementsSpy = null;
      args = null;
    });

    it('should call `toggleTruncatedElements` with the correct arguments', function () {
      expect(toggleTruncatedElementsSpy.calledWithExactly({ button: args.button, full: args.full, truncated: args.truncated }), '`toggleTruncatedElements` should have been called with the correct arguments').to.be.true;
    });

    it('should call `toggleTruncatedElements` with the correct arguments when the button is clicked', function () {
      // Click the button
      args.button.click();

      // Check that `toggleTruncatedElements` was called with the correct arguments
      expect(toggleTruncatedElementsSpy.calledWithExactly({ button: args.button, full: args.full, truncated: args.truncated }), '`toggleTruncatedElements` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('truncateText()', function () {
    let getTruncatedTextInformationStub = null;
    let handleTruncatedElementsSpy = null;
    let args = null;

    beforeEach(function () {
      getTruncatedTextInformationStub = sinon.stub().callsFake(({ button }) => {
        return getTruncatedTextInformation({ button, trimCount: 10 });
      });
      handleTruncatedElementsSpy = sinon.spy();
      args = {
        buttons: getTruncateTextButtons(),
        getTextInformation: getTruncatedTextInformationStub,
        handleElements: handleTruncatedElementsSpy
      };

      // Call the function
      truncateText(args);
    });

    afterEach(function () {
      getTruncatedTextInformationStub = null;
      handleTruncatedElementsSpy = null;
      args = null;
    });

    it('should call `getTruncatedTextInformation` for each button', function () {
      args.buttons.forEach((button) => {
        expect(args.getTextInformation.calledWithExactly({ button }), '`getTruncatedTextInformation` should have been called with the correct arguments').to.be.true;
      });
    });

    it('should call `handleTruncatedElements` for each button that has truncated text', function () {
      args.buttons.forEach((button) => {
        const { full, truncated } = args.getTextInformation({ button });
        if (truncated) {
          expect(args.handleElements.calledWithExactly({ button, full, truncated }), '`handleTruncatedElements` should have been called with the correct arguments').to.be.true;
        }
      });
    });

    it('should hide buttons that do not have truncated text', function () {
      args.buttons.forEach((button) => {
        const { truncated } = args.getTextInformation({ button });
        if (!truncated) {
          expect(button.style.display, 'buttons that do not have truncated text should be hidden').to.equal('none');
        }
      });
    });
  });
});
