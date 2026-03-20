import {
  cacheCSLData,
  cslData,
  cslDataCache,
  getCSLTextarea,
  getSelectedCSLData,
  updateCSLData
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/citation/_csl.js';
import { getCheckboxes, getCheckedCheckboxes } from '../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_checkbox.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../../assets/scripts/datastores/list/layout.js';
import { getListCitationData } from '../../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import sinon from 'sinon';

let temporaryListHTML = '';
getDatastores({ list: global.temporaryList }).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="record__checkbox" value="${datastore},${recordId}" ${index === 1 ? 'checked' : ''}></li>`;
  });
});

describe('csl', function () {
  let listCSLData = null;
  let getTextArea = null;

  beforeEach(function () {
    listCSLData = getListCitationData({ list: global.temporaryList, type: 'csl' });

    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl">
          ${JSON.stringify(listCSLData)}
        </textarea>
      </div>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;

    getTextArea = () => {
      return document.querySelector('textarea');
    };
  });

  afterEach(function () {
    listCSLData = null;
    getTextArea = null;
  });

  describe('getCSLTextarea()', function () {
    it('should return the CSL `textarea`', function () {
      expect(getCSLTextarea(), 'the `textarea` that displays the CSL should have been returned').to.deep.equal(getTextArea());
    });
  });

  describe('cslData()', function () {
    it('should return the parsed CSL data from the textarea', function () {
      expect(cslData(), 'the returned CSL data should match the expected data').to.deep.equal(JSON.parse(getTextArea().textContent));
    });
  });

  describe('cacheCSLData()', function () {
    let getListCitationDataStub = null;
    let args = null;

    beforeEach(function () {
      getListCitationDataStub = sinon.stub().callsFake(({ list, type }) => {
        return getListCitationData({ list, type });
      });
      args = {
        data: cslData(),
        getListData: getListCitationDataStub,
        list: global.temporaryList,
        textArea: getTextArea()
      };

      // Check that the textarea has content before calling the function
      expect(args.textArea.textContent, 'the textarea content should not be empty before calling the function').to.not.equal('');
    });

    afterEach(function () {
      getListCitationDataStub = null;
      args = null;
    });

    describe('when not viewing My Temporary List', function () {
      beforeEach(function () {
        // Call the function
        cacheCSLData({ ...args, temporaryList: false });
      });

      it('should not call `getListCitationData`', function () {
        expect(getListCitationDataStub.notCalled, 'getListCitationData() should not have been called').to.be.true;
      });

      it('should cache the CSL data from the textarea', function () {
        expect(cslDataCache, 'the cached CSL data should match the expected data').to.deep.equal(args.data);
      });

      it('should clear the textarea content', function () {
        expect(args.textArea.textContent, 'the textarea content should be empty').to.equal('');
      });
    });

    describe('when viewing My Temporary List', function () {
      beforeEach(function () {
        // Call the function
        cacheCSLData({ ...args, temporaryList: true });
      });

      it('should call `getListCitationData` with the correct arguments', function () {
        expect(getListCitationDataStub.calledOnceWithExactly({ list: global.temporaryList, type: 'csl' }), 'getListCitationData() should have been called').to.be.true;
      });

      it('should cache the CSL data from session storage', function () {
        expect(cslDataCache, 'the cached CSL data should match the expected data').to.deep.equal(listCSLData);
      });

      it('should clear the textarea content', function () {
        expect(args.textArea.textContent, 'the textarea content should be empty').to.equal('');
      });
    });
  });

  describe('getSelectedCSLData()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        cachedData: listCSLData,
        checkboxes: getCheckboxes()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return an array', function () {
      expect(Array.isArray(getSelectedCSLData(args)), 'the returned selected CSL data should be an array').to.be.true;
    });

    it('should return the an array the same length as the checked checkboxes', function () {
      expect(getSelectedCSLData(args).length, 'the length of the returned selected CSL data should match the number of checked checkboxes').to.equal(getCheckedCheckboxes().length);
    });

    it('should return only the selected CSL data', function () {
      // Call the function
      const selectedData = getSelectedCSLData(args);
      // Loop through all the checkboxes
      args.checkboxes.forEach((checkbox, index) => {
        // Check if the checkbox is checked
        if (checkbox.checked) {
          // Check that the corresponding cached data is included in the returned data
          expect(selectedData, 'the returned selected CSL data should include the expected data').to.deep.include(args.cachedData[index]);
        } else {
          // Check that the corresponding cached data is not included in the returned data
          expect(selectedData, 'the returned selected CSL data should not include unselected data').to.not.deep.include(args.cachedData[index]);
        }
      });
    });
  });

  describe('updateCSLData()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        getCSLData: [listCSLData[0]],
        textArea: getTextArea()
      };

      // Clear the textarea content
      args.textArea.textContent = '';

      // Check that the textarea is cleared
      expect(args.textArea.textContent, 'the textarea content should be empty before calling the function').to.equal('');

      // Call the function
      updateCSLData(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the textarea with only the selected CSL data', function () {
      expect(args.textArea.textContent, 'the textarea content should match the expected selected CSL data').to.equal(JSON.stringify(args.getCSLData));
    });
  });
});
