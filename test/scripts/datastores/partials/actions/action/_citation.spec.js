import { expect } from 'chai';
import { handleTabClick } from '../../../../../../assets/scripts/datastores/partials/actions/action/_citation.js';
import sinon from 'sinon';

describe('citation', function () {
  let functionSpy = null;
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

    functionSpy = sinon.spy();

    // Call the function with the spy
    handleTabClick(functionSpy);

    getTabList = () => {
      return document.querySelector('[role="tablist"]');
    };

    getTab = (type = 'mla') => {
      return document.querySelector(`[role="tab"][aria-controls="citation__${type}--tabpanel"]`);
    };
  });

  afterEach(function () {
    functionSpy = null;
    getTabList = null;
    getTab = null;
  });

  describe('handleTabClick()', function () {
    it('should not call the function if a tab was not clicked', function () {
      // Click the tablist
      const clickEvent = new window.Event('click', { bubbles: true });
      getTabList().dispatchEvent(clickEvent);

      // Check that the function was not called
      expect(functionSpy.calledOnce, 'the function should not have been called if a tab was not clicked').to.be.false;
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
      expect(functionSpy.calledOnce, 'the function should not have been called if a tab was unselected').to.be.false;
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
      expect(functionSpy.calledOnce, 'the function should have been called if a tab was selected').to.be.true;
    });
  });
});
