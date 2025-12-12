import { expect } from 'chai';
import toggleContainerClass from '../../../../assets/scripts/datastores/record/layout.js';

const activeClass = 'record__container--active';

describe('layout', function () {
  describe('toggleContainerClass()', function () {
    let args = null;
    let hasActiveClass = null;

    beforeEach(function () {
      args = {
        isAdded: true,
        recordDatastore: 'catalog',
        recordId: '1337'
      };

      // Apply HTML to the body
      document.body.innerHTML = `<div class="record__container" data-record-id="${args.recordId}" data-record-datastore="${args.recordDatastore}"></div>`;

      hasActiveClass = () => {
        return document.querySelector('div').classList.contains(activeClass);
      };

      // Check that the record does not have the class to begin with
      expect(hasActiveClass(), `the record should not have the \`${activeClass}\` class`).to.be.false;

      // Call the function
      toggleContainerClass(args);
    });

    afterEach(function () {
      args = null;
      hasActiveClass = null;
    });

    it(`should toggle the \`${activeClass}\` class`, function () {
      // Check that the class was added
      expect(hasActiveClass(), `the record should have the \`${activeClass}\` class`).to.be.true;

      // Call the function again
      toggleContainerClass({ ...args, isAdded: false });

      // Check that the class was removed
      expect(hasActiveClass(), `the record should not have the \`${activeClass}\` class`).to.be.false;
    });
  });
});
