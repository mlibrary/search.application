import { citationCSLChange, displayCSLData, generateCSLData, getCitationCSL } from '../../../../../../assets/scripts/datastores/partials/actions/action/citation/_csl.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import sinon from 'sinon';
import { viewingTemporaryList } from '../../../../../../assets/scripts/datastores/list/layout.js';

describe('csl', function () {
  let getTextArea = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl"></textarea>
      </div>
    `;

    getTextArea = () => {
      return document.querySelector('textarea');
    };
  });

  describe('getCitationCSL', function () {
    it('should return the citation CSL textarea', function () {
      expect(getCitationCSL()).to.deep.equal(getTextArea());
    });
  });

  describe('generateCSLData', function () {
    it('should return an array', function () {
      expect(generateCSLData(), 'the CSL data should be an array').to.be.an('array');
    });
  });

  describe('displayCSLData', function () {
    it('should not populate the textarea when not viewing the temporary list', function () {
      // Check that Temporary List is not being viewed
      expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

      // Call the function
      displayCSLData();

      // Check that the textarea was not populated
      expect(getTextArea().textContent).to.not.equal(JSON.stringify(generateCSLData()));
    });

    it('should populate the textarea with CSL data when viewing the temporary list', function () {
      // Setup JSDOM with an updated URL
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost/everything/list'
      });

      // Override the global window object
      global.window = dom.window;

      // Check that Temporary List is being viewed
      expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;

      // Call the function
      displayCSLData();

      // Check that the textarea was populated
      expect(getTextArea().textContent, 'the CSL data should be displayed in the textarea').to.equal(JSON.stringify(generateCSLData()));
    });
  });

  describe('citationCSLChange', function () {
    let toggleCopyCitationButtonSpy = null;

    beforeEach(function () {
      toggleCopyCitationButtonSpy = sinon.spy();

      // Call the function
      citationCSLChange(toggleCopyCitationButtonSpy);
    });

    it('should call `toggleCopyCitationButton` when the CSL data changes', function () {
      // Change the data
      const changeEvent = new window.Event('change', { bubbles: true });
      getTextArea().dispatchEvent(changeEvent);

      // Check that `toggleCopyCitationButton` was called
      expect(toggleCopyCitationButtonSpy.calledOnce, '`toggleCopyCitationButton` should be called once').to.be.true;
    });

    afterEach(function () {
      toggleCopyCitationButtonSpy = null;
    });
  });

  afterEach(function () {
    getTextArea = null;
  });
});
