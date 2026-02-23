import { actionsPanelText } from '../../../../../assets/scripts/datastores/partials/actions/_summary.js';
import { expect } from 'chai';
import { getCheckedCheckboxes } from '../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { JSDOM } from 'jsdom';
import { viewingTemporaryList } from '../../../../../assets/scripts/datastores/list/layout.js';

describe('summary', function () {
  let summaryText = null;
  let initialText = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="actions__summary--header">
        <small>Select what to do with this record.</small>
      </div>
      <ol class="list__items">
        <li><input type="checkbox" class="record__checkbox" value="rec1" checked></li>
        <li><input type="checkbox" class="record__checkbox" value="rec2"></li>
        <li><input type="checkbox" class="record__checkbox" value="rec3"></li>
        <li><input type="checkbox" class="record__checkbox" value="rec4" checked></li>
        <li><input type="checkbox" class="record__checkbox" value="rec5"></li>
      </ol>
    `;

    summaryText = () => {
      return document.querySelector('.actions__summary--header > small').textContent;
    };

    // Save the initial text
    initialText = summaryText();
  });

  describe('actionsPanelText()', function () {
    describe('when not viewing the temporary list', function () {
      beforeEach(function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Call the function
        actionsPanelText();
      });

      it('should not update the text', function () {
        // Check that the text was not updated
        expect(summaryText()).to.equal(initialText);
      });
    });

    describe('when viewing the temporary list', function () {
      let originalWindow = null;

      beforeEach(function () {
        // Save the original window object
        originalWindow = global.window;

        // Setup JSDOM with an updated URL
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
          url: 'http://localhost/everything/list'
        });

        // Override the global window object
        global.window = dom.window;

        // Check that Temporary List is being viewed
        expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;
      });

      afterEach(function () {
        // Restore the original window object
        global.window = originalWindow;
      });

      it('should update the text if viewing the temporary list', function () {
        // Check that there are multiple checkboxes checked
        expect(getCheckedCheckboxes().length).to.be.greaterThan(1);

        // Call the function
        actionsPanelText();

        // Check that the text was updated
        expect(summaryText(), 'the text should be correct for selected multiple records').to.equal('Choose what to do with the selected records.');
      });

      it('should use singular text when one record is selected', function () {
        // Uncheck all but one checkbox
        document.querySelectorAll('input[type="checkbox"].record__checkbox').forEach((checkbox, index) => {
          // Only check the first checkbox
          checkbox.checked = index === 0;
        });

        // Check that there is only one checkbox checked
        expect(getCheckedCheckboxes().length).to.equal(1);

        // Call the function
        actionsPanelText();

        // Check that the text was updated
        expect(summaryText(), 'the text should be correct for selected single record').to.equal('Choose what to do with the selected record.');
      });

      it('should use default text when no records are selected', function () {
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"].record__checkbox').forEach((checkbox) => {
          checkbox.checked = false;
        });

        // Check that there are no checkboxes checked
        expect(getCheckedCheckboxes().length).to.equal(0);

        // Call the function
        actionsPanelText();

        // Check that the text was updated
        expect(summaryText(), 'the text should be correct for no selected records').to.equal('Select at least one record.');
      });
    });
  });

  afterEach(function () {
    summaryText = null;
    initialText = null;
  });
});
