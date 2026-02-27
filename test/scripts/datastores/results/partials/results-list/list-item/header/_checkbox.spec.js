import {
  filterSelectedRecords,
  getCheckboxes,
  getCheckedCheckboxes,
  getListItemCheckbox,
  someCheckboxesChecked,
  splitCheckboxValue,
  toggleCheckedState,
  updateCheckbox,
  updateCheckboxLabel,
  updateCheckboxValue
} from '../../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_checkbox.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

let temporaryListHTML = '';
getDatastores({ list: global.temporaryList }).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="record__checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
  });
});

describe('checkbox', function () {
  let getListItem = null;
  let getCheckbox = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;

    getListItem = () => {
      return document.querySelector('li');
    };

    getCheckbox = () => {
      return document.querySelector('input[type="checkbox"]');
    };

    // Check that at least one checkbox is checked
    expect(someCheckboxesChecked(true), 'at least one checkbox should be checked for this test').to.be.true;
  });

  afterEach(function () {
    getListItem = null;
    getCheckbox = null;
  });

  describe('getCheckboxes()', function () {
    it('should return all the checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckboxes(), 'the correct elements should be returned').to.deep.equal(document.querySelectorAll('input[type="checkbox"]'));
    });
  });

  describe('toggleCheckedState()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        checkbox: getCheckbox(),
        isAdded: true,
        viewingRecord: false
      };

      // Check the checkbox is initially unchecked
      args.checkbox.checked = false;
      expect(args.checkbox.checked, 'the checkbox should be initially unchecked').to.be.false;

      // Check that not viewing a full record
      expect(args.viewingRecord, 'not viewing a full record for this test').to.be.false;

      // Call the function
      toggleCheckedState(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should check the checkbox if `isAdded` is true and not viewing a full record', function () {
      expect(args.checkbox.checked, 'the checkbox should be checked').to.be.true;
    });

    it('should uncheck the checkbox if `isAdded` is false and not viewing a full record', function () {
      // Check the checkbox
      args.checkbox.checked = true;
      expect(args.checkbox.checked, 'the checkbox should be initially checked').to.be.true;

      // Update the `isAdded` argument
      args.isAdded = false;
      expect(args.isAdded, 'the `isAdded` argument should be false').to.be.false;

      // Call the function again
      toggleCheckedState(args);

      // Check that the checkbox is unchecked
      expect(args.checkbox.checked, 'the checkbox should be unchecked').to.be.false;
    });

    it('should not change the checked state if viewing a full record', function () {
      // Store the initial checked state
      const initialCheckedState = args.checkbox.checked;
      expect(initialCheckedState, 'the initial checked state should be true').to.be.true;

      // Make sure `isAdded` is the opposite of the initial checked state
      args.isAdded = !initialCheckedState;
      expect(args.isAdded, 'the `isAdded` argument should be the opposite of the initial checked state').to.equal(!initialCheckedState);

      // Update the `viewingRecord` argument
      args.viewingRecord = true;
      expect(args.viewingRecord, 'the `viewingRecord` argument should be true').to.be.true;

      // Call the function again
      toggleCheckedState(args);

      // Check that the checked state has not changed
      expect(args.checkbox.checked, 'the checked state should not change when viewing a full record').to.equal(initialCheckedState);
    });
  });

  describe('getListItemCheckbox()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        listItem: getListItem()
      };
    });

    afterEach(function () {
      args = null;
    });

    it('should return the checkbox element within a list item', function () {
      expect(getListItemCheckbox(args), 'the correct checkbox should be returned').to.equal(args.listItem.querySelector('input[type="checkbox"].record__checkbox'));
    });
  });

  describe('updateCheckboxLabel()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        checkbox: getCheckbox(),
        title: 'New title'
      };

      // Call the function
      updateCheckboxLabel(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the `aria-label` attribute of the checkbox', function () {
      expect(args.checkbox.getAttribute('aria-label'), 'the `aria-label` attribute should be updated').to.equal(`Select ${args.title}`);
    });
  });

  describe('updateCheckboxValue()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        checkbox: getCheckbox(),
        recordDatastore: 'catalog',
        recordId: 1337
      };

      // Call the function
      updateCheckboxValue(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the `value` of the checkbox', function () {
      // Check that the `value` attribute has been updated
      expect(args.checkbox.value, 'the checkbox `value` should have been updated').to.equal(`${args.recordDatastore},${args.recordId}`);
    });
  });

  describe('updateCheckbox()', function () {
    let getListItemCheckboxStub = null;
    let updateCheckboxLabelSpy = null;
    let updateCheckboxValueSpy = null;
    let args = null;

    beforeEach(function () {
      getListItemCheckboxStub = sinon.stub().returns(getListItemCheckbox({ listItem: getListItem() }));
      updateCheckboxLabelSpy = sinon.spy();
      updateCheckboxValueSpy = sinon.spy();
      args = {
        getCheckbox: getListItemCheckboxStub,
        listItem: getListItem(),
        recordDatastore: 'catalog',
        recordId: 1337,
        title: 'Record title',
        updateLabel: updateCheckboxLabelSpy,
        updateValue: updateCheckboxValueSpy
      };

      // Call the function
      updateCheckbox(args);
    });

    afterEach(function () {
      getListItemCheckboxStub = null;
      updateCheckboxLabelSpy = null;
      updateCheckboxValueSpy = null;
      args = null;
    });

    it('should call `getListItemCheckbox` with the correct arguments', function () {
      expect(getListItemCheckboxStub.calledWith({ listItem: args.listItem }), '`getListItemCheckbox` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckboxLabel` with the correct arguments', function () {
      expect(updateCheckboxLabelSpy.calledWith({ checkbox: getListItemCheckbox({ listItem: args.listItem }), title: args.title }), '`updateCheckboxLabel` should have been called with the correct arguments').to.be.true;
    });

    it('should call `updateCheckboxValue` with the correct arguments', function () {
      expect(updateCheckboxValueSpy.calledWith({ checkbox: getListItemCheckbox({ listItem: args.listItem }), recordDatastore: args.recordDatastore, recordId: args.recordId }), '`updateCheckboxValue` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('splitCheckboxValue()', function () {
    it('should split the checkbox value into recordDatastore and recordId', function () {
      const { value } = getCheckbox();
      const { recordDatastore, recordId } = splitCheckboxValue({ value });
      const [expectedDatastore, expectedRecordId] = value.split(',');
      expect(recordDatastore, 'the recordDatastore should match the expected value').to.equal(expectedDatastore);
      expect(recordId, 'the recordId should match the expected value').to.equal(expectedRecordId);
    });
  });

  describe('getCheckedCheckboxes', function () {
    it('should return only the checked checkboxes in the temporary list', function () {
      // Check that the correct elements are returned
      expect(getCheckedCheckboxes(), 'only the checked checkboxes should be returned').to.deep.equal(document.querySelectorAll('input[type="checkbox"]:checked'));
    });

    it('should return an empty NodeList if no checkboxes are checked', function () {
      // Remove the checked attribute from all checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Check that an empty NodeList is returned
      expect(getCheckedCheckboxes().length, 'an empty NodeList should be returned if no checkboxes are checked').to.equal(0);
    });
  });

  describe('filterSelectedRecords', function () {
    it('should return an array of the selected record IDs', function () {
      // Check that the correct record IDs are returned
      const selectedRecords = [...getCheckedCheckboxes()].map((checkbox) => {
        return checkbox.value;
      });
      expect(filterSelectedRecords(), 'the correct record IDs should be returned').to.deep.equal(selectedRecords);
    });

    it('should return an array, even if no records are checked', function () {
      // Remove the checked attribute from all checkboxes
      getCheckboxes().forEach((checkbox) => {
        checkbox.checked = false;
      });

      // Check that the correct record IDs are returned
      expect(filterSelectedRecords(), 'an empty array should return if no checkboxes are checked').to.deep.equal([]);
    });
  });

  describe('someCheckboxesChecked', function () {
    describe('true', function () {
      it('should return `true` if at least one checkbox is checked', function () {
        expect(someCheckboxesChecked(true), 'the function should return `true` if at least one checkbox is checked').to.be.true;
      });

      it('should return `false` if no checkboxes are checked', function () {
        // Uncheck all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(true), 'the function should return `false` if no checkboxes are checked').to.be.false;
      });
    });

    describe('false', function () {
      it('should return `true` if at least one checkbox is unchecked', function () {
        expect(someCheckboxesChecked(false), 'the function should return `true` if at least one checkbox is unchecked').to.be.true;
      });

      it('should return `false` if all checkboxes are checked', function () {
        // Check all the checkboxes
        getCheckboxes().forEach((checkbox) => {
          checkbox.checked = true;
        });

        // Check that the function returns false
        expect(someCheckboxesChecked(false), 'the function should return `false` if all checkboxes are checked').to.be.false;
      });
    });
  });
});
