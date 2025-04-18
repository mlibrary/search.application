import { expect } from 'chai';
import sinon from 'sinon';
import shelfBrowse from '../../../../../assets/scripts/datastores/record/partials/_shelf-browse';

describe('shelfBrowse', function () {
  beforeEach(function () {
    //
  });

  it('should be a function', function () {
    expect(shelfBrowse).to.be.a('function');
  });
});
