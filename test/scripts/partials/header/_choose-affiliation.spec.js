import chooseAffiliation from '../../../../assets/scripts/partials/header/_choose-affiliation.js';
import { expect } from 'chai';

describe('chooseAffiliation', function () {
  let getForm = null;
  let getChangeAffiliationButton = null;
  let getDialog = null;
  let getDismissButtons = null;
  let getSubmitButton = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form id="affiliation__form" method="post" action="/change-affiliation">
        <button class="affiliation__change" type="submit">
          Change affiliation
        </button>
        <dialog class="affiliation__dialog">
          <button type="submit">
            Change affiliation
          </button>
          <button class="affiliation__dialog--dismiss">Dismiss</button>
          <button class="affiliation__dialog--dismiss">Dismiss</button>
        </dialog>
      </form>
    `;

    getForm = () => {
      return document.getElementById('affiliation__form');
    };
    getChangeAffiliationButton = () => {
      return getForm().querySelector('.affiliation__change');
    };
    getDialog = () => {
      return getForm().querySelector('.affiliation__dialog');
    };
    getDismissButtons = () => {
      return getDialog().querySelectorAll('.affiliation__dialog--dismiss');
    };
    getSubmitButton = () => {
      return getDialog().querySelector('button[type="submit"]');
    };

    // Prevent the form from submitting in the tests
    getForm().addEventListener('submit', (event) => {
      event.preventDefault();
    });

    // Mock HTMLDialogElement as it does not exist in JSDOM
    global.HTMLDialogElement = class {
      constructor () {
        this.open = false;
      }

      showModal () {
        this.open = true;
      }

      close () {
        this.open = false;
      }
    };

    // Apply mock methods to the dialog element in the DOM
    document.querySelectorAll('dialog').forEach((dialogElement) => {
      dialogElement.showModal = function () {
        return dialogElement.setAttribute('open', 'true');
      };
      dialogElement.close = function () {
        return dialogElement.removeAttribute('open');
      };
    });
  });

  afterEach(function () {
    getForm = null;
    getChangeAffiliationButton = null;
    getDialog = null;
    getDismissButtons = null;
    getSubmitButton = null;

    // Delete global variables
    delete global.HTMLDialogElement;
  });

  describe('button.affiliation__change.click()', function () {
    it('should not open the dialog if the dialog does not have a submit button', function () {
      // Check the submit button exists before removing
      expect(getSubmitButton(), 'a submit button should exist inside the dialog element').to.not.be.null;

      // Remove the submit button before invoking
      getSubmitButton().remove();
      chooseAffiliation();

      // Check that the submit button no longer exists and button.affiliation__change does not open the dialog element
      expect(getSubmitButton(), 'a submit button should not exist inside the dialog element').to.be.null;
      getChangeAffiliationButton().click();
      expect(getDialog().hasAttribute('open'), 'dialog element should not have an `open` attribute').to.be.false;
    });

    it('should not open the dialog if the dialog does not have a dismiss button', function () {
      // Check at least one dismiss button exists before removing
      expect(getDismissButtons().length, 'at least one dismiss button should exist inside the dialog element').to.be.greaterThan(0);

      // Remove all dismiss buttons before invoking
      getDismissButtons().forEach((dismissButton) => {
        dismissButton.remove();
      });
      chooseAffiliation();

      // Check that the dismiss buttons no longer exist and button.affiliation__change does not open the dialog element
      expect(getDismissButtons().length, 'dismiss buttons should not exist inside the dialog element').to.equal(0);
      getChangeAffiliationButton().click();
      expect(getDialog().hasAttribute('open'), 'dialog element should not have an `open` attribute').to.be.false;
    });

    it('should open the dialog', function () {
      chooseAffiliation();
      getChangeAffiliationButton().click();
      expect(getDialog().hasAttribute('open'), 'dialog element should have an `open` attribute').to.be.true;
    });
  });

  describe('button.affiliation__dialog--dismiss.click()', function () {
    it('should close the dialog when any dismiss button is clicked', function () {
      chooseAffiliation();
      getDismissButtons().forEach((dismissButton) => {
        // Show the dialog first
        getChangeAffiliationButton().click();
        expect(getDialog().hasAttribute('open'), 'dialog element should have an `open` attribute').to.be.true;

        // Close the dialog
        dismissButton.click();
        expect(getDialog().hasAttribute('open'), 'dialog element should not have an `open` attribute').to.be.false;
      });
    });
  });
});
