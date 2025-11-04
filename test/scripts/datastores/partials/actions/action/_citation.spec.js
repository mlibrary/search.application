import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import { someCheckboxesChecked } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `<li><input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}></li>`;
  });
});

describe('citation', function () {
  let getTextareaContent = null;

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

    getTextareaContent = () => {
      return document.querySelector('textarea').value;
    };

    // Check that the textarea is empty
    expect(getTextareaContent(), 'the textarea should be empty before each test').to.be.empty;

    // Check that at least one checkbox is checked
    expect(someCheckboxesChecked(true), 'at least one checkbox should be checked for this test').to.be.true;

    global.sessionStorage = window.sessionStorage;

    // Set a temporary list in session storage
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));
  });

  afterEach(function () {
    getTextareaContent = null;
    // Cleanup
    delete global.sessionStorage;
  });

  describe('generateFullRecordCitations()', function () {
    // TO DO
  });
});
