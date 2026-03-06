import { actionsPanelText } from '../../../../../assets/scripts/datastores/partials/actions/_summary.js';
import { expect } from 'chai';

describe('summary', function () {
  let summaryText = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="actions__summary--header">
        <small>Select what to do with this record.</small>
      </div>
    `;

    summaryText = () => {
      return document.querySelector('.actions__summary--header > small').textContent;
    };
  });

  afterEach(function () {
    summaryText = null;
  });

  describe('actionsPanelText()', function () {
    it('should update the text based on the number of selected records', function () {
      // Call the function
      actionsPanelText({ count: 2 });

      // Check that the text was updated
      expect(summaryText(), 'the text should be correct for selected multiple records').to.equal('Choose what to do with the selected records.');
    });

    it('should use singular text when one record is selected', function () {
      // Call the function
      actionsPanelText({ count: 1 });

      // Check that the text was updated
      expect(summaryText(), 'the text should be correct for selected single record').to.equal('Choose what to do with the selected record.');
    });

    it('should use default text when no records are selected', function () {
      // Call the function
      actionsPanelText({ count: 0 });

      // Check that the text was updated
      expect(summaryText(), 'the text should be correct for no selected records').to.equal('Select at least one record.');
    });
  });
});
