import { cslData, displayCSLData, getCSLTextarea } from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_csl.js';
import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../../assets/scripts/datastores/list/layout.js';
import { selectedCitations } from '../../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import sinon from 'sinon';

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="record__checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
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

    // Grab CSL from temporary list
    citationCSLData = JSON.stringify(selectedCitations({ list: global.temporaryList, type: 'csl' }));
  });

  afterEach(function () {
    getTextArea = null;
    citationCSLData = null;
  });

  describe('getCSLTextarea()', function () {
    it('should return the CSL `textarea`', function () {
      expect(getCSLTextarea(), 'the `textarea` that displays the CSL should have been returned').to.deep.equal(getTextArea());
    });
  });

  describe('displayCSLData()', function () {
    it('should display the CSL data in the textarea', function () {
      // Call the function
      displayCSLData({ list: global.temporaryList });

      // Check the textarea content
      expect(getTextArea().textContent, 'the CSL data in the textarea should match the expected data').to.equal(citationCSLData);
    });

    it('should call `selectedCitations`', function () {
      const selectedCitationsSpy = sinon.spy();

      // Call the function
      displayCSLData({ getCitations: selectedCitationsSpy, list: global.temporaryList });

      // Check that the spy was called
      expect(selectedCitationsSpy.calledOnce, 'selectedCitations() should have been called').to.be.true;
    });
  });

  describe('cslData()', function () {
    it('should return the parsed CSL data from the textarea', function () {
      // Set the textarea content
      getTextArea().textContent = citationCSLData;

      // Check the returned data
      expect(cslData(), 'the returned CSL data should match the expected data').to.deep.equal(JSON.parse(citationCSLData));
    });
  });
});
