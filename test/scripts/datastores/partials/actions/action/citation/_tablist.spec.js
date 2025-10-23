import { citationTabClick, getActiveCitationTab, getCitationTablist } from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_tablist.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('tablist', function () {
  let getTab = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <div role="tablist" class="citation__tablist">
          <button type="button" role="tab" aria-selected="true" aria-controls="citation__mla--tabpanel">
            MLA
          </button>
        </div>
      </div>
    `;

    getTab = () => {
      return document.querySelector('button[role="tab"]');
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

  describe('citationTabClick', function () {
    let toggleCopyCitationButtonSpy = null;

    beforeEach(function () {
      toggleCopyCitationButtonSpy = sinon.spy();

      // Call the function
      citationTabClick(toggleCopyCitationButtonSpy);
    });

    it('should call `toggleCopyCitationButton` when a tab gets clicked', function () {
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
    getTab = null;
  });
});
