import {
  buildCiteprocEngine,
  citationStyleCache,
  createCiteprocEngine,
  displayCitations,
  fetchCitationFiles,
  fetchCitationFileText,
  generateCitations,
  getBibliographyEntries,
  handleTabClick,
  initializeCitations,
  regenerateCitations,
  retrieveItem,
  selectedCitations,
  systemObject,
  updateAndAttachCitations,
  updateCitations
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import { filterSelectedRecords, getCheckedCheckboxes, splitCheckboxValue } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { getActiveCitationTab } from '../../../../../../assets/scripts/datastores/partials/actions/action/citation/_tablist.js';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const cslExample = `[{"id":"990052871530106381","type":"song","title":"The Da Vinci code /","edition":"Abridged.","ISBN":["9780739339787","0739339788","9780307879257","0307879259"],"call-number":"PS 3552 .R792 D2 2003b","publisher-place":"New York :","publisher":"Random House Audio,","issued":{"literal":"2003"},"author":[{"family":"Brown","given":"Dan,"},{"family":"Michael","given":"Paul."}]},{"id":"990006758990106381","type":"article-journal","title":"Birds.","ISSN":["0006-3665"],"call-number":"QL671 .B678","publisher-place":"Sandy, Bedfordshire, Eng. :","publisher":"Royal Society for the Protection of Birds","issued":{"literal":"1966-2013"},"author":[{"literal":"Royal Society for the Protection of Birds."}],"number":"v. 1- Jan./Feb. 1966-"},{"id":"990038939650106381","type":"motion_picture","title":"Dead or alive 2 : Tōbōsha = Dead or alive 2 : Birds /","call-number":"VIDEO-D 36841-D","publisher-place":"New York, NY :","publisher":"Kino on Video,","issued":{"literal":"2003"},"author":[{"family":"Miike","given":"Takashi,"},{"family":"Nakamura","given":"Masa."},{"family":"Masuda","given":"Yoshihiro."},{"family":"Okada","given":"Makoto."},{"family":"Kimura","given":"Toshiki."},{"family":"Aikawa","given":"Shō,"},{"family":"Takeuchi","given":"Riki."},{"family":"Chen","given":"Guanxi,"},{"family":"Endō","given":"Ken'ichi,"},{"literal":"Teah."},{"literal":"Daiē, Kabushiki Kaisha."},{"literal":"Tōei Bideo Kabushiki Kaisha."},{"literal":"Kino International Corporation."}]}]`;
const parsedCSL = JSON.parse(cslExample);
const cslIDs = parsedCSL.map((csl) => {
  return csl.id;
});

let temporaryListHTML = '';
nonEmptyDatastores(global.temporaryList).forEach((datastore) => {
  const recordIds = Object.keys(global.temporaryList[datastore]);
  recordIds.forEach((recordId, index) => {
    temporaryListHTML += `
      <div class="record__container" data-record-id="${recordId}" data-record-datastore="${datastore}">
        <input type="checkbox" class="list__item--checkbox" value="${datastore},${recordId}" ${index === 0 ? 'checked' : ''}>
      </div>
    `;
  });
});

describe('citation', function () {
  let citationSpy = null;
  let getTabList = null;
  let getTab = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <textarea class="citation__csl">
          ${cslExample}
        </textarea>
        <div role="tablist" class="citation__tablist">
          <button type="button" role="tab" aria-selected="true" aria-controls="citation__mla--tabpanel" data-citation-style="modern-language-association">
            MLA
          </button>
          <button type="button" role="tab" aria-selected="false" aria-controls="citation__apa--tabpanel" data-citation-style="apa">
            APA
          </button>
        </div>
      </div>
      <div id="citation__mla--tabpanel" role="tabpanel">
        <div role="textbox"></div>
      </div>
      <div id="citation__apa--tabpanel" role="tabpanel">
        <div role="textbox"></div>
      </div>
      <ol class="list__items">
        ${temporaryListHTML}
      </ol>
    `;

    citationSpy = sinon.spy();

    getTabList = () => {
      return document.querySelector('[role="tablist"]');
    };

    getTab = (type = 'mla') => {
      return document.querySelector(`[role="tab"][aria-controls="citation__${type}--tabpanel"]`);
    };
  });

  afterEach(function () {
    citationSpy = null;
    getTabList = null;
    getTab = null;
  });

  describe('selectedCitations()', function () {
    let splitValueSpy = null;
    let args = null;

    beforeEach(function () {
      splitValueSpy = sinon.spy(splitCheckboxValue);
      args = {
        filteredValues: filterSelectedRecords(),
        list: global.temporaryList,
        splitValue: splitValueSpy,
        type: 'csl'
      };
    });

    afterEach(function () {
      splitValueSpy = null;
      args = null;
    });

    it('should return `null` if no type is provided', function () {
      expect(selectedCitations({ list: args.list }), 'the return should be `null` if no type is provided').to.be.null;
    });

    it('should return `null` if the incorrect type is provided', function () {
      expect(selectedCitations({ ...args, type: 'wrong type' }), 'the return should be `null` if the incorrect type is provided').to.be.null;
    });

    it('should call `splitCheckboxValue` with the correct arguments', function () {
      // Call the function
      selectedCitations(args);

      // Check that `splitCheckboxValue` was called with the correct arguments
      expect(splitValueSpy.calledWithExactly({ value: getCheckedCheckboxes()[0].value }), '`splitCheckboxValue` should be called with the correct arguments').to.be.true;
    });

    it('should return an array', function () {
      expect(selectedCitations(args), '`selectedCitations(type)` should return an array').to.be.an('array');
    });

    it('should return the correct citation type', function () {
      ['csl', 'ris'].forEach((type) => {
        const { recordDatastore, recordId } = splitCheckboxValue({ value: getCheckedCheckboxes()[0].value });
        expect(selectedCitations({ ...args, type })[0], `\`citation.${type}\` values should be returned for each selected record`).to.deep.equal(global.temporaryList[recordDatastore][recordId].citation[type]);
      });
    });
  });

  describe('fetchCitationFileText()', function () {
    let fetchStub = null;
    let citationFileCache = null;

    beforeEach(function () {
      fetchStub = sinon.stub(global, 'fetch');
      citationFileCache = {};
    });

    afterEach(function () {
      fetchStub = null;
      citationFileCache = null;
    });

    describe('success', function () {
      it('should fetch the appropriate `.csl` file when a style is provided', async function () {
        // Create a mock response
        const style = 'apa';
        const mockText = 'Citation style data';
        const mockResponse = {
          ok: true,
          text: sinon.stub().resolves(mockText)
        };

        // Apply the mock response
        fetchStub.resolves(mockResponse);

        // Fetch the file
        const result = await fetchCitationFileText(style, citationFileCache);

        // Check that the correct `.csl` file was called
        expect(fetchStub.calledOnceWith(`/citations/${style}.csl`), `the correct \`.csl\` file should be called for \`${style}\``).to.be.true;

        // Check that the correct text was returned
        expect(result, 'the response should have returned the correct text').to.equal(mockText);
      });

      it('should fetch the locale `.xml` file when a style is not provided', async function () {
        // Create a mock response
        const mockText = 'Local XML data';
        const mockResponse = {
          ok: true,
          text: sinon.stub().resolves(mockText)
        };

        // Apply the mock response
        fetchStub.resolves(mockResponse);

        // Fetch the file
        const result = await fetchCitationFileText();

        // Check that the locale `.xml` file was called
        expect(fetchStub.calledOnceWith(`/citations/locales-en-US.xml`), 'the locale `.xml` file should have been called if a style was not provided').to.be.true;

        // Check that the correct text was returned
        expect(result, 'the response should have returned the correct text').to.equal(mockText);
      });

      it('should return cached result and not re-fetch for subsequent calls for the same style', async function () {
        const style = 'apa';
        const mockText = 'Citation style data';
        const mockResponse = {
          ok: true,
          text: sinon.stub().resolves(mockText)
        };

        fetchStub.resolves(mockResponse);

        // First fetch
        const result1 = await fetchCitationFileText(style, citationFileCache);
        expect(result1).to.equal(mockText);
        expect(fetchStub.calledOnce, 'fetch should be called once').to.be.true;

        // Reset the stub call count (if desired), but the cache should mean no network request
        fetchStub.resetHistory();

        // Second fetch: should come from cache, not call fetch again
        const result2 = await fetchCitationFileText(style, citationFileCache);
        expect(result2).to.equal(mockText);
        expect(fetchStub.notCalled, 'subsequent fetch from cache should not call fetch').to.be.true;
      });
    });

    describe('error', function () {
      it('should throw an error if fetch response is not ok', async function () {
        // Create a mock response
        const style = 'mla';
        const mockResponse = {
          ok: false,
          status: 404,
          statusText: 'Not Found',
          text: sinon.stub()
        };

        // Apply the mock response
        fetchStub.resolves(mockResponse);

        try {
          // Call the function
          await fetchCitationFileText(style, citationFileCache);
          expect.fail('Should have thrown error');
        } catch (error) {
          // Check that the message is correct
          expect(error.message, 'the error message should describe the specific file is being fetched and why it failed').to.include(`Fetching \`/citations/${style}.csl\` failed: ${mockResponse.status} ${mockResponse.statusText}`);
        }
      });

      it('should throw and error for network problems', async function () {
        // Create a new error
        const style = 'chicago';
        const fakeError = new Error('Network failure');

        // Apply the rejected response
        fetchStub.rejects(fakeError);

        try {
          // Call the function
          await fetchCitationFileText(style, citationFileCache);
          expect.fail('Should have thrown fetch error');
        } catch (error) {
          // Check that the message matches the new error
          expect(error, 'the error message should now have the new error').to.equal(fakeError);
        }
      });

      it('should remove cache if fetch fails and retry fetch on next call', async function () {
        const style = 'chicago';
        const mockText = 'Chicago style data';
        const fakeError = new Error('Network failure');

        // First attempt -- fails
        fetchStub.rejects(fakeError);

        // Should throw error and not leave cached promise
        try {
          await fetchCitationFileText(style, citationFileCache);
          expect.fail('Should have thrown fetch error');
        } catch (err) {
          expect(err).to.equal(fakeError);
        }

        // Now set fetchStub to succeed
        fetchStub.resetHistory();
        fetchStub.resolves({
          ok: true,
          text: sinon.stub().resolves(mockText)
        });

        // Next call should succeed and only call fetch once
        const result = await fetchCitationFileText(style, citationFileCache);
        expect(result).to.equal(mockText);
        expect(fetchStub.calledOnce, 'fetch should be called a second time after error removes cache').to.be.true;
      });
    });
  });

  describe('fetchCitationFiles()', function () {
    let style = null;
    let text = null;
    let calls = null;
    let styleFile = null;
    let localeFile = null;

    beforeEach(async function () {
      style = 'apa';
      text = {
        localeFile: 'Locale file text',
        styleFile: `Style file ${style}`
      };
      calls = [];
      const fetchFileText = (arg) => {
        calls.push(arg);
        if (!arg) {
          return text.localeFile;
        }
        return text.styleFile;
      };

      [styleFile, localeFile] = await fetchCitationFiles({ citationStyle: style, fetchFileText });
    });

    afterEach(function () {
      style = null;
      text = null;
      calls = null;
      styleFile = null;
      localeFile = null;
    });

    it('calls the function as expected', function () {
      expect(calls[0], 'the first called should have been the citation style').to.equal(style);
      expect(calls[1], 'a second call should not exist').to.be.undefined;
    });

    it('returns the expected files', function () {
      expect(styleFile, 'the citation file should have been returned if a style was provided').to.equal(text.styleFile);
      expect(localeFile, 'the locale file should have been returned if not style was provided').to.equal(text.localeFile);
    });
  });

  describe('retrieveItem()', function () {
    it('should return the item with the matching `id`', function () {
      // Set the index
      const index = 0;

      // Check that the correct item was retrieved
      expect(retrieveItem(cslIDs[index]), 'the provided `id` should have retrieved the matching item').to.deep.equal(parsedCSL[index]);
    });
  });

  describe('systemObject()', function () {
    let locale = null;
    let retrieveItemFunc = null;
    let calledWithId = null;
    let sys = null;

    beforeEach(function () {
      locale = '<xml>locale</xml>';
      retrieveItemFunc = (id) => {
        calledWithId = id;
        return { id };
      };

      // Assign the function
      sys = systemObject(locale, retrieveItemFunc);
    });

    afterEach(function () {
      locale = null;
      retrieveItemFunc = null;
      calledWithId = null;
      sys = null;
    });

    it('should return an object', function () {
      expect(sys, 'the function should have returned an object').to.be.an('object');
    });

    it('should contain the property functions `retrieveItem` and `retrieveLocale`', function () {
      ['retrieveItem', 'retrieveLocale'].forEach((prop) => {
        expect(sys, `\`systemObject\` should have the property \`${prop}\``).to.have.property(prop);
        expect(sys[prop], `\`${prop}\` should be a function`).to.be.a('function');
      });
    });

    it('`retrieveLocale` should return the provided locale', function () {
      expect(sys.retrieveLocale(), '').to.equal(locale);
    });

    it('`retrieveItem` should call the provided implementation with correct id', function () {
      // Set a test id
      const testId = 'test-id';

      // Call the function
      const result = sys.retrieveItem(testId);

      // Check that the function was called with the correct id
      expect(calledWithId, `the \`id\` should have returned \`${testId}\``).to.equal(testId);

      // Check that the result is as expected
      expect(result, 'the result should have returned an object with a defined `id` property containing the correct id').to.deep.equal({ id: testId });
    });
  });

  describe('createCiteprocEngine()', function () {
    let args = null;
    let engineObject = null;
    let engineStub = null;
    let sysObject = null;
    let result = null;

    beforeEach(function () {
      engineObject = {
        makeBibliography: sinon.spy(),
        updateItems: sinon.spy()
      };
      engineStub = sinon.stub().returns(engineObject);
      sysObject = 'SYS_OBJECT';

      args = {
        CSLModule: { Engine: engineStub },
        cslLocale: '<xml>locale</xml>',
        cslStyle: { style: 'apa' },
        sys: sinon.stub().returns(sysObject)
      };
      // Assign the result
      result = createCiteprocEngine(args);
    });

    afterEach(function () {
      args = null;
      engineObject = null;
      engineStub = null;
      sysObject = null;
      result = null;
    });

    it('calls the `sys` function with the provided locale', function () {
      expect(args.sys.calledOnceWithExactly(args.cslLocale), 'the `sys` function should have been called once with the provided locale').to.be.true;
    });

    it('creates a new CSL engine with the correct parameters', function () {
      expect(engineStub.calledOnceWithExactly(sysObject, args.cslStyle, 'en-US'), 'the CSL engine should have been created with the correct parameters').to.be.true;
    });

    it('returns the created CSL engine', function () {
      expect(result, 'the created CSL engine should have been returned').to.deep.equal(engineObject);
    });
  });

  describe('updateCitations()', function () {
    let citeprocEngine = null;

    beforeEach(function () {
      citeprocEngine = {
        updateItems: sinon.spy()
      };

      // Call the function
      updateCitations(citeprocEngine);
    });

    afterEach(function () {
      citeprocEngine = null;
    });

    it('should call `updateItems` on the provided CSL engine with the correct item IDs', function () {
      expect(citeprocEngine.updateItems.calledOnceWithExactly(cslIDs), '`updateItems` should have been called once with the correct item IDs').to.be.true;
    });
  });

  describe('getBibliographyEntries()', function () {
    let bibEntries = null;
    let makeBibliographyProperties = null;
    let makeBibliographyStub = null;
    let citeprocEngine = null;
    let result = null;

    beforeEach(function () {
      bibEntries = ['entry1', 'entry2'];
      makeBibliographyProperties = ['irrelevant', bibEntries];
      makeBibliographyStub = sinon.stub().returns(makeBibliographyProperties);
      citeprocEngine = {
        makeBibliography: makeBibliographyStub
      };

      // Assign the function
      result = getBibliographyEntries(citeprocEngine);
    });

    afterEach(function () {
      bibEntries = null;
      makeBibliographyProperties = null;
      makeBibliographyStub = null;
      citeprocEngine = null;
      result = null;
    });

    it('should call `makeBibliography`', function () {
      expect(makeBibliographyStub.calledOnce, '`makeBibliography` should have been called').to.be.true;
    });

    it('should return the second element from `makeBibliography`', function () {
      expect(result, 'the result should have returned the second element from `makeBibliography`').to.equal(makeBibliographyProperties[1]);
    });

    it('returns `undefined` if `makeBibliography` returns array with only one element', function () {
      // Modify the stub to return only one element
      citeprocEngine.makeBibliography = sinon.stub().returns(['justOne']);
      // Reassign the result
      result = getBibliographyEntries(citeprocEngine);

      // Make sure `makeBibliography` was still called
      expect(makeBibliographyStub.calledOnce, '`makeBibliography` should have been called').to.be.true;

      // Make sure the result returned `undefined`
      expect(result, 'the result should have returned `undefined`').to.be.undefined;
    });
  });

  describe('buildCiteprocEngine()', function () {
    let fetchFilesStub = null;
    let createEngineStub = null;
    let citationStyle = null;
    let cslStyle = null;
    let cslLocale = null;
    let result = null;

    beforeEach(async function () {
      citationStyle = 'mla';
      cslStyle = { style: 'mla' };
      cslLocale = '<xml>locale</xml>';

      fetchFilesStub = sinon.stub().resolves([cslStyle, cslLocale]);
      createEngineStub = sinon.stub().returns('CITEPROC_ENGINE');

      // Call the function
      result = await buildCiteprocEngine(citationStyle, fetchFilesStub, createEngineStub);
    });

    afterEach(function () {
      fetchFilesStub = null;
      createEngineStub = null;
      citationStyle = null;
      cslStyle = null;
      cslLocale = null;
      result = null;
    });

    it('should call `fetchFiles` with the provided citation style', function () {
      expect(fetchFilesStub.calledOnceWithExactly({ citationStyle }), '`fetchFiles` should have been called once with the provided citation style').to.be.true;
    });

    it('should call `createEngine` with the fetched style and locale', function () {
      expect(createEngineStub.calledOnceWithExactly({ cslLocale, cslStyle }), '`createEngine` should have been called once with the fetched style and locale').to.be.true;
    });

    it('should return the created CSL engine', function () {
      expect(result, 'the created CSL engine should have been returned').to.equal('CITEPROC_ENGINE');
    });
  });

  describe('updateAndAttachCitations()', function () {
    let attachStub = null;
    let getBibEntriesStub = null;
    let updateStub = null;
    let citeprocEngine = null;
    let tabPanel = null;

    beforeEach(function () {
      attachStub = sinon.stub();
      getBibEntriesStub = sinon.stub().returns(['entry1', 'entry2']);
      updateStub = sinon.stub();
      citeprocEngine = 'CITEPROC_ENGINE';
      tabPanel = 'TAB_PANEL';

      // Call the function
      updateAndAttachCitations({
        attach: attachStub,
        citeprocEngine,
        getBibEntries: getBibEntriesStub,
        tabPanel,
        update: updateStub
      });
    });

    afterEach(function () {
      attachStub = null;
      getBibEntriesStub = null;
      updateStub = null;
      citeprocEngine = null;
      tabPanel = null;
    });

    it('should call the `update` function with the provided CSL engine', function () {
      expect(updateStub.calledOnceWithExactly(citeprocEngine), '`update` should have been called once with the provided CSL engine').to.be.true;
    });

    it('should call the `getBibEntries` function with the provided CSL engine', function () {
      expect(getBibEntriesStub.calledOnceWithExactly(citeprocEngine), '`getBibEntries` should have been called once with the provided CSL engine').to.be.true;
    });

    it('should call the `attach` function with the tab panel and fetched bibliography entries', function () {
      expect(attachStub.calledOnceWithExactly(tabPanel, getBibEntriesStub()), '`attach` should have been called once with the tab panel and fetched bibliography entries').to.be.true;
    });
  });

  describe('generateCitations()', function () {
    let citationStyle = null;
    let tab = null;
    let tabPanel = null;
    let citeprocEngine = null;
    let buildEngineStub = null;
    let buildCitationsStub = null;
    let citationCache = null;
    let args = null;

    beforeEach(async function () {
      citationStyle = 'apa';
      tab = getTab(citationStyle);
      tabPanel = tab.getAttribute('aria-controls');
      citeprocEngine = 'fake-engine';
      buildEngineStub = sinon.stub().resolves(citeprocEngine);
      buildCitationsStub = sinon.stub();
      citationCache = [];
      args = {
        buildCitations: buildCitationsStub,
        buildEngine: buildEngineStub,
        citationCache,
        tab
      };

      // Call the function
      await generateCitations(args);
    });

    afterEach(function () {
      citationStyle = null;
      tab = null;
      tabPanel = null;
      citeprocEngine = null;
      buildEngineStub = null;
      buildCitationsStub = null;
      citationCache = null;
      args = null;
    });

    it('should call `buildEngine` with the correct citation style, if not cached', function () {
      expect(buildEngineStub.calledOnceWithExactly(citationStyle), `\`buildEngine\` should have been called with \`${citationStyle}\``).to.be.true;
    });

    it('should call `buildCitations` with correct `citeprocEngine` and `tabPanel`, if not cached', function () {
      expect(buildCitationsStub.calledOnceWithExactly({ citeprocEngine, tabPanel }), '`buildCitations` should have been called once with the created CSL engine and tab panel').to.be.true;
    });

    it('should cache the citation style after processing', function () {
      expect(citationCache.includes(citationStyle), 'Citation style should be cached').to.be.true;
    });

    it('should not reprocess a citation style that is already cached', async function () {
      // Reset call count
      buildEngineStub.resetHistory();
      buildCitationsStub.resetHistory();

      // Call the function again
      await generateCitations(args);

      // Check that the calls were ignored due to caching
      expect(buildEngineStub.notCalled, '`buildEngine` should NOT be called if citation style is cached').to.be.true;
      expect(buildCitationsStub.notCalled, '`buildCitations` should NOT be called if citation style is cached').to.be.true;
    });

    it('should process a new citation style that is not cached', async function () {
      // Simulate a new tab with a different citation style
      const newStyle = 'apa';
      buildEngineStub.withArgs(newStyle).resolves('fake-engine-apa');
      args.tab = getTab(newStyle);

      // Call the function again
      await generateCitations(args);
      expect(buildEngineStub.calledWithExactly(newStyle), '`buildEngine` should be called for new style').to.be.true;
      expect(citationCache.includes(newStyle), 'New citation style should be cached').to.be.true;
    });
  });

  describe('regenerateCitations()', function () {
    let citationsSpy = null;
    let activeTabExample = null;
    let activeTabStub = null;

    beforeEach(function () {
      // Reset cache for a clean start
      citationStyleCache.length = 0;

      // Check that cache is clear
      expect(citationStyleCache, '`citationStyleCache` should be empty').to.be.empty;

      // Cache styles
      citationStyleCache.push('apa', 'mla', 'chicago');

      // Check that styles are cached
      expect(citationStyleCache, '`citationStyleCache` should no longer be empty').to.not.be.empty;

      // Create spies and stubs
      citationsSpy = sinon.spy();
      activeTabExample = 'mockTab';
      activeTabStub = sinon.stub().returns(activeTabExample);

      // Call the function
      regenerateCitations(citationsSpy, activeTabStub);
    });

    afterEach(function () {
      citationsSpy = null;
      activeTabExample = null;
      activeTabStub = null;
    });

    it('should clear `citationStyleCache`', function () {
      expect(citationStyleCache, '`citationStyleCache` should have been cleared').to.deep.equal([]);
    });

    it('should call `citations` with the result of `activeTab`', function () {
      expect(citationsSpy.calledOnce, '`citations` should have been called once').to.be.true;
      expect(citationsSpy.calledOnceWithExactly({ tab: activeTabExample }), '`citations` should have been called with `activeTab`').to.be.true;
    });
  });

  describe('handleTabClick()', function () {
    beforeEach(function () {
      // Call the function with the spy
      handleTabClick(citationSpy);
    });

    it('should not call the function if a tab was not clicked', function () {
      // Click the tablist
      const clickEvent = new window.Event('click', { bubbles: true });
      getTabList().dispatchEvent(clickEvent);

      // Check that the function was not called
      expect(citationSpy.calledOnce, 'the function should not have been called if a tab was not clicked').to.be.false;
    });

    it('should not call the function if a tab was unselected on click', function () {
      // Get the `APA` tab
      const unselectedTab = getTab('apa');

      // Check that the tab is not selected
      expect(unselectedTab.getAttribute('aria-selected'), 'the `APA` tab should not be selected').to.equal('false');

      // Click the tab
      const clickEvent = new window.Event('click', { bubbles: true });
      unselectedTab.dispatchEvent(clickEvent);

      // Check that the function was not called
      expect(citationSpy.calledOnce, 'the function should not have been called if a tab was unselected').to.be.false;
    });

    it('should call the function if a tab was selected on click', function () {
      // Get the `MLA` tab
      const selectedTab = getTab('mla');

      // Check that the tab is selected
      expect(selectedTab.getAttribute('aria-selected'), 'the `MLA` tab should be selected').to.equal('true');

      // Click the tab
      const clickEvent = new window.Event('click', { bubbles: true });
      selectedTab.dispatchEvent(clickEvent);

      // Check that the function was not called
      expect(citationSpy.calledOnce, 'the function should have been called if a tab was selected').to.be.true;
    });
  });

  describe('displayCitations()', function () {
    let tabClickSpy = null;
    let callFunction = null;

    beforeEach(function () {
      tabClickSpy = sinon.spy();
      callFunction = () => {
        return displayCitations(citationSpy, tabClickSpy);
      };
    });

    afterEach(function () {
      tabClickSpy = null;
      callFunction = null;
    });

    it('should call the citations spy if there is an active tab', function () {
      // Check if there is an active tab
      expect(getActiveCitationTab(), 'a tab should be active').to.not.be.null;

      // Call the function
      callFunction();

      // Check that `citations` was called
      expect(citationSpy.calledOnce, 'the `citationSpy` should have been called once').to.be.true;
    });

    it('should not call the citations spy if there is no active tab', function () {
      // Make the active tab inactive
      getActiveCitationTab().setAttribute('aria-selected', 'false');
      expect(getActiveCitationTab(), 'a tab should not be active').to.be.null;

      // Call the function
      callFunction();

      // Check that `citations` was not called
      expect(citationSpy.calledOnce, 'the `citationSpy` should not have been called').to.be.false;
    });

    it('should call the `tabClick` function with `citations` stubbed', function () {
      // Call the function
      callFunction();

      // Check that the `tabClick` function was called
      expect(tabClickSpy.calledOnce, 'the `tabClick` should have been called once').to.be.true;

      // Check that `tabClickSpy` was called with `citationSpy`
      expect(tabClickSpy.calledOnceWithExactly(citationSpy), '`tabClickSpy` should have been called with `citationSpy` once').to.be.true;
    });
  });

  describe('initializeCitations()', function () {
    let citationTabsStub = null;
    let citationsStub = null;
    let copyCitationButtonStub = null;

    beforeEach(function () {
      citationTabsStub = sinon.stub();
      citationsStub = sinon.stub();
      copyCitationButtonStub = sinon.stub();

      // Call the function
      initializeCitations(citationsStub, copyCitationButtonStub, citationTabsStub);
    });

    afterEach(function () {
      citationTabsStub = null;
      citationsStub = null;
      copyCitationButtonStub = null;
    });

    it('should call `citationTabs` with the correct selector', function () {
      expect(citationTabsStub.calledOnceWithExactly('.citation'), '`citationTabs` should have been called once with the correct selector').to.be.true;
    });

    it('should call `citations`', function () {
      expect(citationsStub.calledOnce, '`citations` should have been called once').to.be.true;
    });

    it('should call `copyCitationButton`', function () {
      expect(copyCitationButtonStub.calledOnce, '`copyCitationButton` should have been called once').to.be.true;
    });
  });
});
