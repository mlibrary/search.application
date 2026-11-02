import {
  getAllNarrowSearchToSections,
  getNarrowSearchToSection,
  getNarrowSearchToSectionSelectValue,
  handleToggleNarrowSearchToSection,
  initializeNarrowSearchTo,
  toggleNarrowSearchToSections
} from '../../../../../assets/scripts/advanced/partials/additional-options/_narrow_search_to.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('narrow search to', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__narrow-search-to">
        <div class="additional-option__narrow-search-to--library" data-narrow="">
          <select>
              <option value="All libraries" data-narrow="">All libraries</option>
          </select>
        </div>
        <div class="additional-option__narrow-search-to--location" data-narrow="U-M Ann Arbor Libraries, All libraries">
          <select>
              <option value="All locations" data-narrow="U-M Ann Arbor Libraries, All libraries">All locations</option>
          </select>
        </div>
        <div class="additional-option__narrow-search-to--collection" data-narrow="Bentley Historical Library, Flint Thompson Library, William L. Clements Library" style="display: none;">
          <select>
              <option value="All collections" data-narrow="">All collections</option>
          </select>
        </div>
      </div>
    `;
  });

  describe('getAllNarrowSearchToSections()', function () {
    it('should return all narrow search to sections', function () {
      expect(getAllNarrowSearchToSections(), '`getAllNarrowSearchToSections()` should return all narrow search to sections').to.deep.equal(document.querySelectorAll('.additional-option__narrow-search-to'));
    });
  });

  describe('getNarrowSearchToSection()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        section: 'library'
      };
    });

    it('should return the specific narrow search to section', function () {
      expect(getNarrowSearchToSection(args), 'the specific narrow search to section should be returned').to.deep.equal(document.querySelector('.additional-option__narrow-search-to--library'));
    });
  });

  describe('getNarrowSearchToSectionSelectValue()', function () {
    let args = null;

    beforeEach(function () {
      args = {
        section: 'library'
      };
    });

    it('should return the value of the select element within the section', function () {
      expect(getNarrowSearchToSectionSelectValue(args), 'the value of the select element within the section should be returned').to.equal('All libraries');
    });
  });

  describe('toggleNarrowSearchToSections()', function () {
    let getNarrowSearchToSectionStub = null;
    let getNarrowSearchToSectionSelectValueStub = null;
    let args = null;

    beforeEach(function () {
      getNarrowSearchToSectionStub = sinon.stub().callsFake(({ section }) => {
        return getNarrowSearchToSection({ section });
      });
      getNarrowSearchToSectionSelectValueStub = sinon.stub().callsFake(({ section }) => {
        return getNarrowSearchToSectionSelectValue({ section });
      });
      args = {
        narrowSearchToSection: getNarrowSearchToSectionStub,
        narrowSearchToSectionValue: getNarrowSearchToSectionSelectValueStub
      };

      // Call the function
      toggleNarrowSearchToSections(args);
    });

    afterEach(function () {
      getNarrowSearchToSectionStub = null;
      getNarrowSearchToSectionSelectValueStub = null;
    });

    it('should call `getNarrowSearchToSectionValue` with the correct arguments', function () {
      expect(getNarrowSearchToSectionSelectValueStub.calledOnceWithExactly({ section: 'library' }), '`getNarrowSearchToSectionValue` should be called with the correct arguments').to.be.true;
    });

    it('should call `getNarrowSearchToSection` for each section with the correct arguments', function () {
      ['location', 'collection'].forEach((section) => {
        expect(getNarrowSearchToSectionStub.calledWithExactly({ section }), '`getNarrowSearchToSection` should be called with the correct arguments').to.be.true;
      });
    });

    it('should toggle the display of narrow search sections based on current `library` value', function () {
      ['location', 'collection'].forEach((section) => {
        // Get the section
        const singleSection = getNarrowSearchToSectionStub({ section });
        // Get the `data-narrow` attribute of the section element
        const sectionName = singleSection.dataset.narrow;
        // Check if the section name includes the library section value
        if (sectionName.includes(getNarrowSearchToSectionSelectValueStub({ section: 'library' }))) {
          // Check that the `style` attribute does not exist
          expect(singleSection.hasAttribute('style'), '`style` attribute should not exist when section is visible').to.be.false;
        } else {
          // Check that `display` is set to `none` when the section is hidden
          expect(singleSection.style.display, '`display` should be set to `none` when section is hidden').to.equal('none');
        }
      });
    });
  });

  describe('handleToggleNarrowSearchToSection()', function () {
    let toggleNarrowSearchToSectionsSpy = null;
    let args = null;
    let event = null;
    let searchSection = null;

    beforeEach(function () {
      toggleNarrowSearchToSectionsSpy = sinon.spy();
      args = {
        allNarrowSearchToSections: getAllNarrowSearchToSections(),
        toggleSections: toggleNarrowSearchToSectionsSpy
      };

      // Call the function
      handleToggleNarrowSearchToSection(args);

      // Store a reference to the library section for later use in tests
      searchSection = () => {
        return args.allNarrowSearchToSections[0];
      };

      // Create a change event for later use in tests
      event = new window.Event('change', { bubbles: true });
    });

    afterEach(function () {
      toggleNarrowSearchToSectionsSpy = null;
      args = null;
      event = null;
      searchSection = null;
    });

    it('should not call `toggleNarrowSearchToSections` immediately', function () {
      expect(toggleNarrowSearchToSectionsSpy.called, '`toggleSections` should not be called immediately').to.be.false;
    });

    it('should not call `toggleNarrowSearchToSections` when a non-select element changes', function () {
      // Dispatch the change event on the search section
      searchSection().dispatchEvent(event);
      // Check that `toggleNarrowSearchToSections` was not called
      expect(toggleNarrowSearchToSectionsSpy.called, '`toggleSections` should not be called for non-select changes').to.be.false;
    });

    it('should call `toggleNarrowSearchToSections` when a select element changes', function () {
      // Get the select element within the search section
      const selectElement = searchSection().querySelector('select');
      // Dispatch the change event on the select element
      selectElement.dispatchEvent(event);
      // Check that `toggleNarrowSearchToSections` was called
      expect(toggleNarrowSearchToSectionsSpy.calledOnceWithExactly(), '`toggleSections` should be called for select changes').to.be.true;
    });
  });

  describe('initializeNarrowSearchTo()', function () {
    let toggleNarrowSearchToSectionsSpy = null;
    let handleToggleNarrowSearchToSectionSpy = null;
    let args = null;

    beforeEach(function () {
      toggleNarrowSearchToSectionsSpy = sinon.spy();
      handleToggleNarrowSearchToSectionSpy = sinon.spy();
      args = {
        handleToggle: handleToggleNarrowSearchToSectionSpy,
        toggleSections: toggleNarrowSearchToSectionsSpy
      };

      // Call the function
      initializeNarrowSearchTo(args);
    });

    afterEach(function () {
      toggleNarrowSearchToSectionsSpy = null;
      handleToggleNarrowSearchToSectionSpy = null;
      args = null;
    });

    it('should call `toggleNarrowSearchToSections` with the correct arguments', function () {
      expect(toggleNarrowSearchToSectionsSpy.calledOnceWithExactly(), '`toggleNarrowSearchToSections` should be called once').to.be.true;
    });

    it('should call `handleToggleNarrowSearchToSection` with the correct arguments', function () {
      expect(handleToggleNarrowSearchToSectionSpy.calledOnceWithExactly(), '`handleToggleNarrowSearchToSection` should be called once').to.be.true;
    });
  });
});
