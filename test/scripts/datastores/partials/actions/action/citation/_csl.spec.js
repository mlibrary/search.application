import { citationCSLChange, cslData, displayCSLData, getCSLTextarea } from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_csl.js';
import { nonEmptyDatastores, viewingTemporaryList } from '../../../../../../../assets/scripts/datastores/list/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { selectedCitations } from '../../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import sinon from 'sinon';

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
  });
});

describe('csl', function () {
  let getTextArea = null;
  let citationCSLData = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl"></textarea>
      </div>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;

    getTextArea = () => {
      return document.querySelector('textarea');
    };

    global.sessionStorage = window.sessionStorage;

    // Set a temporary list in session storage
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));

    // Grab CSL from temporary list
    citationCSLData = JSON.stringify(selectedCitations('csl'));
  });

  afterEach(function () {
    getTextArea = null;
    citationCSLData = null;

    // Cleanup
    delete global.sessionStorage;
  });

  describe('getCSLTextarea', function () {
    it('should return the CSL `textarea`', function () {
      expect(getCSLTextarea(), 'the `textarea` that displays the CSL should have been returned').to.deep.equal(getTextArea());
    });
  });

  describe('displayCSLData', function () {
    describe('when not viewing the temporary list', function () {
      beforeEach(function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Call the function
        displayCSLData();
      });

      it('should not populate the textarea when not viewing the temporary list', function () {
        // Check that the textarea was not populated
        expect(getTextArea().textContent).to.not.equal(citationCSLData);
      });
    });

    describe('when viewing the temporary list', function () {
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
        expect(getTextArea().textContent, 'the CSL data should be displayed in the textarea').to.equal(citationCSLData);
      });
    });
  });

  describe('cslData', function () {
    beforeEach(function () {
      // Make sure there is displayed data to display
      displayCSLData();
    });

    it('should return parsed JSON from the CSL `textarea`', function () {
      // Check that the `textarea` has been parsed
      expect(cslData(), 'the content of the `textarea` should have been parsed').to.deep.equal(JSON.parse(getTextArea().textContent));
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
});
