import { expect } from 'chai';
import { getActiveCitationTabpanel } from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_tabpanel.js';

describe('copy-citation', function () {
  let getTabpanels = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <div id="citation__mla--tabpanel" role="tabpanel" class="citation__tabpanel" style="display: none;">
          <div class="alert alert__success actions__alert" style="display: none;">
            Citation copied to clipboard!
          </div>
          <div role="textbox" class="citation__input">
            This is an MLA citation.
          </div>
        </div>
        <div id="citation__apa--tabpanel" role="tabpanel" class="citation__tabpanel">
          <div class="alert alert__success actions__alert" style="display: block;">
            Citation copied to clipboard!
          </div>
          <div role="textbox" class="citation__input">
            This is an APA citation.
          </div>
        </div>
      </div>
    `;

    getTabpanels = () => {
      return document.querySelectorAll('.citation [role="tabpanel"]');
    };

    // Check that there is an active tabpanel
    expect([...getTabpanels()].some((tabpanel) => {
      return tabpanel.style.display !== 'none';
    })).to.be.true;
  });

  afterEach(function () {
    getTabpanels = null;
  });

  describe('getActiveCitationTabpanel', function () {
    it('should return the active citation tabpanel element', function () {
      // Check that the active tabpanel is not the first one
      expect(getActiveCitationTabpanel(), 'the active tabpanel should not equal to the first tabpanel').to.not.deep.equal(getTabpanels()[0]);

      // Check that the active tabpanel is the second one
      expect(getActiveCitationTabpanel(), 'the active tabpanel should equal to the second tabpanel').to.deep.equal(getTabpanels()[1]);
    });
  });
});
