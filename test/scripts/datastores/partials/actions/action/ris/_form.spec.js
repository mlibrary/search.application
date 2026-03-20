import {
  downloadRISFormSubmit,
  generateRISDownloadAnchor,
  generateRISFile,
  generateRISFileName,
  handleRISFormSubmit
} from '../../../../../../../assets/scripts/datastores/partials/actions/action/ris/_form.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('RIS', function () {
  let getForm = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <form method="post" action="/ris" class="action__ris">
        <button type="submit">Download RIS</button>
      </form>
    `;

    getForm = () => {
      return document.querySelector('form.action__ris');
    };
  });

  afterEach(function () {
    getForm = null;
  });

  describe('generateRISFileName()', function () {
    it('should return a filename with today\'s date', function () {
      // Get today's date
      const today = new Date();
      const formattedDate = today.toISOString().slice(0, 10);
      const expectedFileName = `MyTemporaryList-${formattedDate}.ris`;

      expect(generateRISFileName(), `the filename should be ${expectedFileName}`).to.equal(expectedFileName);
    });
  });

  describe('generateRISFile()', function () {
    let citationsStub = null;
    let risCitations = null;
    let list = null;
    let args = null;

    beforeEach(function () {
      list = global.temporaryList;
      risCitations = Object.values(list).map((datastore) => {
        return Object.values(datastore).map((record) => {
          return record.citation.ris;
        });
      }
      );
      citationsStub = sinon.stub().returns(risCitations);
      args = {
        citations: citationsStub,
        list
      };
    });

    afterEach(function () {
      citationsStub = null;
      risCitations = null;
      list = null;
      args = null;
    });

    it('should generate a Blob object', function () {
      // Assign the function
      const risFile = generateRISFile(args);

      // Check that it's a Blob
      expect(risFile instanceof Blob, 'the generated RIS file should be a Blob').to.be.true;
    });

    it('should call the citations function with correct arguments', function () {
      // Call the function
      generateRISFile(args);

      // Check that the citations function was called with correct arguments
      expect(citationsStub.calledOnceWithExactly({ list: args.list, type: 'ris' }), 'the citations function should be called with the correct arguments').to.be.true;
    });

    it('should have the correct MIME type', function () {
      // Assign the function
      const risFile = generateRISFile(args);

      // Check the MIME type
      expect(risFile.type, 'the generated RIS file should have the correct MIME type').to.equal('application/x-research-info-systems');
    });

    it('should contain the correct content', function () {
      // Assign the function
      const risFile = generateRISFile(args);

      // Read the Blob content
      return risFile.text().then((text) => {
        // Check the content
        expect(text, 'the generated RIS file should contain the correct content').to.equal(risCitations.join('\n\n'));
      });
    });
  });

  describe('generateRISDownloadAnchor()', function () {
    let createElementSpy = null;
    let urlExample = null;
    let createObjectURLStub = null;
    let generateFileStub = null;
    let fileNameExample = null;
    let generateFileNameStub = null;
    let revokeObjectURLStub = null;
    let args = null;
    let anchorElement = null;

    beforeEach(function () {
      createElementSpy = sinon.spy(document, 'createElement');
      urlExample = 'blob:http://example.com/test-blob-url';
      createObjectURLStub = sinon.stub(URL, 'createObjectURL').returns(urlExample);
      generateFileStub = sinon.stub().returns(new Blob(['Test content'], { type: 'application/x-research-info-systems' }));
      fileNameExample = 'TestFileName.ris';
      generateFileNameStub = sinon.stub().returns(fileNameExample);
      revokeObjectURLStub = sinon.stub(URL, 'revokeObjectURL');
      args = {
        generateFile: generateFileStub,
        generateFileName: generateFileNameStub,
        list: global.temporaryList
      };

      // Resolve `Not implemented: navigation to another Document`
      sinon.stub(window.HTMLAnchorElement.prototype, 'click').callsFake(() => {
        // Do nothing
      });

      // Call the function
      generateRISDownloadAnchor(args);

      // Get the created anchor element
      [anchorElement] = createElementSpy.returnValues;
    });

    afterEach(function () {
      createElementSpy = null;
      urlExample = null;
      createObjectURLStub = null;
      generateFileStub = null;
      fileNameExample = null;
      generateFileNameStub = null;
      revokeObjectURLStub = null;
      args = null;
      anchorElement = null;

      window.HTMLAnchorElement.prototype.click.restore();
    });

    it('should create an anchor element', function () {
      // Check that and anchor was created
      expect(createElementSpy.calledWith('a'), '`document.createElement` should be called with `a').to.be.true;
    });

    it('should call `generateFile` with correct arguments', function () {
      // Check that generateFile was called with correct arguments
      expect(generateFileStub.calledOnceWithExactly({ list: args.list }), '`generateFile` should be called with the correct arguments').to.be.true;
    });

    it('should call `generateFileName` with correct arguments', function () {
      // Check that `generateFileName` was called
      expect(generateFileNameStub.calledOnce, '`generateFileName` should be called once').to.be.true;
    });

    it('should call `URL.createObjectURL` with the generated Blob', function () {
      // Get the generated Blob
      const [generatedBlob] = generateFileStub.returnValues;

      // Check that it was called with the correct Blob
      expect(createObjectURLStub.calledOnceWithExactly(generatedBlob), '`URL.createObjectURL` should be called with the generated Blob').to.be.true;
    });

    it('should set the anchor `href` attribute correctly', function () {
      // Check that the anchor's `href` attribute is set correctly
      expect(anchorElement.href, 'the anchor href should be set correctly').to.equal(urlExample);
    });

    it('should set the anchor `download` attribute correctly', function () {
      // Check that the anchor's `download` attribute is set correctly
      expect(anchorElement.download, 'the anchor download attribute should be set correctly').to.equal(fileNameExample);
    });

    it('should call the anchor click method', function () {
      // Check that the anchor's click method was called
      expect(window.HTMLAnchorElement.prototype.click.calledOnce, 'the anchor click method should be called once').to.be.true;
    });

    it('should revoke the object URL after clicking', function () {
      // Check that the object URL was revoked
      expect(revokeObjectURLStub.calledOnceWithExactly(anchorElement.href), '`URL.revokeObjectURL` should be called with the anchor href').to.be.true;
    });
  });

  describe('handleRISFormSubmit()', function () {
    let generateRISDownloadAnchorSpy = null;
    let args = null;

    beforeEach(function () {
      generateRISDownloadAnchorSpy = sinon.spy();
      args = {
        event: {
          preventDefault: sinon.spy(),
          target: getForm()
        },
        generateDownloadAnchor: generateRISDownloadAnchorSpy,
        list: global.temporaryList
      };
    });

    afterEach(function () {
      generateRISDownloadAnchorSpy = null;
      args = null;
    });

    describe('when the form has a non-empty `action` attribute', function () {
      beforeEach(function () {
        // Check that the action attribute is non-empty
        expect(args.event.target.getAttribute('action'), 'the form action attribute should be non-empty').to.not.be.empty;

        // Call the function again
        handleRISFormSubmit(args);
      });

      it('should prevent the default form submission', function () {
        // Check that preventDefault was called
        expect(args.event.preventDefault.calledOnce, '`event.preventDefault` should have been called once').to.be.true;
      });

      it('should not call `generateDownloadAnchor`', function () {
        // Check that generateDownloadAnchor was not called
        expect(generateRISDownloadAnchorSpy.notCalled, '`generateDownloadAnchor` should not be called').to.be.true;
      });
    });

    describe('when the form has an empty `action` attribute', function () {
      beforeEach(function () {
        // Check that the action attribute is empty
        args.event.target.setAttribute('action', '');
        expect(args.event.target.getAttribute('action'), 'the form action attribute should be empty').to.be.empty;

        // Call the function again
        handleRISFormSubmit(args);
      });

      it('should prevent the default form submission', function () {
        // Check that preventDefault was called
        expect(args.event.preventDefault.calledOnce, '`event.preventDefault` should have been called once').to.be.true;
      });

      it('should call `generateDownloadAnchor` with correct arguments', function () {
        // Check that generateDownloadAnchor was called with correct arguments
        expect(generateRISDownloadAnchorSpy.calledOnceWithExactly({ list: args.list }), '`generateDownloadAnchor` should be called with the correct arguments').to.be.true;
      });
    });
  });

  describe('downloadRISFormSubmit()', function () {
    let handleRISFormSubmitSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      handleRISFormSubmitSpy = sinon.spy();
      args = {
        download: handleRISFormSubmitSpy,
        list: global.temporaryList
      };

      // Call the function
      downloadRISFormSubmit(args);

      // Dispatch the submit event
      event = new window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      getForm().dispatchEvent(event);
    });

    afterEach(function () {
      handleRISFormSubmitSpy = null;
      args = null;
      event = null;
    });

    it('should call `handleRISFormSubmit` with the correct arguments', function () {
      expect(handleRISFormSubmitSpy.calledOnceWithExactly({ event, list: args.list }), '`handleRISFormSubmit` should be called with the correct arguments').to.be.true;
    });
  });
});
