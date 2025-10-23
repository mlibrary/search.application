import { downloadRISFormSubmit, downloadTemporaryListRIS, generateRISDownloadAnchor, generateRISFile, generateRISFileName } from '../../../../../../assets/scripts/datastores/partials/actions/action/_ris.js';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { selectedCitations } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import sinon from 'sinon';
import { viewingTemporaryList } from '../../../../../../assets/scripts/datastores/list/layout.js';

describe('RIS', function () {
  let getForm = null;
  let createObjectURLStub = null;
  let revokeObjectURLStub = null;
  let anchorSpy = null;

  beforeEach(function () {
    document.body.innerHTML = `
      <form method="post" action="/ris" class="action__ris">
        <button type="submit">Download RIS</button>
      </form>
    `;

    getForm = () => {
      return document.querySelector('.action__ris');
    };

    // Setup globals with stubs
    global.Blob = window.Blob;
    global.URL = window.URL;
    // Provide the properties if missing
    if (!('createObjectURL' in global.URL)) {
      global.URL.createObjectURL = () => {
        //
      };
    }
    if (!('revokeObjectURL' in global.URL)) {
      global.URL.revokeObjectURL = () => {
        //
      };
    }

    createObjectURLStub = sinon.stub(global.URL, 'createObjectURL').returns('blob:something');
    revokeObjectURLStub = sinon.stub(global.URL, 'revokeObjectURL').returns(null);

    global.sessionStorage = window.sessionStorage;
    // Set a temporary list in session storage
    global.sessionStorage.setItem('temporaryList', JSON.stringify(global.temporaryList));

    anchorSpy = {
      click: sinon.spy(),
      set download (val) {
        this.downloadValue = val;
      },
      get download () {
        return this.downloadValue;
      },
      set href (val) {
        this.hrefValue = val;
      },
      get href () {
        return this.hrefValue;
      }
    };

    createObjectURLStub.returns(anchorSpy.href);
    revokeObjectURLStub.returns(null);

    // Replace document.createElement to spy on anchor properties
    sinon.stub(document, 'createElement').callsFake((tagName) => {
      if (tagName === 'a') {
        return anchorSpy;
      }
      // Fall back to default
      return document.createElement.wrappedMethod.call(document, tagName);
    });
  });

  afterEach(function () {
    getForm = null;
    createObjectURLStub = null;
    revokeObjectURLStub = null;
    anchorSpy = null;

    // Cleanup
    delete global.Blob;
    delete global.sessionStorage;
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

  describe('generateRISFile', function () {
    it('should return a Blob object', function () {
      expect(generateRISFile(), '`generateRISFile()` should return a Blob').to.be.instanceOf(Blob);
    });

    it('should return an `ris` type', function () {
      const result = generateRISFile();
      expect(result.type, 'the type should return `application/x-research-info-systems`').to.equal('application/x-research-info-systems');
    });

    it('should return the generated RIS content', function () {
      const result = generateRISFile();
      const reader = new window.FileReader();
      return new Promise((resolve, reject) => {
        reader.onload = function () {
          try {
            expect(reader.result, 'the Blob `text` property should return a string').to.be.a.string;
            expect(reader.result, 'the Blob `text` property should return a joined string of `selectedCitations(\'ris\')`').to.deep.equal(selectedCitations('ris').join('\n\n'));
            resolve();
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsText(result);
      });
    });
  });

  describe('generateRISDownloadAnchor', function () {
    beforeEach(function () {
      // Call the function
      generateRISDownloadAnchor();
    });

    it('should create an anchor element', function () {
      expect(document.createElement.calledWith('a'), 'an anchor element should be been created').to.be.true;
    });

    it('should assign `generateRISFileName()` to the `download` attribute', function () {
      expect(anchorSpy.download, 'the `download` attribute should equal `generateRISFileName()`').to.equal(generateRISFileName());
    });

    it('should click the anchor element', function () {
      expect(anchorSpy.click.calledOnce, 'the anchor element should have been clicked').to.be.true;
    });

    it('should assign `URL.createObjectURL(generateRISFile())` to the `href` attribute', function () {
      expect(createObjectURLStub.calledWith(generateRISFile()), 'the `href` attribute should have been assigned `URL.createObjectURL(generateRISFile())`').to.be.true;
    });

    it('should have `URL.revokeObjectURL()` called with the `href` value', function () {
      expect(revokeObjectURLStub.calledWith(anchorSpy.href), '`URL.revokeObjectURL()` should have been called with the `href` value').to.be.true;
    });
  });

  describe('downloadRISFormSubmit()', function () {
    it('should return `generateRISFileName()`', function () {
      // Create a spy
      const event = { preventDefault: sinon.spy() };
      // Save the called function
      const result = downloadRISFormSubmit(event);

      // Check that `preventDefault` was called
      expect(event.preventDefault.calledOnce, 'preventDefault should have been called once').to.be.true;

      // Check that `generateRISDownloadAnchor()` was called
      expect(result, `${generateRISDownloadAnchor()} should have been returned`).to.equal(generateRISDownloadAnchor());
    });
  });

  describe('downloadTemporaryListRIS()', function () {
    describe('when not viewing the temporary list', function () {
      beforeEach(function () {
        // Check that Temporary List is not being viewed
        expect(viewingTemporaryList(), 'the current pathname should not be `/everything/list`').to.be.false;

        // Call the function
        downloadTemporaryListRIS();
      });

      it('should not return anything', function () {
        expect(downloadTemporaryListRIS()).to.be.undefined;
      });
    });

    describe('when viewing the temporary list', function () {
      let originalWindow = null;

      beforeEach(function () {
        // Save the original window object
        originalWindow = global.window;

        // Setup JSDOM with an updated URL
        const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
          url: 'http://localhost/everything/list'
        });

        // Override the global window object
        global.window = dom.window;

        // Check that Temporary List is being viewed
        expect(viewingTemporaryList(), 'the current pathname should be `/everything/list`').to.be.true;
      });

      afterEach(function () {
        // Restore the original window object
        global.window = originalWindow;
      });

      it('should call `downloadRISFormSubmit()`', function () {
        // Call the function with a stubbed reload function
        const downloadStub = sinon.stub();
        downloadTemporaryListRIS(downloadStub);

        const event = new window.Event('submit', { bubbles: true, cancelable: true });
        getForm().dispatchEvent(event);

        expect(downloadStub.calledOnce, '`downloadRISFormSubmit` should have been called once').to.be.true;
      });
    });
  });
});
