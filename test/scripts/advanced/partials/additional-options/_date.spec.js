import { expect } from 'chai';
import { initializeDateOptions } from '../../../../../assets/scripts/advanced/partials/additional-options/_date.js';
import sinon from 'sinon';

describe('date options', function () {
  describe('initializeDateOptions()', function () {
    let initializeDateTypesSpy = null;
    let initializeYearChangesSpy = null;
    let args = null;

    beforeEach(function () {
      initializeDateTypesSpy = sinon.spy();
      initializeYearChangesSpy = sinon.spy();
      args = {
        dateTypeChanges: initializeDateTypesSpy,
        yearChanges: initializeYearChangesSpy
      };

      // Call the function
      initializeDateOptions(args);
    });

    afterEach(function () {
      initializeDateTypesSpy = null;
      initializeYearChangesSpy = null;
      args = null;
    });

    it('should call `initializeDateTypes` with the correct arguments', function () {
      expect(initializeDateTypesSpy.calledOnceWithExactly(), '`initializeDateTypes` should have been called with the correct arguments').to.be.true;
    });

    it('should call `initializeYearChanges` with the correct arguments', function () {
      expect(initializeYearChangesSpy.calledOnceWithExactly(), '`initializeYearChanges` should have been called with the correct arguments').to.be.true;
    });
  });
});
