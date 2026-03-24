import {
  cacheRISData,
  getRISTextarea,
  getSelectedRISData,
  risData,
  risDataCache,
  updateRISData
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/ris/_textarea.js';
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

describe('ris', function () {
  let listRISData = null;
  let getTextArea = null;

  beforeEach(function () {
    listRISData = getListCitationData({ list: global.temporaryList, type: 'ris' });

    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="action__ris">
        <textarea class="citation__ris">
          ${JSON.stringify(listRISData)}
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
    listRISData = null;
    getTextArea = null;
  });

  describe('risDataCache', function () {
    it('should be null initially', function () {
      expect(risDataCache, '`risDataCache` should be null initially').to.be.null;
    });
  });

  describe('getRISTextarea()', function () {
    it('should return the RIS `textarea`', function () {
      expect(getRISTextarea(), 'the `textarea` that displays the RIS should have been returned').to.deep.equal(getTextArea());
    });
  });

  describe('risData()', function () {
    it('should return the parsed RIS data from the textarea', function () {
      expect(risData(), 'the returned RIS data should match the expected data').to.deep.equal(JSON.parse(getTextArea().textContent));
    });
  });

  describe('cacheRISData()', function () {
    let getListCitationDataStub = null;
    let args = null;

    beforeEach(function () {
      getListCitationDataStub = sinon.stub().callsFake(({ list, type }) => {
        return getListCitationData({ list, type });
      });
      args = {
        data: risData(),
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
        cacheRISData({ ...args, temporaryList: false });
      });

      it('should not call `getListCitationData`', function () {
        expect(getListCitationDataStub.notCalled, 'getListCitationData() should not have been called').to.be.true;
      });

      it('should cache the RIS data from the textarea', function () {
        expect(risDataCache, 'the cached RIS data should match the expected data').to.deep.equal(args.data);
      });

      it('should clear the textarea content', function () {
        expect(args.textArea.textContent, 'the textarea content should be empty').to.equal('');
      });
    });

    describe('when viewing My Temporary List', function () {
      beforeEach(function () {
        // Call the function
        cacheRISData({ ...args, temporaryList: true });
      });

      it('should call `getListCitationData` with the correct arguments', function () {
        expect(getListCitationDataStub.calledOnceWithExactly({ list: global.temporaryList, type: 'ris' }), 'getListCitationData() should have been called').to.be.true;
      });

      it('should cache the RIS data from session storage', function () {
        expect(risDataCache, 'the cached RIS data should match the expected data').to.deep.equal(listRISData);
      });

      it('should clear the textarea content', function () {
        expect(args.textArea.textContent, 'the textarea content should be empty').to.equal('');
      });
    });
  });

  describe('getSelectedRISData()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        cachedData: listRISData,
        checkboxes: getCheckboxes()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return an array', function () {
      expect(Array.isArray(getSelectedRISData(args)), 'the returned selected RIS data should be an array').to.be.true;
    });

    it('should return the an array the same length as the checked checkboxes', function () {
      expect(getSelectedRISData(args).length, 'the length of the returned selected RIS data should match the number of checked checkboxes').to.equal(getCheckedCheckboxes().length);
    });

    it('should return only the selected RIS data', function () {
      // Call the function
      const selectedData = getSelectedRISData(args);
      // Loop through all the checkboxes
      args.checkboxes.forEach((checkbox, index) => {
        // Check if the checkbox is checked
        if (checkbox.checked) {
          // Check that the corresponding cached data is included in the returned data
          expect(selectedData, 'the returned selected RIS data should include the expected data').to.deep.include(args.cachedData[index]);
        } else {
          // Check that the corresponding cached data is not included in the returned data
          expect(selectedData, 'the returned selected RIS data should not include unselected data').to.not.deep.include(args.cachedData[index]);
        }
      });
    });
  });

  describe('updateRISData()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        getRISData: [listRISData[0]],
        textArea: getTextArea()
      };

      // Clear the textarea content
      args.textArea.textContent = '';

      // Check that the textarea is cleared
      expect(args.textArea.textContent, 'the textarea content should be empty before calling the function').to.equal('');

      // Call the function
      updateRISData(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the textarea with only the selected RIS data', function () {
      expect(args.textArea.textContent, 'the textarea content should match the expected selected RIS data').to.equal(JSON.stringify(args.getRISData));
    });
  });
});
