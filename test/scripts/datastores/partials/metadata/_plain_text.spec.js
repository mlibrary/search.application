import {
  appendPlainTextMetadataPartial,
  clonePlainTextMetadataPartial,
  getPlainTextMetadataPartial,
  updatePlainTextMetadataPartial
} from '../../../../../assets/scripts/datastores/partials/metadata/_plain_text.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('plain_text metadata partial', function () {
  let getListItem = null;
  let getMetadataTable = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <table class="metadata">
      </table>
      <li class="results__list-item">
        <ul class="metadata__list--plain_text" id="metadata__toggle--field-1337">
          <li>
            <ul class="list__no-style metadata__list--parallel">
              <li>Original Data</li>
              <li>Transliterated Data</li>
            </ul>
          </li>
        </ul>
      </li>
    `;

    getListItem = () => {
      return document.querySelector('.results__list-item');
    };
    getMetadataTable = () => {
      return document.querySelector('.metadata');
    };
  });

  afterEach(function () {
    getListItem = null;
    getMetadataTable = null;
  });

  describe('getPlainTextMetadataPartial()', function () {
    it('should return the correct plain_text metadata partial', function () {
      expect(getPlainTextMetadataPartial({ listItem: getListItem() }), '`getPlainTextMetadataPartial` should return the correct plain_text metadata partial').to.equal(document.querySelector('.metadata__list--plain_text'));
    });
  });

  describe('clonePlainTextMetadataPartial()', function () {
    let getPlainTextMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      getPlainTextMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return getPlainTextMetadataPartial({ listItem });
      });
      args = {
        getPlainTextPartial: getPlainTextMetadataPartialStub,
        listItem: getListItem()
      };

      // Call the function
      clonePlainTextMetadataPartial(args);
    });

    afterEach(function () {
      getPlainTextMetadataPartialStub = null;
      args = null;
    });

    it('should call `getPlainTextMetadataPartial` with the correct arguments', function () {
      expect(getPlainTextMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`getPlainTextMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should clone the partial', function () {
      expect(clonePlainTextMetadataPartial({ listItem: args.listItem }).isEqualNode(getPlainTextMetadataPartial({ listItem: args.listItem })), '`cloneMetadataRow` should clone the metadata row').to.be.true;
    });
  });

  describe('updatePlainTextMetadataPartial()', function () {
    let clonePlainTextMetadataPartialSpy = null;
    let args = null;

    beforeEach(function () {
      clonePlainTextMetadataPartialSpy = sinon.spy();
      args = {
        clonedPlainTextPartial: clonePlainTextMetadataPartialSpy,
        listItem: getListItem()
      };

      // Call the function
      updatePlainTextMetadataPartial(args);
    });

    afterEach(function () {
      clonePlainTextMetadataPartialSpy = null;
      args = null;
    });

    it('should call `clonePlainTextMetadataPartial` with the correct arguments', function () {
      expect(clonePlainTextMetadataPartialSpy.calledOnceWithExactly({ listItem: args.listItem }), '`clonePlainTextMetadataPartial` should have been called with the correct arguments').to.be.true;
    });
  });

  describe('appendPlainTextMetadataPartial()', function () {
    let updatePlainTextMetadataPartialStub = null;
    let args = null;

    beforeEach(function () {
      updatePlainTextMetadataPartialStub = sinon.stub().callsFake(({ listItem }) => {
        return updatePlainTextMetadataPartial({ listItem });
      });
      args = {
        listItem: getListItem(),
        metadataTable: getMetadataTable(),
        updatePlainTextPartial: updatePlainTextMetadataPartialStub
      };

      // Call the function
      appendPlainTextMetadataPartial(args);
    });

    afterEach(function () {
      updatePlainTextMetadataPartialStub = null;
      args = null;
    });

    it('should call `updatePlainTextMetadataPartial` with the correct arguments', function () {
      expect(updatePlainTextMetadataPartialStub.calledOnceWithExactly({ listItem: args.listItem }), '`updatePlainTextMetadataPartial` should have been called with the correct arguments').to.be.true;
    });

    it('should append the cloned partial to the metadata table', function () {
      expect(args.metadataTable.contains(updatePlainTextMetadataPartialStub.returnValues[0]), '`appendPlainTextMetadataPartial` should append the cloned partial to the metadata table').to.be.true;
    });
  });
});
