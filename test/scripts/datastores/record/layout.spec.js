import { getRecordData, toggleContainerClass, viewingFullRecord } from '../../../../assets/scripts/datastores/record/layout.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

const activeClass = 'record__container--active';

describe('layout', function () {
  let getRecordContainer = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `<div class="record__container" data-record-id="1337" data-record-datastore="catalog"></div>`;

    getRecordContainer = () => {
      return document.querySelector('.record__container');
    };
  });

  afterEach(function () {
    getRecordContainer = null;
  });

  describe('viewingFullRecord()', function () {
    beforeEach(function () {
      // Check that the current pathname does not include `/record/`
      expect(window.location.pathname.includes('/record/'), 'the current pathname should not include `/record/`').to.be.false;
    });

    it('should be `false` if the current pathname does not include `/record/`', function () {
      // Check that a full record is not being viewed
      expect(viewingFullRecord(), 'the variable should be `false` if the current pathname is not `/record/`').to.be.false;
    });

    it('should be `true` if the current pathname is `/record/`', function () {
      // Store the original window object
      const originalWindow = global.window;

      // Setup JSDOM with an updated URL
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
        url: 'http://localhost/record/'
      });

      // Override the global window object
      global.window = dom.window;

      // Check that a full record is being viewed
      expect(viewingFullRecord(), 'the variable should be `true` if the current pathname includes `/record/`').to.be.true;

      // Restore the original window object
      global.window = originalWindow;
    });
  });

  describe('getRecordData()', function () {
    it('should return an object', function () {
      expect(getRecordData()).to.be.an('object');
    });

    it('should return the correct record data', function () {
      const { recordDatastore, recordId } = getRecordContainer().dataset;
      expect(getRecordData()).to.deep.equal({ recordDatastore, recordId });
    });
  });

  describe('toggleContainerClass()', function () {
    let args = null;
    let hasActiveClass = null;

    beforeEach(function () {
      const { recordDatastore, recordId } = getRecordContainer().dataset;
      args = {
        isAdded: true,
        recordDatastore,
        recordId
      };

      hasActiveClass = () => {
        return getRecordContainer().classList.contains(activeClass);
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
