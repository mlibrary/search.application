import { getActiveCitationTabpanel, getCitationAlert, getCitationInput } from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_tabpanel.js';
import { expect } from 'chai';

describe('copy-citation', function () {
  let getTabpanels = null;
  let getAlert = null;
  let getInput = null;

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

    getAlert = () => {
      return getTabpanels()[1].querySelector('.alert');
    };

    getInput = () => {
      return getTabpanels()[1].querySelector('[role="textbox"]');
    };

    // Check that there is an active tabpanel
    expect([...getTabpanels()].some((tabpanel) => {
      return tabpanel.style.display !== 'none';
    })).to.be.true;
  });

  afterEach(function () {
    getTabpanels = null;
    getAlert = null;
    getInput = null;
  });

  describe('getActiveCitationTabpanel', function () {
    it('should return the active citation tabpanel element', function () {
      // Check that the active tabpanel is not the first one
      expect(getActiveCitationTabpanel(), 'the active tabpanel should not equal to the first tabpanel').to.not.deep.equal(getTabpanels()[0]);

      // Check that the active tabpanel is the second one
      expect(getActiveCitationTabpanel(), 'the active tabpanel should equal to the second tabpanel').to.deep.equal(getTabpanels()[1]);
    });
  });

  describe('getCitationAlert', function () {
    it('should return the citation alert element within the active tabpanel', function () {
      expect(getCitationAlert()).to.deep.equal(getAlert());
    });
  });

  describe('getCitationInput', function () {
    it('should return the citation input element within the active tabpanel', function () {
      expect(getCitationInput()).to.deep.equal(getInput());
    });
  });
});
