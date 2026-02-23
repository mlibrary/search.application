import {
  getSelectAllCheckbox,
  selectAll,
  selectAllCheckboxState
} from '../../../../assets/scripts/datastores/partials/_select-all.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('select all', function () {
  let getCheckbox = null;
  let getCheckboxes = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="select-all">
        <label class="select-all__label">
          <input type="checkbox" class="select-all__checkbox">
          Select all
        </label>
        <div class="select-all__count">
          <span class="select-all__count--checked">0</span> out of <span class="select-all__count--total">1</span> item selected.
        </div>
      </div>
      <ol class="list__items">
        <li><input type="checkbox" class="record__checkbox" value="Item 1"></li>
        <li><input type="checkbox" class="record__checkbox" value="Item 2"></li>
        <li><input type="checkbox" class="record__checkbox" value="Item 3"></li>
      </ol>
    `;

    getCheckbox = () => {
      return document.querySelector('input[type="checkbox"].select-all__checkbox');
    };

    getCheckboxes = () => {
      return document.querySelectorAll('input[type="checkbox"].record__checkbox');
    };

    // Check that the `Select all` checkbox is unchecked before each test
    expect(getCheckbox().checked, 'the `Select all` checkbox should be unchecked before each test').to.be.false;
    expect(getCheckbox().indeterminate, 'the `Select all` checkbox should not be mixed before each test').to.be.false;

    // Check that all record checkboxes are unchecked before each test
    expect(Array.from(getCheckboxes()).every((checkbox) => {
      return !checkbox.checked;
    }), 'all record checkboxes should be unchecked before each test').to.be.true;
  });

  afterEach(function () {
    getCheckbox = null;
    getCheckboxes = null;
  });

  describe('getSelectAllCheckbox()', function () {
    it('should return the `Select all` checkbox element', function () {
      expect(getSelectAllCheckbox(), 'the `Select all` checkbox should be returned').to.deep.equal(getCheckbox());
    });
  });

  describe('selectAllCheckboxState()', function () {
    let someCheckboxesCheckedStub = null;
    let args = null;

    beforeEach(function () {
      someCheckboxesCheckedStub = sinon.stub();
      args = {
        checkbox: getCheckbox(),
        someChecked: someCheckboxesCheckedStub
      };
    });

    afterEach(function () {
      someCheckboxesCheckedStub = null;
      args = null;
    });

    describe('no checkboxes checked', function () {
      beforeEach(function () {
        // Make sure `someCheckboxesChecked` returns the correct values
        someCheckboxesCheckedStub.withArgs(true).returns(false);
        someCheckboxesCheckedStub.withArgs(false).returns(true);

        // Call the function
        selectAllCheckboxState(args);
      });

      it('should call `someCheckboxesChecked` at least twice', function () {
        // Check that `someCheckboxesChecked` was called at least twice
        expect(someCheckboxesCheckedStub.callCount, '`someCheckboxesChecked` should be called at least twice').to.be.at.least(2);
      });

      it('should set the `checked` state to `false` if all checkboxes are unchecked', function () {
        expect(args.checkbox.checked, 'the `Select all` checkbox should be unchecked').to.be.false;
      });

      it('should set the `indeterminate` state to `false` if all checkboxes are unchecked', function () {
        expect(args.checkbox.indeterminate, 'the `Select all` checkbox should be not be indeterminate').to.be.false;
      });
    });

    describe('some checkboxes checked', function () {
      beforeEach(function () {
        // Loop through all the checkboxes
        getCheckboxes().forEach((checkbox, index) => {
          if (index % 2 === 0) {
            // Check odd-numbered checkboxes
            checkbox.checked = true;
          }
        });

        // Check that some checkboxes are checked
        expect(Array.from(getCheckboxes()).some((checkbox) => {
          return checkbox.checked;
        }), 'some record checkboxes should be checked before each test').to.be.true;

        // Check that not all checkboxes are checked
        expect(Array.from(getCheckboxes()).every((checkbox) => {
          return checkbox.checked;
        }), 'not all record checkboxes should be checked before each test').to.be.false;

        // Make sure `someCheckboxesChecked` returns the correct values
        someCheckboxesCheckedStub.withArgs(true).returns(true);
        someCheckboxesCheckedStub.withArgs(false).returns(true);

        // Call the function
        selectAllCheckboxState(args);
      });

      it('should call `someCheckboxesChecked` at least twice', function () {
        // Check that `someCheckboxesChecked` was called at least twice
        expect(someCheckboxesCheckedStub.callCount, '`someCheckboxesChecked` should be called at least twice').to.be.at.least(2);
      });

      it('should set the `checked` state to `false` if only some checkboxes are checked', function () {
        expect(args.checkbox.checked, 'the `Select all` checkbox should be unchecked').to.be.false;
      });

      it('should set the `indeterminate` state to `true` if only some checkboxes are checked', function () {
        expect(args.checkbox.indeterminate, 'the `Select all` checkbox should be indeterminate').to.be.true;
      });
    });

    describe('all checkboxes checked', function () {
      beforeEach(function () {
        // Loop through all the checkboxes and check them
        getCheckboxes().forEach((checkbox) => {
          // Check the checkbox
          checkbox.checked = true;
        });

        // Check that all checkboxes are checked
        expect([...getCheckboxes()].every((checkbox) => {
          return checkbox.checked;
        }), 'all record checkboxes should be checked before each test').to.be.true;

        // Make sure `someCheckboxesChecked` returns the correct values
        someCheckboxesCheckedStub.withArgs(true).returns(true);
        someCheckboxesCheckedStub.withArgs(false).returns(false);

        // Call the function
        selectAllCheckboxState(args);
      });

      it('should call `someCheckboxesChecked` at least twice', function () {
        // Check that `someCheckboxesChecked` was called at least twice
        expect(someCheckboxesCheckedStub.callCount, '`someCheckboxesChecked` should be called at least twice').to.be.at.least(2);
      });

      it('should set the `checked` state to `true` if all checkboxes are checked', function () {
        expect(args.checkbox.checked, 'the `Select all` checkbox should be checked').to.be.true;
      });

      it('should set the `indeterminate` state to `false` if all checkboxes are checked', function () {
        expect(args.checkbox.indeterminate, 'the `Select all` checkbox should not be indeterminate').to.be.false;
      });
    });
  });

  describe('selectAll', function () {
    let selectAllCheckboxStateSpy = null;
    let args = null;

    beforeEach(function () {
      selectAllCheckboxStateSpy = sinon.spy();
      args = {
        checkbox: getSelectAllCheckbox(),
        checkboxes: getCheckboxes(),
        selectCheckboxState: selectAllCheckboxStateSpy
      };

      // Call the function
      selectAll(args);
    });

    afterEach(function () {
      selectAllCheckboxStateSpy = null;
      args = null;
    });

    it('should call `selectAllCheckboxState` once during initialization', function () {
      expect(selectAllCheckboxStateSpy.calledOnce, '`selectAllCheckboxState` should be called once during initialization').to.be.true;
    });

    it('should call `selectAllCheckboxState` again when the `Select all` checkbox is changed', function () {
      // Simulate a change event on the `Select all` checkbox
      args.checkbox.dispatchEvent(new window.Event('change'));

      // Check that `selectAllCheckboxState` was called
      expect(selectAllCheckboxStateSpy.calledTwice, '`selectAllCheckboxState` should be called when the `Select all` checkbox is changed').to.be.true;
    });

    it('should check all record checkboxes when the `Select all` checkbox is initially unchecked on change', function () {
      // Simulate a change event on the `Select all` checkbox
      args.checkbox.dispatchEvent(new window.Event('change'));

      // Check that all record checkboxes are checked
      expect(Array.from(args.checkboxes).every((checkbox) => {
        return checkbox.checked;
      }), 'all record checkboxes should be checked').to.be.true;
    });

    it('should check all record checkboxes when the `Select all` checkbox is initially indeterminate on change', function () {
      // Set the `Select all` checkbox to indeterminate
      args.checkbox.indeterminate = true;
      expect(args.checkbox.indeterminate, 'the `Select all` checkbox should be indeterminate before the change event').to.be.true;

      // Simulate a change event on the `Select all` checkbox
      args.checkbox.dispatchEvent(new window.Event('change'));

      // Check that all record checkboxes are checked
      expect(Array.from(args.checkboxes).every((checkbox) => {
        return checkbox.checked;
      }), 'all record checkboxes should be checked').to.be.true;
    });

    it('should uncheck all record checkboxes when the `Select all` checkbox is initially checked on change', function () {
      // Set the `Select all` checkbox to checked
      args.checkbox.checked = true;
      expect(args.checkbox.checked, 'the `Select all` checkbox should be checked before the change event').to.be.true;

      // Check all the record checkboxes
      args.checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
      expect(Array.from(args.checkboxes).every((checkbox) => {
        return checkbox.checked;
      }), 'all record checkboxes should be checked before the change event').to.be.true;

      // Simulate a change event on the `Select all` checkbox
      args.checkbox.dispatchEvent(new window.Event('change'));

      // Check that all record checkboxes are unchecked
      expect(Array.from(args.checkboxes).every((checkbox) => {
        return !checkbox.checked;
      }), 'all record checkboxes should be unchecked').to.be.true;
    });
  });
});
