import { getActiveCitationTabpanel, getCitationAlert, getCitationInput } from '../../../../../../assets/scripts/datastores/partials/actions/citation/_tabpanel.js';
import { expect } from 'chai';

describe('copy-citation', function () {
  let getTabpanel = null;
  let getAlert = null;
  let getInput = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <div id="citation__mla--tabpanel" role="tabpanel" class="citation__tabpanel">
          <div class="alert alert__success actions__alert" style="display: block;">
            Citation copied to clipboard!
          </div>
          <div role="textbox" class="citation__input">
            This is an MLA citation.
          </div>
        </div>
      </div>
    `;

    getTabpanel = () => {
      return document.querySelector('[role="tabpanel"]');
    };

    getAlert = () => {
      return getTabpanel().querySelector('.alert');
    };

    getInput = () => {
      return getTabpanel().querySelector('[role="textbox"]');
    };

    // Check that there is an active tabpanel
    expect(getTabpanel().style.display, 'there should be an active tabpanel').to.not.equal('none');
  });

  describe('getActiveCitationTabpanel', function () {
    it('should return the active citation tabpanel element', function () {
      expect(getActiveCitationTabpanel()).to.deep.equal(getTabpanel());
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

  afterEach(function () {
    getTabpanel = null;
    getAlert = null;
    getInput = null;
  });
});
