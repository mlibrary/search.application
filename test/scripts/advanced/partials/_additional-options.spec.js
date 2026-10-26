import { expect } from 'chai';
import { initializeAdditionalOptions } from '../../../../assets/scripts/advanced/partials/_additional-options.js';
import sinon from 'sinon';

describe('additional search options', function () {
  describe('initializeAdditionalOptions()', function () {
    let initializeDateOptionsSpy = null;
    let initializeAllSelectionsSpy = null;
    let args = null;

    beforeEach(function () {
      initializeDateOptionsSpy = sinon.spy();
      initializeAllSelectionsSpy = sinon.spy();
      args = {
        date: initializeDateOptionsSpy,
        selections: initializeAllSelectionsSpy
      };

      // Call the function
      initializeAdditionalOptions(args);
    });

    afterEach(function () {
      initializeDateOptionsSpy = null;
      initializeAllSelectionsSpy = null;
      args = null;
    });

    it('should call `initializeDateOptions` with the correct arguments', function () {
      expect(initializeDateOptionsSpy.calledOnceWithExactly(), '`initializeDateOptions` should have been called with the correct arguments').to.be.true;
    });

    it('should call `initializeAllSelections` with the correct arguments', function () {
      expect(initializeAllSelectionsSpy.calledOnceWithExactly(), '`initializeAllSelections` should have been called with the correct arguments').to.be.true;
    });
  });
});
