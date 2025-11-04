import { displayCitations, fetchCitationFileText, handleTabClick } from '../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import { expect } from 'chai';
import { getActiveCitationTab } from '../../../../../../assets/scripts/datastores/partials/actions/action/citation/_tablist.js';
import sinon from 'sinon';

describe('citation', function () {
  let citationSpy = null;
  let getTabList = null;
  let getTab = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="citation">
        <div role="tablist" class="citation__tablist">
          <button type="button" role="tab" aria-selected="true" aria-controls="citation__mla--tabpanel">
            MLA
          </button>
          <button type="button" role="tab" aria-selected="false" aria-controls="citation__apa--tabpanel">
            APA
          </button>
        </div>
      </div>
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

  describe('fetchCitationFileText()', function () {
    let fetchStub = null;

    beforeEach(function () {
      fetchStub = sinon.stub(global, 'fetch');
    });

    afterEach(function () {
      fetchStub = null;
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
        const result = await fetchCitationFileText(style);

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
          await fetchCitationFileText(style);
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
          await fetchCitationFileText(style);
          expect.fail('Should have thrown fetch error');
        } catch (error) {
          // Check that the message matches the new error
          expect(error, 'the error message should now have the new error').to.equal(fakeError);
        }
      });
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
});
