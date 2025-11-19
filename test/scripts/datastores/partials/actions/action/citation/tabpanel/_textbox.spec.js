import { attachTheCitations } from '../../../../../../../../assets/scripts/datastores/partials/actions/action/citation/tabpanel/_textbox.js';
import { expect } from 'chai';

describe('attachTheCitations()', function () {
  let args = null;
  let textboxHTML = null;

  beforeEach(function () {
    args = {
      getBibEntries: ['<p>Citation 1</p>', '<p>Citation 2</p>'],
      tabPanel: 'testTabPanel'
    };

    document.body.innerHTML = `
      <div class="citation">
        <div id="${args.tabPanel}">
          <div role="textbox"></div>
        </div>
        <button class="citation__copy" disabled>Copy citation</button>
      </div>
    `;

    textboxHTML = () => {
      return document.querySelector(`#${args.tabPanel} [role='textbox']`).innerHTML;
    };

    args.button = () => {
      return document.querySelector('button.citation__copy');
    };

    // Check that the button is initially disabled
    expect(args.button().hasAttribute('disabled'), 'the copy citation button should be initially disabled').to.be.true;
  });

  afterEach(function () {
    args = null;
    textboxHTML = null;
  });

  describe('has entries', function () {
    beforeEach(function () {
      // Check that there are bibliography entries for this test
      expect(args.getBibEntries.length, 'there should be bibliography entries for this test').to.be.greaterThan(0);

      // Call the function
      attachTheCitations(args.tabPanel, args.getBibEntries, args.button);
    });

    it('should set the `innerHTML` of the textbox to the joined bibliography entries', function () {
      expect(textboxHTML(), 'the `innerHTML` of the textbox should have been set to the joined bibliography entries').to.equal(args.getBibEntries.join(''));
    });

    it('should enable the copy citation button', function () {
      expect(args.button().hasAttribute('disabled'), 'the copy citation button should be enabled when there are entries').to.be.false;
    });
  });

  describe('no entries', function () {
    beforeEach(function () {
      args.getBibEntries = [];
      // Check that there are no bibliography entries for this test
      expect(args.getBibEntries.length, 'there should be no bibliography entries for this test').to.equal(0);

      // Call the function
      attachTheCitations(args.tabPanel, args.getBibEntries, args.button);
    });

    it('should set the `innerHTML` correctly when no entries are provided', function () {
      expect(textboxHTML(), 'the `innerHTML` of the textbox should be empty when no entries are provided').to.equal('<span class="citation__not-available">Citation not available.</span>');
    });

    it('should disable the copy citation button', function () {
      expect(args.button().hasAttribute('disabled'), 'the copy citation button should be disabled when there are no entries').to.be.true;
    });
  });
});
