import { getDatastoreSections, removeEmptyDatastoreSections } from '../../../../../../assets/scripts/datastores/list/partials/results/_datastores.js';
import { expect } from 'chai';
import { getDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';

describe('datastores', function () {
  let list = null;
  let getSections = null;

  beforeEach(function () {
    list = { ...global.temporaryList };

    // Apply HTML to the body
    document.body.innerHTML = Object.keys(list).map((datastore) => {
      return `<div class="list__datastore" data-datastore="${datastore}"></div>`;
    }).join('');

    getSections = () => {
      return document.querySelectorAll('.list__datastore');
    };

    // Check that there's a datastore section for each datastore
    expect(getSections().length, '`getSections` should return the correct number of datastore sections').to.equal(Object.keys(list).length);
  });

  afterEach(function () {
    list = null;
    getSections = null;
  });

  describe('getDatastoreSections()', function () {
    it('should return the datastore section elements', function () {
      expect(getDatastoreSections(), '`getDatastoreSections` should return the datastore section elements').to.deep.equal(getSections());
    });
  });

  describe('removeEmptyDatastoreSections()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        datastores: getDatastores({ list })
      };

      // Call the function
      removeEmptyDatastoreSections(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should only remove empty datastore sections from the DOM', function () {
      getDatastoreSections().forEach((section) => {
        if (args.datastores.includes(section.dataset.datastore)) {
          expect(section.parentNode, 'non-empty datastore section should not be removed').to.not.be.null;
        } else {
          expect(section.parentNode, 'empty datastore section should be removed').to.be.null;
        }
      });
    });
  });
});
