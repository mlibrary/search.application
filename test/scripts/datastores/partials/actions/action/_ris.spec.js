import { expect } from 'chai';
import { initializeRIS } from '../../../../../../assets/scripts/datastores/partials/actions/action/_ris.js';
import sinon from 'sinon';

describe('RIS', function () {
  describe('initializeRIS()', function () {
    let cacheRISDataSpy = null;
    let args = null;

    beforeEach(function () {
      cacheRISDataSpy = sinon.spy();
      args = {
        cacheRIS: cacheRISDataSpy,
        list: global.temporaryList
      };

      // Call the function
      initializeRIS(args);
    });

    afterEach(function () {
      cacheRISDataSpy = null;
      args = null;
    });

    it('should call `cacheRISData` with the correct arguments', function () {
      expect(cacheRISDataSpy.calledOnceWithExactly({ list: global.temporaryList }), '`cacheRISData` should have been called once with the correct arguments').to.be.true;
    });
  });
});
