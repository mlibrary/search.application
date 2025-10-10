import { expect } from 'chai';
import { getActiveCitationTab } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_tablist.js';

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
      return document.querySelector('[role="tab"][aria-selected="true"]');
    };
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

  afterEach(function () {
    getTab = null;
  });
});
