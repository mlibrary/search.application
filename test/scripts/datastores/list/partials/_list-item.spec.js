import { listItem, listItemCheckbox, listItemMetadata, listItemTitle } from '../../../../../assets/scripts/datastores/list/partials/_list-item.js';
import { expect } from 'chai';

const nonEmptyDatastores = Object.keys(global.temporaryList).filter((datastore) => {
  return Object.keys(global.temporaryList[datastore]).length > 0;
});
const recordIds = Object.keys(global.temporaryList[nonEmptyDatastores[0]]);

const listItemTitleHTML = `
  <h3 class="list__item--title">
    <span class="list__item--title-number">0.</span>
    <a href="http://example.com/" class="list__item--title-original">
      Original Title
    </a>
    <span class="list__item--title-transliterated h5">
      Transliterated Title
    </span>
  </h3>
`;
const listItemMetadataHTML = `
  <table class="metadata">
    <tbody>
      <tr class="metadata__row--clone">
        <th scope="row">
          Field
        </th>
        <td>
          <span class="metadata__data--original">
            Original Data
          </span>
          <span class="metadata__data--transliterated">
            Transliterated Data
          </span>
        </td>
      </tr>
    </tbody>
  </table>
`;

describe('listItem()', function () {
  describe('listItemCheckbox()', function () {
    let getCheckbox = null;
    let args = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = '<input type="checkbox" class="list__item--checkbox" value="" aria-label="Select record">';

      getCheckbox = () => {
        return document.querySelector('input');
      };

      args = {
        datastore: 'catalog',
        itemCheckbox: getCheckbox(),
        recordId: '1337',
        title: 'This is a title'
      };

      // Call the function
      listItemCheckbox(args);
    });

    afterEach(function () {
      getCheckbox = null;
      args = null;
    });

    it('should update the checkbox value', function () {
      expect(getCheckbox().value, 'the value of the checkbox should include the `datastore` and `recordId`').to.equal(`${args.datastore},${args.recordId}`);
    });

    it('should update the `aria-label` attribute of the checkbox', function () {
      expect(getCheckbox().getAttribute('aria-label'), 'the `aria-label` attribute of the checkbox should include the record title').to.equal(`Select ${args.title}`);
    });
  });

  describe('listItemTitle()', function () {
    let args = null;
    let getOriginalNumber = null;
    let getOriginalTitle = null;
    let getTransliteratedTitle = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItemTitleHTML;

      args = {
        index: 0,
        itemTitle: document.querySelector('.list__item--title'),
        title: {
          original: 'New Original Title',
          transliterated: 'New Transliterated Title'
        },
        url: 'https://lib.umich.edu'
      };

      getOriginalNumber = () => {
        return args.itemTitle.querySelector('.list__item--title-number');
      };

      getOriginalTitle = () => {
        return args.itemTitle.querySelector('.list__item--title-original');
      };

      getTransliteratedTitle = () => {
        return args.itemTitle.querySelector('.list__item--title-transliterated');
      };

      // Call the function
      listItemTitle(args);
    });

    afterEach(function () {
      args = null;
      getOriginalNumber = null;
      getOriginalTitle = null;
      getTransliteratedTitle = null;
    });

    it('should update the number of the original number', function () {
      // Check that the number was updated
      expect(getOriginalNumber().textContent, 'the value of the number should be one larger than its index').to.equal(`${args.index + 1}.`);
    });

    it('should update the url of the original title link', function () {
      // Check that the URL was updated
      expect(getOriginalTitle().getAttribute('href'), 'the value of the `href` attribute should have been updated to the provided `url`').to.equal(args.url);
    });

    it('should update the original title text', function () {
      // Check that the original title was updated
      expect(getOriginalTitle().textContent, 'the original title should have been updated with the provided title').to.equal(args.title.original);
    });

    it('should update the transliterated title text if it exists', function () {
      // Check that the transliterated title was updated
      expect(getTransliteratedTitle().textContent, 'the transliterated title should have been updated with the provided title').to.equal(args.title.transliterated);
    });

    it('should remove the transliterated title element if none exists', function () {
      // Remove the transliterated title from the args
      args.title.transliterated = '';

      // Call the function again
      listItemTitle(args);

      // Check that the transliterated title element was removed
      expect(getTransliteratedTitle(), 'the transliterated title element should not exist if there is no transliterated title').to.be.null;
    });
  });

  describe('listItemMetadata()', function () {
    let args = null;
    let getRows = null;
    const [recordId] = recordIds;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = listItemMetadataHTML;

      args = {
        itemTable: document.querySelector('table.metadata > tbody'),
        metadata: global.temporaryList[nonEmptyDatastores[0]][recordId].metadata
      };

      getRows = () => {
        return args.itemTable.querySelectorAll('tr');
      };
    });

    afterEach(function () {
      args = null;
      getRows = null;
    });

    it('should clone the existing row for each piece of metadata', function () {
      // Check how many rows currently exist
      expect(getRows().length).to.equal(1);

      // Call the function
      listItemMetadata(args);

      // Check that the number of rows equals the amount of metadata
      expect(getRows().length, 'the number of rows should equal to the length of the given metadata').to.equal(args.metadata.length);
    });

    it('should remove the clone class', function () {
      // Check that every row has the clone class
      const hasCloneClass = () => {
        return [...getRows()].every((row) => {
          return row.classList?.contains('metadata__row--clone');
        });
      };

      // Check that the clone class currently exists
      expect(hasCloneClass(), 'the clone class should exist for each table row').to.be.true;

      // Call the function
      listItemMetadata(args);

      // Check that the clone class no longer exists
      expect(hasCloneClass(), 'the clone class should not longer exist for each table row').to.be.false;
    });

    it('should remove the `transliterated` element if it does not exist', function () {
      // Define the metadata row to check
      const index = 0;

      // Remove the metadata row's transliterated information from the args
      args.metadata[index].transliterated = '';

      // Call the function
      listItemMetadata(args);

      // Check that the metadata row does not have the transliterated element
      expect(getRows()[index].querySelector('.metadata__data--transliterated'), 'the metadata row should not have the transliterated element').to.be.null;
    });
  });

  describe('listItem()', function () {
    let args = null;
    let getListItem = null;
    const [recordId] = recordIds;
    const cloneClass = 'list__item--clone';

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <li class="container__rounded list__item list__item--clone">
          <div class="list__item--header">
            <input type="checkbox" class="list__item--checkbox" value="" aria-label="Select record">
            ${listItemTitleHTML}
          </div>
          ${listItemMetadataHTML}
        </li>
      `;

      args = {
        datastore: nonEmptyDatastores[0],
        record: global.temporaryList[nonEmptyDatastores[0]][recordId],
        recordId
      };

      getListItem = () => {
        return document.querySelector(`[data-record-id="${recordId}"]`);
      };

      // Call the function by attaching it to the body
      document.body.appendChild(listItem(args));
    });

    afterEach(function () {
      args = null;
      getListItem = null;
    });

    it('should clone the list item and remove the clone class and add the `data-record-id` attribute', function () {
      // Check that the list item has `data-record-id` been defined
      expect(getListItem().getAttribute('data-record-id'), 'the list item should have the `data-record-id` attribute defined').to.equal(recordId);

      // Check that the clone class no longer exists
      expect(getListItem().classList.contains(cloneClass), `the list item should not have the \`${cloneClass}\` class`).to.be.false;
    });

    it('should update the checkbox value to the datastore and record ID', function () {
      const checkbox = getListItem().querySelector('.list__item--checkbox');
      expect(checkbox.value, 'the checkbox value of the cloned list item should equal to the provided datastore and record ID').to.equal([args.datastore, args.recordId].join(','));
    });

    it('should call `listItemTitle`', function () {
      expect(listItem.toString(), '`listItemTitle` should be called in the function').to.include('listItemTitle({');
    });

    it('should call `listItemMetadata`', function () {
      expect(listItem.toString(), '`listItemMetadata` should be called in the function').to.include('listItemMetadata({');
    });
  });
});
