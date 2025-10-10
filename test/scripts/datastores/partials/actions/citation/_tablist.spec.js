import { getActiveCitationTab, getCitationTablist, triggerCitationTabChange } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_tablist.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('tablist', function () {
  let getCitationCSL = null;
  let getTab = null;
  let getButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl">
          ${JSON.stringify(global.temporaryList)}
        </textarea>
        <div role="tablist" class="citation__tablist">
          <button type="button" role="tab" aria-selected="true" aria-controls="citation__mla--tabpanel">
            MLA
          </button>
        </div>
        <button class="citation__copy">Copy citation</button>
      </div>
    `;

    getCitationCSL = () => {
      return document.querySelector('.citation textarea.citation__csl')?.value?.trim();
    };

    getTab = () => {
      return document.querySelector('button[role="tab"]');
    };

    getButton = () => {
      return document.querySelector('button.citation__copy');
    };
  });

  describe('getCitationTablist', function () {
    it('should return the citation tablist', function () {
      expect(getCitationTablist()).to.deep.equal(document.querySelector('[role="tablist"]'));
    });
  });

  describe('getActiveCitationTab', function () {
    it('should return the active citation tab', function () {
      expect(getActiveCitationTab()).to.deep.equal(getTab());
    });

    it('should return `null` if no tabs are active', function () {
      getTab().setAttribute('aria-selected', 'false');
      expect(getActiveCitationTab()).to.be.null;
    });
  });

  describe('triggerCitationTabChange', function () {
    let toggleCopyCitationButtonSpy = null;

    beforeEach(function () {
      toggleCopyCitationButtonSpy = sinon.spy();

      // Check that CSL data exists
      expect(getCitationCSL(), 'CSL data should exist').to.not.be.empty.and.to.not.equal('[]');

      // Check that there is an active tab
      expect(getTab().getAttribute('aria-selected'), 'there should be an active tab').to.equal('true');

      // Check that the button is disabled at the start of each test
      expect(getButton().hasAttribute('disabled'), 'the copy citation button should be enabled').to.be.false;
    });

    it('should call `toggleCopyCitationButton` when a tab gets clicked', function () {
      // Call the function
      triggerCitationTabChange(toggleCopyCitationButtonSpy);

      // Click the tab
      const clickEvent = new window.Event('click', { bubbles: true });
      getTab().dispatchEvent(clickEvent);

      // Check that `toggleCopyCitationButton` was called
      expect(toggleCopyCitationButtonSpy.calledOnce, '`toggleCopyCitationButton` should be called once').to.be.true;
    });

    afterEach(function () {
      toggleCopyCitationButtonSpy = null;
    });
  });

  afterEach(function () {
    getCitationCSL = null;
    getTab = null;
    getButton = null;
  });
});
