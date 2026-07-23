import { expect } from 'chai';
import { initializeAdditionalOptions } from '../../../../assets/scripts/advanced/partials/_additional-options.js';
import sinon from 'sinon';

describe('additional search options', function () {
  describe('initializeAdditionalOptions()', function () {
    let initializeSelectionsSpy = null;
    let args = null;

    beforeEach(function () {
      initializeSelectionsSpy = sinon.spy();
      args = {
        selections: initializeSelectionsSpy
      };

      // Call the function
      initializeAdditionalOptions(args);
    });

    it('should call `initializeSelections` with the correct arguments', function () {
      expect(initializeSelectionsSpy.calledOnceWithExactly(), '`initializeSelections` should have been called with the correct arguments').to.be.true;
    });
  });
});
