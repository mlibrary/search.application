import { expect } from 'chai';
import sinon from 'sinon';
import { textAction } from '../../../../../../assets/scripts/datastores/partials/actions/action/_text.js';

describe('text', function () {
  let shareActionSpy = null;
  let args = null;

  beforeEach(function () {
    shareActionSpy = sinon.spy();
    args = {
      submitAction: shareActionSpy
    };

    // Call the function
    textAction(args);
  });

  afterEach(function () {
    shareActionSpy = null;
    args = null;
  });

  describe('textAction()', function () {
    it('should call `shareAction` with the correct arguments', function () {
      expect(shareActionSpy.calledWithExactly({ action: 'text' }), 'the `shareAction` function should be called with the correct arguments').to.be.true;
    });
  });
});
