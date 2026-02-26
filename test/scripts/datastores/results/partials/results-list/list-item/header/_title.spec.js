import {
  getListItemTitleElement,
  updateListItemTitle,
  updateListItemTitleAnchor,
  updateListItemTitleNumber,
  updateListItemTitleTransliterated
} from '../../../../../../../../assets/scripts/datastores/results/partials/results-list/list-item/header/_title.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('list item title', function () {
  let getListItem = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <li>
        <div class="results__list-item--header">
          <h3 class="results__list-item--title">
            <span class="results__list-item--title-number">1.</span>
            <a href="catalog/record/1337" class="results__list-item--title-original">Original Title</a>
            <span class="results__list-item--title-transliterated">
              Transliterated Title
            </span>
          </h3>
        </div>
      </li>
    `;

    getListItem = () => {
      return document.querySelector('li');
    };
  });

  afterEach(function () {
    getListItem = null;
  });

  describe('getListItemTitleElement()', function () {
    it('should return the title element', function () {
      expect(getListItemTitleElement({ listItem: getListItem() }), '`getListItemTitleElement` should return the title element').to.deep.equal(getListItem().querySelector('.results__list-item--title'));
    });
  });

  describe('updateListItemTitleNumber()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        element: getListItem(),
        index: 4
      };

      // Call the function
      updateListItemTitleNumber(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should update the number to be one higher than the index', function () {
      expect(getListItem().querySelector('.results__list-item--title-number').textContent, '`updateListItemTitleNumber` should update the number to be one higher than the index').to.equal(`${args.index + 1}.`);
    });
  });

  describe('updateListItemTitleAnchor()', function () {
    let args = null;
    let getAnchor = null;

    beforeEach(function () {
      args = {
        element: getListItem(),
        title: 'New Title',
        url: 'https://search.umich.edu/'
      };

      getAnchor = () => {
        return args.element.querySelector('a');
      };

      // Call the function
      updateListItemTitleAnchor(args);
    });

    afterEach(function () {
      args = null;
      getAnchor = null;
    });

    it('should update the `href` attribute', function () {
      expect(getAnchor().getAttribute('href'), '`updateListItemTitleAnchor` should update the `href` attribute').to.equal(args.url);
    });

    it('should update the anchor text', function () {
      expect(getAnchor().textContent, '`updateListItemTitleAnchor` should update the anchor text').to.equal(args.title);
    });
  });

  describe('updateListItemTitleTransliterated()', function () {
    let args = null;
    let getTransliterated = null;

    beforeEach(function () {
      args = {
        element: getListItem(),
        title: 'New Title'
      };

      getTransliterated = () => {
        return args.element.querySelector('.results__list-item--title-transliterated');
      };

      // Check that the transliterated element exists before testing
      expect(getTransliterated(), 'the transliterated element should exist before testing').to.not.be.null;

      // Call the function
      updateListItemTitleTransliterated(args);
    });

    afterEach(function () {
      args = null;
      getTransliterated = null;
    });

    it('should update the title text', function () {
      expect(getTransliterated().textContent, '`updateListItemTitleTransliterated` should update the title text').to.equal(args.title);
    });

    it('should remove the title element', function () {
      // Update the title to be `null`
      args.title = null;

      // Call the function again
      updateListItemTitleTransliterated(args);

      // Check that the transliterated element no longer exists
      expect(getTransliterated(), 'the transliterated element should not exist if the `title` is `null`').to.be.null;
    });
  });

  describe('updateListItemTitle()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        getTitleElement: sinon.stub().returns(getListItemTitleElement({ listItem: getListItem() })),
        index: 4,
        listItem: getListItem(),
        title: {
          original: 'Original Title',
          transliterated: 'Transliterated Title'
        },
        updateTitleFunctions: {
          updateListItemTitleAnchor: sinon.spy(),
          updateListItemTitleNumber: sinon.spy(),
          updateListItemTitleTransliterated: sinon.spy()
        },
        url: 'https://search.umich.edu/'
      };
    });

    afterEach(function () {
      args = null;
    });

    describe('title element exists', function () {
      beforeEach(function () {
        // Check that the element exists
        expect(args.getTitleElement(), 'the title element should exist before testing').to.not.be.null;

        // Call the function
        updateListItemTitle(args);
      });

      it('should call `getListItemTitleElement` with the correct arguments', function () {
        expect(args.getTitleElement.calledWithExactly({ listItem: args.listItem }), '`getListItemTitleElement` should call `getListItemTitleElement` with the correct arguments').to.be.true;
      });

      it('should call `updateListItemTitleNumber` with the correct arguments', function () {
        expect(args.updateTitleFunctions.updateListItemTitleNumber.calledOnceWithExactly({ element: args.getTitleElement(), index: args.index }), '`updateListItemTitleNumber` should call `updateListItemTitleNumber` with the correct arguments').to.be.true;
      });

      it('should call `updateListItemTitleAnchor` with the correct arguments', function () {
        expect(args.updateTitleFunctions.updateListItemTitleAnchor.calledOnceWithExactly({ element: args.getTitleElement(), title: args.title.original, url: args.url }), '`updateListItemTitleAnchor` should call `updateListItemTitleAnchor` with the correct arguments').to.be.true;
      });

      it('should call `updateListItemTitleTransliterated` with the correct arguments', function () {
        expect(args.updateTitleFunctions.updateListItemTitleTransliterated.calledOnceWithExactly({ element: args.getTitleElement(), title: args.title.transliterated }), '`updateListItemTitleTransliterated` should call `updateListItemTitleTransliterated` with the correct arguments').to.be.true;
      });
    });

    describe('title element does not exist', function () {
      beforeEach(function () {
        // Check that the element does not exist
        args.getTitleElement = sinon.stub().returns(null);
        expect(args.getTitleElement(), 'the title element should not exist before testing').to.be.null;

        // Call the function
        updateListItemTitle(args);
      });

      it('should call `getListItemTitleElement` with the correct arguments', function () {
        expect(args.getTitleElement.calledWithExactly({ listItem: args.listItem }), '`getListItemTitleElement` should call `getListItemTitleElement` with the correct arguments').to.be.true;
      });

      it('should not call `updateListItemTitleNumber`', function () {
        expect(args.updateTitleFunctions.updateListItemTitleNumber.notCalled, '`updateListItemTitleNumber` should not be called').to.be.true;
      });

      it('should not call `updateListItemTitleAnchor`', function () {
        expect(args.updateTitleFunctions.updateListItemTitleAnchor.notCalled, '`updateListItemTitleAnchor` should not be called').to.be.true;
      });

      it('should not call `updateListItemTitleTransliterated`', function () {
        expect(args.updateTitleFunctions.updateListItemTitleTransliterated.notCalled, '`updateListItemTitleTransliterated` should not be called').to.be.true;
      });
    });
  });
});
