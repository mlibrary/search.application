import { expect } from 'chai';
import { initializeAdditionalOptions } from '../../../../assets/scripts/advanced/partials/_additional-options.js';
import sinon from 'sinon';

describe('additional search options', function () {
  describe('initializeAdditionalOptions()', function () {
    let initializeAllSelectionsSpy = null;
    let args = null;

    beforeEach(function () {
      initializeAllSelectionsSpy = sinon.spy();
      args = {
        selections: initializeAllSelectionsSpy
      };

      // Call the function
      initializeAdditionalOptions(args);
    });

    it('should call `initializeAllSelections` with the correct arguments', function () {
      expect(initializeAllSelectionsSpy.calledOnceWithExactly(), '`initializeAllSelections` should have been called with the correct arguments').to.be.true;
    });
  });
});
