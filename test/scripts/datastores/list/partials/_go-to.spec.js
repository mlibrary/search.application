import { expect } from 'chai';
import sinon from 'sinon';
import { temporaryListCount } from '../../../../../assets/scripts/datastores/list/layout.js';
import { toggleBanner } from '../../../../../assets/scripts/datastores/list/partials/_go-to.js';

describe('toggleBanner', function () {
  let temporaryListCountStub = null;
  let changeCountStub = null;
  let args = null;
  let getBanner = null;
  const emptyClass = 'list__go-to--empty';

  beforeEach(function () {
    temporaryListCountStub = sinon.stub().returns(5);
    changeCountStub = sinon.stub();
    args = {
      countList: temporaryListCountStub,
      countPartial: changeCountStub,
      list: global.temporaryList
    };

    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__go-to ${emptyClass}"></div>
    `;

    getBanner = () => {
      return document.querySelector('.list__go-to');
    };

    // Check that the empty class is present initially
    expect(getBanner().classList.contains(emptyClass), 'the empty class should be present initially').to.be.true;

    // Call the function
    toggleBanner(args);
  });

  afterEach(function () {
    temporaryListCountStub = null;
    changeCountStub = null;
    args = null;
    getBanner = null;
  });

  it('should call `temporaryListCount` with the correct arguments', function () {
    expect(temporaryListCountStub.calledOnceWithExactly(args.list), 'temporaryListCount should be called once with the correct list argument').to.be.true;
  });

  it('should call `changeCount` with the correct arguments', function () {
    expect(changeCountStub.calledOnceWithExactly(temporaryListCount(global.temporaryList)), 'changeCount should be called once with the correct count argument').to.be.true;
  });

  it('should remove the empty class from the banner if the count is greater than 0', function () {
    expect(getBanner().classList.contains(emptyClass), 'the empty class should be removed when count is greater than 0').to.be.false;
  });

  it('should add the empty class to the banner if the count is 0', function () {
    // Update the stub to return 0
    temporaryListCountStub.returns(0);

    // Call the function again
    toggleBanner(args);

    expect(getBanner().classList.contains(emptyClass), 'the empty class should be added when count is 0').to.be.true;
  });

  it('should do nothing if the banner is not found', function () {
    // Remove the banner from the DOM
    document.body.innerHTML = '';

    // Check that the banner is not found
    expect(getBanner(), 'the banner should not be found').to.be.null;

    // Call the function again
    expect(() => {
      return toggleBanner(args);
    }, 'calling toggleBanner with no banner should not throw an error').to.not.throw();
  });
});
