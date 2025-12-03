import {
  buttonUIFuncs,
  updateButtonClass,
  updateButtonIcon,
  updateButtonText,
  updateButtonTitle,
  updateButtonUI
} from '../../../../../../assets/scripts/datastores/list/partials/add-to/_button.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('button', function () {
  let title = null;
  let args = null;

  beforeEach(function () {
    title = 'Title Example';

    // Apply HTML to the body
    document.body.innerHTML = `
      <button>
        <span class="material-symbols-rounded"></span>
        <span class="visually-hidden">Add ${title} to My Temporary List</span>
      </button>
    `;

    args = {
      button: document.querySelector('button'),
      isAdded: true
    };
  });

  afterEach(function () {
    title = null;
    args = null;
  });

  describe('updateButtonClass()', function () {
    const activeClass = 'button__ghost--active';
    let hasActiveClass = null;

    beforeEach(function () {
      hasActiveClass = () => {
        return args.button.classList.contains(activeClass);
      };

      // Check that the class does not exist before testing
      expect(hasActiveClass(), `the button should not have the \`${activeClass}\` class before testing`).to.be.false;

      // Call the function
      updateButtonClass(args);
    });

    afterEach(function () {
      hasActiveClass = null;
    });

    it(`should toggle the \`${activeClass}\` class`, function () {
      // Check that the class has been added
      expect(hasActiveClass(), `the button should have the \`${activeClass}\` class`).to.be.true;

      // Call the function again
      updateButtonClass({ ...args, isAdded: false });

      // Check that the class has been remove
      expect(hasActiveClass(), `the button should no longer have the \`${activeClass}\` class`).to.be.false;
    });
  });

  describe('updateButtonIcon()', function () {
    let getButtonIcon = null;

    beforeEach(function () {
      getButtonIcon = () => {
        return args.button.querySelector('.material-symbols-rounded').textContent;
      };

      // Check that there is no existing icon before testing
      expect(getButtonIcon(), 'the button icon should not have any text before testing').to.equal('');

      // Call the function
      updateButtonIcon(args);
    });

    afterEach(function () {
      getButtonIcon = null;
    });

    it('should change the icon to `delete`', function () {
      // Check that the icon is now `delete`
      expect(getButtonIcon(), 'the button icon should have been changed to `delete`').to.equal('delete');
    });

    it('should change the icon to `add`', function () {
      // Call the function again
      updateButtonIcon({ ...args, isAdded: false });

      // Check that the icon is now `add`
      expect(getButtonIcon(), 'the button icon should have been changed to `add`').to.equal('add');
    });
  });

  describe('updateButtonTitle()', function () {
    let getButtonTitle = null;

    beforeEach(function () {
      getButtonTitle = () => {
        return args.button.getAttribute('title');
      };

      // Check that a title does not exist before testing
      expect(getButtonTitle(), 'the button should not have a title before testing').to.be.null;

      // Call the function
      updateButtonTitle(args);
    });

    afterEach(function () {
      getButtonTitle = null;
    });

    it('should define the button `title` attribute', function () {
      // Check that the title has been added
      expect(getButtonTitle(), 'the button should not have a defined `title` attribute').to.not.be.null;
    });

    it('should update the button `title` attribute value', function () {
      // Check that the title communicates to remove the record from My Temporary List
      expect(getButtonTitle(), 'the button `title` attribute should communicate to remove the record from My Temporary List').to.equal('Remove from My Temporary List');

      // Call the function again
      updateButtonTitle({ ...args, isAdded: false });

      // Check that the title communicates to add the record from My Temporary List
      expect(getButtonTitle(), 'the button `title` attribute should communicate to add the record from My Temporary List').to.equal('Add to My Temporary List');
    });
  });

  describe('updateButtonText()', function () {
    let getButtonText = null;
    let addRecordText = null;
    let removeRecordText = null;

    beforeEach(function () {
      getButtonText = () => {
        return args.button.querySelector('.visually-hidden').textContent.trim();
      };

      addRecordText = `Add ${title} to My Temporary List`;
      removeRecordText = `Remove ${title} from My Temporary List`;

      // Check that the button text is predefined before testing
      expect(getButtonText(), 'the button text should be predefined before testing').to.equal(addRecordText);

      // Call the function
      updateButtonText(args);
    });

    afterEach(function () {
      getButtonText = null;
      addRecordText = null;
      removeRecordText = null;
    });

    it('should toggle the button text', function () {
      // Check that the button text communicates to remove the record from My Temporary List
      expect(getButtonText(), 'the button text should communicate to remove the record from My Temporary List').to.equal(removeRecordText);

      // Call the function again
      updateButtonText({ ...args, isAdded: false });

      // Check that the button text communicates to add the record to My Temporary List
      expect(getButtonText(), 'the button text should communicate to add the record to My Temporary List').to.equal(addRecordText);
    });
  });

  describe('updateButtonUI()', function () {
    beforeEach(function () {
      // Replace actual functions with spies for this test run
      buttonUIFuncs.updateButtonClass = sinon.spy();
      buttonUIFuncs.updateButtonIcon = sinon.spy();
      buttonUIFuncs.updateButtonText = sinon.spy();
      buttonUIFuncs.updateButtonTitle = sinon.spy();
    });

    afterEach(function () {
      // Optional: restore the original implementations if needed
      sinon.restore();
    });

    it('should call UI functions with the correct arguments', function () {
      // Call the function
      updateButtonUI(args);

      // Loop through the functions
      Object.keys(buttonUIFuncs).forEach((buttonUIFunc) => {
        // Check that the function was called
        expect(buttonUIFuncs[buttonUIFunc].calledOnce, `${buttonUIFunc} should be called once`).to.be.true;

        // Check the first (and only) call's argument
        expect(buttonUIFuncs[buttonUIFunc].firstCall.args[0], `${buttonUIFunc} args should match input`).to.deep.equal(args);
      });
    });

    it('should call UI functions with the correct arguments when not added', function () {
      // Call the function
      updateButtonUI({ ...args, isAdded: false });

      // Loop through the functions
      Object.keys(buttonUIFuncs).forEach((buttonUIFunc) => {
        // Check that the function was called
        expect(buttonUIFuncs[buttonUIFunc].calledOnce, `${buttonUIFunc} should be called once`).to.be.true;

        // Check the first (and only) call's argument
        expect(buttonUIFuncs[buttonUIFunc].firstCall.args[0], `${buttonUIFunc} args should match input`).to.deep.equal({ ...args, isAdded: false });
      });
    });
  });
});
