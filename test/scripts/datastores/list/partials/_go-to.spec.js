import {
  changeTemporaryListBannerCount,
  getTemporaryListBanner,
  temporaryListBanner,
  temporaryListBannerClass
} from '../../../../../assets/scripts/datastores/list/partials/_go-to.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('temporaryListBanner', function () {
  let getBanner = null;
  let getCountElement = null;
  const hiddenClass = 'hide__javascript';

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__go-to hide__javascript">
        <span class="strong list__go-to--count">0</span> in list
      </div>
    `;

    getBanner = () => {
      return document.querySelector('.list__go-to');
    };

    getCountElement = () => {
      return document.querySelector('.list__go-to--count');
    };
  });

  afterEach(function () {
    getBanner = null;
    getCountElement = null;
  });

  describe('getTemporaryListBanner()', function () {
    it('should return the temporary list banner element', function () {
      expect(getTemporaryListBanner(), '`getTemporaryListBanner` should return the correct element').to.deep.equal(getBanner());
    });
  });

  describe('changeTemporaryListBannerCount()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        banner: getBanner(),
        count: 5
      };

      // Call the function
      changeTemporaryListBannerCount(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the count element with the provided count', function () {
      expect(getCountElement().textContent, `The count element should have been changed to ${args.count}`).to.equal(String(args.count));
    });

    it('should set the count to 0 if the provided count is not a number', function () {
      // Set an invalid count
      args.count = 'invalid';

      // Call the function again
      changeTemporaryListBannerCount(args);

      // Verify the count is set to 0
      expect(getCountElement().textContent, 'The count element should be set to 0 for invalid count').to.equal('0');
    });
  });

  describe('temporaryListBannerClass()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        banner: getBanner(),
        count: 5
      };

      // Check that the hidden class is initially present
      expect(args.banner.classList.contains(hiddenClass), 'The banner should initially have the hidden class').to.be.true;

      // Check that the count is greater than 0
      expect(args.count, 'The count should be greater than 0').to.be.greaterThan(0);

      // Call the function
      temporaryListBannerClass(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should remove the hidden class when count is greater than 0', function () {
      expect(args.banner.classList.contains(hiddenClass), 'The banner should not have the hidden if the count is greater than 0').to.be.false;
    });

    it('should add the hidden class when count is 0', function () {
      // Set the count to 0
      args.count = 0;

      // Call the function again
      temporaryListBannerClass(args);

      // Check that the hidden class is added
      expect(args.banner.classList.contains(hiddenClass), 'The banner should have the hidden class when the count is 0').to.be.true;
    });
  });

  describe('temporaryListBanner()', function () {
    let temporaryListCountStub = null;
    let changeTemporaryListBannerCountSpy = null;
    let temporaryListBannerClassSpy = null;
    let args = null;

    beforeEach(function () {
      temporaryListCountStub = sinon.stub().returns(5);
      changeTemporaryListBannerCountSpy = sinon.spy();
      temporaryListBannerClassSpy = sinon.spy();

      args = {
        banner: getBanner(),
        countList: temporaryListCountStub,
        list: global.temporaryList,
        toggleClass: temporaryListBannerClassSpy,
        updateCount: changeTemporaryListBannerCountSpy
      };

      // Call the function
      temporaryListBanner(args);
    });

    afterEach(function () {
      temporaryListCountStub = null;
      changeTemporaryListBannerCountSpy = null;
      temporaryListBannerClassSpy = null;
      args = null;
    });

    it('should call `temporaryListCount` with the correct arguments', function () {
      expect(temporaryListCountStub.calledOnceWithExactly(args.list), '`temporaryListCount` should be called once with the correct arguments').to.be.true;
    });

    it('should call `changeTemporaryListBannerCount` with the correct arguments', function () {
      expect(changeTemporaryListBannerCountSpy.calledOnceWithExactly({ banner: args.banner, count: args.countList(args.list) }), '`changeTemporaryListBannerCount` should be called once with the correct arguments').to.be.true;
    });

    it('should call `temporaryListBannerClass` with the correct arguments', function () {
      expect(temporaryListBannerClassSpy.calledOnceWithExactly({ banner: args.banner, count: args.countList(args.list) }), '`temporaryListBannerClass` should be called once with the correct arguments').to.be.true;
    });

    it('should return early if the banner element is not provided', function () {
      // Set the banner to null
      args.banner = null;

      // Call the function again
      temporaryListBanner(args);

      // Check that the function does not throw an error
      expect(() => {
        return temporaryListBanner(args);
      }, 'The function should not throw an error when the banner is not provided').to.not.throw();
    });
  });
});
