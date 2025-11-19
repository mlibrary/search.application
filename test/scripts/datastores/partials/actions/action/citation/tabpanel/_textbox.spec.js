import { attachTheCitations } from '../../../../../../../../assets/scripts/datastores/partials/actions/action/citation/tabpanel/_textbox.js';
import { expect } from 'chai';

describe('attachTheCitations()', function () {
  let tabPanel = null;
  let getBibEntries = null;
  let textboxHTML = null;

  beforeEach(function () {
    tabPanel = 'testTabPanel';
    document.body.innerHTML = `
      <div id="${tabPanel}">
        <div role="textbox"></div>
      </div>
    `;

    getBibEntries = ['<p>Citation 1</p>', '<p>Citation 2</p>'];

    textboxHTML = () => {
      return document.querySelector(`#${tabPanel} [role='textbox']`).innerHTML;
    };
  });

  afterEach(function () {
    tabPanel = null;
    getBibEntries = null;
    textboxHTML = null;
  });

  it('should set the `innerHTML` of the textbox to the joined bibliography entries', function () {
    // Call the function
    attachTheCitations(tabPanel, getBibEntries);

    // Check that the `innerHTML` is set correctly
    expect(textboxHTML(), 'the `innerHTML` of the textbox should have been set to the joined bibliography entries').to.equal(getBibEntries.join('\n'));
  });

  it('should set the `innerHTML` correctly when no entries are provided', function () {
    // Call the function with no entries
    attachTheCitations(tabPanel, []);

    // Check that the `innerHTML` is empty
    expect(textboxHTML(), 'the `innerHTML` of the textbox should be empty when no entries are provided').to.equal('<span class="citation__not-available">Citation not available.</span>');
  });
});
