import { listItemMetadata, listItemTitle } from '../../../../../assets/scripts/datastores/list/partials/_list-item.js';
import { expect } from 'chai';
import fs from 'fs';

const temporaryListJSON = JSON.parse(fs.readFileSync('./test/fixtures/temporary-list.json', 'utf8'));
const recordIds = Object.keys(temporaryListJSON);

describe('listItem()', function () {
  describe('listItemTitle()', function () {
    let args = null;
    let getOriginalTitle = null;
    let getTransliteratedTitle = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
        <h2 class="list__item--title">
          <a href="http://example.com/" class="list__item--title-original">
            Original Title
          </a>
          <span class="list__item--title-transliterated h5">
            Transliterated Title
          </span>
        </h2>
      `;

      args = {
        itemTitle: document.querySelector('.list__item--title'),
        title: {
          original: 'New Original Title',
          transliterated: 'New Transliterated Title'
        },
        url: 'https://lib.umich.edu'
      };

      getOriginalTitle = () => {
        return args.itemTitle.querySelector('.list__item--title-original');
      };
      getTransliteratedTitle = () => {
        return args.itemTitle.querySelector('.list__item--title-transliterated');
      };
    });

    afterEach(function () {
      args = null;
      getOriginalTitle = null;
      getTransliteratedTitle = null;
    });

    it('should update the url of the original title link', function () {
      // Call the function
      listItemTitle(args);

      // Check that the URL was updated
      expect(getOriginalTitle().getAttribute('href'), 'the value of the `href` attribute should have been updated to the provided `url`').to.equal(args.url);
    });

    it('should update the original title text', function () {
      // Call the function
      listItemTitle(args);

      // Check that the original title was updated
      expect(getOriginalTitle().textContent, 'the original title should have been updated with the provided title').to.equal(args.title.original);
    });

    it('should update the transliterated title text if it exists', function () {
      // Call the function
      listItemTitle(args);

      // Check that the transliterated title was updated
      expect(getTransliteratedTitle().textContent, 'the transliterated title should have been updated with the provided title').to.equal(args.title.transliterated);
    });

    it('should remove the transliterated title element if none exists', function () {
      // Remove the transliterated title from the args
      args.title.transliterated = '';

      // Call the function
      listItemTitle(args);

      // Check that the transliterated title element was removed
      expect(getTransliteratedTitle(), 'the transliterated title element should not exist if there is no transliterated title').to.be.null;
    });
  });

  describe('listItemMetadata()', function () {
    let args = null;
    let getRows = null;

    beforeEach(function () {
      // Apply HTML to the body
      document.body.innerHTML = `
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

      args = {
        itemTable: document.querySelector('table.metadata > tbody'),
        metadata: temporaryListJSON[recordIds[1]].metadata
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
});
