import { expect } from 'chai';
import { initializeRIS } from '../../../../../../assets/scripts/datastores/partials/actions/action/_ris.js';
import sinon from 'sinon';

describe('RIS', function () {
  describe('initializeRIS()', function () {
    let cacheRISDataSpy = null;
    let downloadRISFormSubmitSpy = null;
    let updateRISDataSpy = null;
    let args = null;

    beforeEach(function () {
      cacheRISDataSpy = sinon.spy();
      downloadRISFormSubmitSpy = sinon.spy();
      updateRISDataSpy = sinon.spy();
      args = {
        cacheRIS: cacheRISDataSpy,
        list: global.temporaryList,
        risFormSubmit: downloadRISFormSubmitSpy,
        updateRISTextarea: updateRISDataSpy
      };

      // Call the function
      initializeRIS(args);
    });

    afterEach(function () {
      cacheRISDataSpy = null;
      downloadRISFormSubmitSpy = null;
      updateRISDataSpy = null;
      args = null;
    });

    it('should call `cacheRISData` with the correct arguments', function () {
      expect(cacheRISDataSpy.calledOnceWithExactly({ list: global.temporaryList }), '`cacheRISData` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `updateRISData` with the correct arguments', function () {
      expect(updateRISDataSpy.calledOnceWithExactly(), '`updateRISData` should have been called once with the correct arguments').to.be.true;
    });

    it('should call `downloadRISFormSubmit` with the correct arguments', function () {
      expect(downloadRISFormSubmitSpy.calledOnceWithExactly(), '`downloadRISFormSubmit` should have been called once with the correct arguments').to.be.true;
    });
  });
});
