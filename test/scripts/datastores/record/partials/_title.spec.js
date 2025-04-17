import { expect } from 'chai';
import sinon from 'sinon';
import toggleTruncatedText from '../../../../../assets/scripts/datastores/record/partials/_title.js';

describe('toggleTruncatedText', function () {
  let getText = null;
  let getSpan = null;
  let getButton = null;
  const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae dapibus est. Phasellus sit amet metus fermentum, aliquet turpis ut, ultrices ligula. Duis tempus laoreet sollicitudin. Donec interdum scelerisque efficitur. Quisque justo in.';
  const characterCount = 180;
  const trimAmount = 60;
  const characterTrim = characterCount - trimAmount;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `<p data-truncate>${text}</p>`;

    getText = () => {
      return document.querySelector('[data-truncate]');
    };

    getSpan = () => {
      return getText().querySelector('span.truncate__text');
    };

    getButton = () => {
      return getText().querySelector('button.truncate__button');
    };
  });

  afterEach(function () {
    getText = null;
    getSpan = null;
    getButton = null;
  });

  describe('text', function () {
    it('should wrap the text', function () {
      // Check if the line length is greater or equal to 180
      expect(getText().textContent.length, `should have text length greater than or equal to ${characterCount}`).to.be.greaterThan(characterCount - 1);
      // Check if the span wrapper does not exist
      expect(getSpan(), 'should not have a span wrapper').to.be.null;

      // Call the function
      toggleTruncatedText();

      // Check if the span wrapper exists
      expect(getSpan(), 'should have a span wrapper').to.not.be.null;
    });

    it(`should show the first ${characterTrim} characters`, function () {
      // Check if the line length is greater or equal to 180
      expect(getText().textContent.length, `should have text length greater than or equal to ${characterCount}`).to.be.greaterThan(characterCount - 1);

      // Call the function
      toggleTruncatedText();

      // Check the length of the truncated text plus ellipses
      expect(getSpan().textContent.length, `should show the first ${characterTrim} plus ellipses`).to.equal(characterTrim + 3);
    });

    it('should override the character count', function () {
      // Override the character count
      const characterOverride = 100;
      getText().setAttribute('data-truncate', characterOverride);
      const newTrim = characterOverride - trimAmount;

      // Call the function
      toggleTruncatedText();

      // Check the length of the truncated text plus ellipses
      expect(getSpan().textContent.length, `should show the first ${newTrim} plus ellipses`).to.equal(newTrim + 3);
    });

    it('should not override the character count if not a number', function () {
      // Override the character count with a non-numeral
      getText().setAttribute('data-truncate', 'number');
      expect(getText().getAttribute('data-truncate'), 'should not be a number').to.not.be.a('number');

      // Call the function
      toggleTruncatedText();

      // Check the length of the truncated text plus ellipses
      expect(getSpan().textContent.length, `should show the first ${characterTrim} plus ellipses`).to.equal(characterTrim + 3);
    });

    it('should not truncate if child is a node', function () {
      // Override the HTML to include a node
      document.body.innerHTML = `<p data-truncate><span>${text}</span></p>`;

      // Call the function
      toggleTruncatedText();

      // Check that the full text is shown and is not wrapped
      expect(getText().textContent, 'should show the full text').to.equal(text);
      expect(getSpan(), 'should not have a span wrapper').to.be.null;
    });

    it('should not truncate if character count is below the limit', function () {
      // Shorten the text length to less than the default character count
      getText().textContent = text.substring(0, characterCount - 100);

      // Call the function
      toggleTruncatedText();

      // Check that the text is not wrapped
      expect(getSpan(), 'should not have a span wrapper').to.be.null;
    });

    it('should not truncate if attribute is below the minimum trim amount', function () {
      // Apply a low value to the attribute
      getText().setAttribute('data-truncate', trimAmount - 1);

      // Call the function
      toggleTruncatedText();

      // Check that the full text is shown and is not wrapped
      expect(getText().textContent, 'should show the full text').to.equal(text);
      expect(getSpan(), 'should not have a span wrapper').to.be.null;
    });
  });

  describe('button', function () {
    it('should show a button', function () {
      // Call the function
      toggleTruncatedText();

      // Check if the button exists
      expect(getButton(), 'should have a button').to.not.be.null;
    });

    it('should not show a button', function () {
      // Shorten the text length to less than the default character count
      document.body.innerHTML = `<span data-truncate>${text.substring(0, characterCount - 100)}</span>`;

      // Call the function
      toggleTruncatedText();

      // Check if the button does not exist
      expect(getButton(), 'should not have a button').to.be.null;
    });

    it('should not show a button if child is a node', function () {
      // Override the HTML to include a node
      document.body.innerHTML = `<p data-truncate><span>${text}</span></p>`;

      // Call the function
      toggleTruncatedText();

      // Check if the button does not exist
      expect(getButton(), 'should not have a button').to.be.null;
    });

    it('should not show a button if character count is below the limit', function () {
      // Shorten the text length to less than the default character count
      getText().textContent = text.substring(0, characterCount - 100);

      // Call the function
      toggleTruncatedText();

      // Check if the button does not exist
      expect(getButton(), 'should not have a button').to.be.null;
    });

    it('should toggle `aria-expanded`', function () {
      // Call the function
      toggleTruncatedText();

      // Get the button
      const button = getButton();

      // Check the length of the truncated text plus ellipses
      expect(button.getAttribute('aria-expanded'), 'should have `aria-expanded` set to `false` after initializing').to.equal('false');

      // Click the button to get the full text
      button.click();
      expect(button.getAttribute('aria-expanded'), 'should have `aria-expanded` set to `true` after expanding').to.equal('true');

      // Click the button to truncate the text again
      button.click();
      expect(button.getAttribute('aria-expanded'), 'should have `aria-expanded` set to `false` after collapsing').to.equal('false');
    });

    it('should control the correct element', function () {
      // Call the function
      toggleTruncatedText();

      // Check the `span` ID matches the `aria-controls` attribute
      expect(getButton().getAttribute('aria-controls'), 'should have a value that matches the `span` ID').to.equal(getSpan().id);
    });

    it('should toggle the truncated text on click', function () {
      // Call the function
      toggleTruncatedText();

      // Get the button
      const button = getButton();

      // Check the length of the truncated text plus ellipses
      expect(getSpan().textContent.length, `should show the first ${characterTrim} plus ellipses after initializing`).to.equal(characterTrim + 3);

      // Click the button to get the full text
      button.click();
      expect(getSpan().textContent.length, `should show the full text when expanded`).to.equal(text.length);

      // Click the button to truncate the text again
      button.click();
      expect(getSpan().textContent.length, `should show the first ${characterTrim} plus ellipses after collapsing`).to.equal(characterTrim + 3);
    });

    it('should toggle the button text on click', function () {
      // Call the function
      toggleTruncatedText();

      // Get the button
      const button = getButton();

      // Check that the button says "Show more"
      expect(button.innerHTML.trim(), 'should have button text "Show more" before click').to.equal('Show more');

      // Click the button to change the text
      button.click();
      expect(button.innerHTML.trim(), 'should have button text "Show less" after click').to.equal('Show less');

      // Click the button to change the text again
      button.click();
      expect(button.innerHTML.trim(), 'should have button text "Show more" before click').to.equal('Show more');
    });
  });

  describe('print listeners', function () {
    let addEventListenerStub = null;

    beforeEach(function () {
      // Stub the window.addEventListener method
      addEventListenerStub = sinon.stub(window, 'addEventListener');

      // Call the function
      toggleTruncatedText();
    });

    afterEach(function () {
      addEventListenerStub.restore();
    });

    it('should set up beforeprint event listener', function () {
      expect(addEventListenerStub.calledWith('beforeprint', sinon.match.func)).to.be.true;
    });

    it('should set up afterprint event listener', function () {
      expect(addEventListenerStub.calledWith('afterprint', sinon.match.func)).to.be.true;
    });
  });
});
