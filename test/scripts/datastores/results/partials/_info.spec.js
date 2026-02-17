import {
  hideInfo,
  hideInfoButton,
  toggleInfoSectionClass
} from '../../../../../assets/scripts/datastores/results/partials/_info.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('info', function () {
  let getButton = null;
  let getInfoSection = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="info-section" class="results__info" data-datastore="articles">
        <button class="results__info--hide" aria-controls="info-section">Hide</button>
      </div>
    `;

    getButton = () => {
      return document.querySelector('button');
    };

    getInfoSection = () => {
      return document.querySelector('.results__info');
    };
  });

  afterEach(function () {
    getButton = null;
    getInfoSection = null;
  });

  describe('hideInfoButton()', function () {
    it('should return the hide info button element', function () {
      expect(hideInfoButton(), '`hideInfoButton` should return the hide info button element').to.deep.equal(getButton());
    });
  });

  describe('toggleInfoSectionClass()', function () {
    let args = null;
    let hasHiddenClass = null;
    const hiddenClass = 'results__info--hidden';

    beforeEach(function () {
      args = {
        infoSection: getInfoSection(),
        isAdded: true
      };

      hasHiddenClass = () => {
        return getInfoSection().classList.contains(hiddenClass);
      };

      // Check that the info section does not have the hidden class to begin with
      expect(hasHiddenClass(), 'the info section should not have the `results__info--hidden` class').to.be.false;

      // Call the function
      toggleInfoSectionClass(args);
    });

    afterEach(function () {
      args = null;
      hasHiddenClass = null;
    });

    it(`should toggle the \`${hiddenClass}\` class`, function () {
      // Check that the class was added
      expect(hasHiddenClass(), `the record should have the \`${hiddenClass}\` class`).to.be.true;

      // Call the function again
      toggleInfoSectionClass({ ...args, isAdded: false });

      // Check that the class was removed
      expect(hasHiddenClass(), `the record should not have the \`${hiddenClass}\` class`).to.be.false;
    });
  });

  describe('hideInfo()', function () {
    let datastoreInfo = null;
    let getSessionStorageStub = null;
    let setSessionStorageStub = null;
    let toggleInfoSectionClassStub = null;
    let args = null;
    const itemName = 'datastoreInfo';

    beforeEach(function () {
      datastoreInfo = { articles: false };
      getSessionStorageStub = sinon.stub().returns(datastoreInfo);
      setSessionStorageStub = sinon.stub();
      toggleInfoSectionClassStub = sinon.stub();
      args = {
        button: getButton(),
        list: getSessionStorageStub(),
        setInfoSection: setSessionStorageStub,
        toggleInfoSection: toggleInfoSectionClassStub
      };

      // Call the function
      hideInfo(args);
    });

    afterEach(function () {
      datastoreInfo = null;
      getSessionStorageStub = null;
      setSessionStorageStub = null;
      toggleInfoSectionClassStub = null;
      args = null;
    });

    it('should initally call the `toggleInfoSectionClass` function with the correct arguments', function () {
      expect(toggleInfoSectionClassStub.calledWithExactly({ infoSection: args.button.parentElement, isAdded: false }), 'the `toggleInfoSection` function should be called once initially with the correct arguments').to.be.true;
    });

    it('should call `setSessionStorage` with the correct arguments on button click', function () {
      // Simulate a button click
      args.button.click();

      expect(setSessionStorageStub.calledWithExactly({ itemName, value: { ...datastoreInfo, articles: !datastoreInfo.articles } }), 'the `setSessionStorage` function should be called with the correct arguments on button click').to.be.true;
    });

    it('should call `toggleInfoSectionClass` again with the correct arguments on button click', function () {
      // Simulate a button click
      args.button.click();

      expect(toggleInfoSectionClassStub.calledWithExactly({ infoSection: args.button.parentElement, isAdded: !datastoreInfo.articles }), 'the `toggleInfoSectionClass` function should be called with the correct arguments on button click').to.be.true;
    });
  });
});
