import {
  getAllNarrowSearchToSections,
  handleNarrowSearchToSectionChange,
  initializeNarrowSearchTo,
  narrowSearchToSectionSiblingChange,
  narrowSearchToSectionSiblingsChanges,
  resetNarrowSearchToSelectionSelect,
  toggleNarrowSearchToSectionSibling,
  toggleNarrowSearchToSectionSiblingSelect,
  toggleNarrowSearchToSelectOptions
} from '../../../../../assets/scripts/advanced/partials/additional-options/_narrow_search_to.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('narrow search to', function () {
  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="additional-option__narrow-search-to">
        <div class="additional-option__narrow-search-to--section additional-option__narrow-search-to--section-library" data-narrow="">
          <select>
              <option value="All libraries" data-narrow="">All libraries</option>
              <option value="Other Option" data-narrow="">Other Option</option>
          </select>
        </div>
        <div class="additional-option__narrow-search-to--section additional-option__narrow-search-to--section-location" data-narrow="U-M Ann Arbor Libraries, All libraries">
          <select>
              <option value="All locations" data-narrow="U-M Ann Arbor Libraries, All libraries">All locations</option>
              <option value="Other Option" data-narrow="">Other Option</option>
          </select>
        </div>
        <div class="additional-option__narrow-search-to--section additional-option__narrow-search-to--section-collection" data-narrow="Bentley Historical Library, Flint Thompson Library, William L. Clements Library" style="display: none;">
          <select>
              <option value="All collections" data-narrow="">All collections</option>
              <option value="Other Option" data-narrow="">Other Option</option>
          </select>
        </div>
      </div>
    `;
  });

  describe('getAllNarrowSearchToSections()', function () {
    it('should return all narrow search to sections', function () {
      expect(getAllNarrowSearchToSections(), '`getAllNarrowSearchToSections()` should return all narrow search to sections').to.deep.equal(document.querySelectorAll('.additional-option__narrow-search-to--section'));
    });
  });

  describe('toggleNarrowSearchToSectionSibling()', function () {
    let args = null;

    beforeEach(function () {
      const [, sibling] = getAllNarrowSearchToSections();
      const sectionName = sibling.dataset.narrow;
      args = {
        sectionName,
        sibling,
        value: sectionName.split(', ')[0]
      };

      // Check if the sibling section is initially visible
      expect(args.sibling.hasAttribute('style'), 'sibling section should be initially visible').to.be.false;
    });

    afterEach(function () {
      args = null;
    });

    it('should hide the sibling section when the value is not included in the sibling\'s `data-narrow` attribute', function () {
      // Set the value to something not included in the sibling's `data-narrow` attribute
      args.value = 'Some value not in the section name';

      // Call the function
      toggleNarrowSearchToSectionSibling(args);

      // Check that the sibling section is hidden
      expect(args.sibling.style.display, 'sibling section should be hidden').to.equal('none');
    });

    it('should show the sibling section when the sibling\'s `data-narrow` attribute is empty', function () {
      // Update the `data-narrow` attribute to make it empty
      args.sectionName = '';

      // Call the function
      toggleNarrowSearchToSectionSibling(args);

      // Check that the sibling section is shown
      expect(args.sibling.hasAttribute('style'), 'sibling section should be shown').to.be.false;
    });

    it('should show the sibling section when the value is included in the sibling\'s `data-narrow` attribute', function () {
      // Call the function
      toggleNarrowSearchToSectionSibling(args);

      // Check that the sibling section is shown
      expect(args.sibling.hasAttribute('style'), 'sibling section should be shown').to.be.false;
    });
  });

  describe('resetNarrowSearchToSelectionSelect()', function () {
    let args = null;

    beforeEach(function () {
      const selectElement = getAllNarrowSearchToSections()[0].querySelector('select');
      // Change the selected option to the second one
      selectElement.selectedIndex = 1;
      args = {
        selectElement
      };

      // Check if the select element has the second option selected
      expect(args.selectElement.selectedIndex, 'select element should have the second option selected').to.equal(1);

      // Call the function
      resetNarrowSearchToSelectionSelect(args);
    });

    afterEach(function () {
      args = null;
    });

    it('should reset the select element to the first option', function () {
      expect(args.selectElement.selectedIndex, 'select element should be reset to the first option').to.equal(0);
    });
  });

  describe('toggleNarrowSearchToSelectOptions()', function () {
    let args = null;
    let getOptions = null;

    beforeEach(function () {
      const [, sibling] = getAllNarrowSearchToSections();
      const sectionName = sibling.dataset.narrow;
      const selectElement = sibling.querySelector('select');
      args = {
        sectionName,
        selectElement,
        value: sectionName.split(', ')[0]
      };

      // Call the function
      toggleNarrowSearchToSelectOptions(args);

      getOptions = () => {
        return args.selectElement.querySelectorAll('option');
      };
    });

    afterEach(function () {
      args = null;
      getOptions = null;
    });

    it('should toggle the visibility of the select options', function () {
      // Loop through the select options
      getOptions().forEach((option) => {
        // Get the `data-narrow` attribute of the option
        const dataNarrow = option.dataset.narrow;
        // Check if the section name includes the value and the option is relevant
        if (args.sectionName.includes(args.value) && (dataNarrow.includes(args.value) || dataNarrow === '')) {
          // Check that the `style` attribute is not set
          expect(option.hasAttribute('style'), 'option should be visible').to.be.false;
        } else {
          // Check that the `display` is set to `none`
          expect(option.style.display, 'option should be hidden').to.equal('none');
        }
      });
    });
  });

  describe('toggleNarrowSearchToSectionSiblingSelect()', function () {
    let resetNarrowSearchToSelectionSelectSpy = null;
    let toggleNarrowSearchToSelectOptionsSpy = null;
    let args = null;

    beforeEach(function () {
      resetNarrowSearchToSelectionSelectSpy = sinon.spy();
      toggleNarrowSearchToSelectOptionsSpy = sinon.spy();
      const [, sibling] = getAllNarrowSearchToSections();
      const sectionName = sibling.dataset.narrow;
      const selectElement = sibling.querySelector('select');
      args = {
        resetSelect: resetNarrowSearchToSelectionSelectSpy,
        sectionName,
        selectElement,
        toggleSelectOptions: toggleNarrowSearchToSelectOptionsSpy,
        value: sectionName.split(', ')[0]
      };

      // Call the function
      toggleNarrowSearchToSectionSiblingSelect(args);
    });

    afterEach(function () {
      resetNarrowSearchToSelectionSelectSpy = null;
      toggleNarrowSearchToSelectOptionsSpy = null;
      args = null;
    });

    it('should call `resetNarrowSearchToSelectionSelect` with the correct arguments', function () {
      expect(resetNarrowSearchToSelectionSelectSpy.calledOnceWithExactly({ selectElement: args.selectElement }), '`resetNarrowSearchToSelectionSelect` should be called with the correct arguments').to.be.true;
    });

    it('should call `toggleNarrowSearchToSelectOptions` with the correct arguments', function () {
      expect(toggleNarrowSearchToSelectOptionsSpy.calledOnceWithExactly({ sectionName: args.sectionName, selectElement: args.selectElement, value: args.value }), '`toggleNarrowSearchToSelectOptions` should be called with the correct arguments').to.be.true;
    });
  });

  describe('narrowSearchToSectionSiblingChange()', function () {
    let toggleNarrowSearchToSectionSiblingSpy = null;
    let toggleNarrowSearchToSectionSiblingSelectSpy = null;
    let args = null;

    beforeEach(function () {
      toggleNarrowSearchToSectionSiblingSpy = sinon.spy();
      toggleNarrowSearchToSectionSiblingSelectSpy = sinon.spy();
      const [, sibling] = getAllNarrowSearchToSections();
      const sectionName = sibling.dataset.narrow;
      args = {
        sibling,
        toggleSectionSibling: toggleNarrowSearchToSectionSiblingSpy,
        toggleSectionSiblingSelect: toggleNarrowSearchToSectionSiblingSelectSpy,
        value: sectionName.split(', ')[0]
      };
    });

    afterEach(function () {
      toggleNarrowSearchToSectionSiblingSpy = null;
      toggleNarrowSearchToSectionSiblingSelectSpy = null;
      args = null;
    });

    it('does not throw if `sibling` does not exist', function () {
      // Make `sibling` null
      args.sibling = null;

      // Check that the function does not throw when `sibling` is null
      expect(function () {
        narrowSearchToSectionSiblingChange(args);
      }).to.not.throw();
    });

    it('does not throw if `value` does not exist', function () {
      // Make `value` null
      args.value = null;

      // Check that the function does not throw when `value` is null
      expect(function () {
        narrowSearchToSectionSiblingChange(args);
      }).to.not.throw();
    });

    it('calls `toggleNarrowSearchToSectionSibling` with the correct arguments', function () {
      // Call the function
      narrowSearchToSectionSiblingChange(args);

      // Check that `toggleNarrowSearchToSectionSibling` was called with the correct arguments
      expect(toggleNarrowSearchToSectionSiblingSpy.calledOnceWithExactly({ sectionName: args.sibling.dataset.narrow, sibling: args.sibling, value: args.value }), '`toggleSectionSibling` should be called with the correct arguments').to.be.true;
    });

    it('does not throw if `sibling` does not have a select element', function () {
      // Remove the select element from the sibling
      const select = args.sibling.querySelector('select');
      if (select) {
        select.remove();
      }

      // Check that the function does not throw when `sibling` has no select element
      expect(function () {
        narrowSearchToSectionSiblingChange(args);
      }).to.not.throw();
    });

    it('calls `toggleNarrowSearchToSectionSiblingSelect` with the correct arguments', function () {
      // Call the function
      narrowSearchToSectionSiblingChange(args);

      // Check that `toggleNarrowSearchToSectionSiblingSelect` was called with the correct arguments
      expect(toggleNarrowSearchToSectionSiblingSelectSpy.calledOnceWithExactly({ sectionName: args.sibling.dataset.narrow, selectElement: args.sibling.querySelector('select'), value: args.value }), '`toggleSectionSiblingSelect` should be called with the correct arguments').to.be.true;
    });
  });

  describe('narrowSearchToSectionSiblingsChanges()', function () {
    let narrowSearchToSectionSiblingChangeSpy = null;
    let args = null;
    let getSiblings = null;

    beforeEach(function () {
      narrowSearchToSectionSiblingChangeSpy = sinon.spy();
      const [, sibling] = getAllNarrowSearchToSections();
      const sectionName = sibling.dataset.narrow;
      args = {
        parentElement: getAllNarrowSearchToSections()[1],
        siblingChange: narrowSearchToSectionSiblingChangeSpy,
        value: sectionName.split(', ')[0]
      };

      // Call the function
      narrowSearchToSectionSiblingsChanges(args);

      getSiblings = () => {
        // Create a siblings array
        const siblings = [];
        // Loop through all next siblings of the parent element
        for (
          let siblingElement = args.parentElement.nextElementSibling;
          siblingElement;
          siblingElement = siblingElement.nextElementSibling
        ) {
          // Add the current sibling to the siblings array
          siblings.push(siblingElement);
        }
        return siblings;
      };
    });

    afterEach(function () {
      narrowSearchToSectionSiblingChangeSpy = null;
      args = null;
      getSiblings = null;
    });

    it('calls `narrowSearchToSectionSiblingChange` for each sibling', function () {
      getSiblings().forEach((sibling) => {
        expect(narrowSearchToSectionSiblingChangeSpy.calledWith({ sibling, value: args.value }), '`narrowSearchToSectionSiblingChange` should be called for each sibling').to.be.true;
      });
    });
  });

  describe('handleNarrowSearchToSectionChange()', function () {
    let narrowSearchToSectionSiblingsChangesSpy = null;
    let args = null;
    let event = null;

    beforeEach(function () {
      narrowSearchToSectionSiblingsChangesSpy = sinon.spy();
      args = {
        section: getAllNarrowSearchToSections()[0],
        siblingsChanges: narrowSearchToSectionSiblingsChangesSpy
      };

      // Call the function
      handleNarrowSearchToSectionChange(args);

      // Create a change event for later use in tests
      event = new window.Event('change', { bubbles: true });
    });

    afterEach(function () {
      narrowSearchToSectionSiblingsChangesSpy = null;
      args = null;
      event = null;
    });

    it('should not call `narrowSearchToSectionSiblingsChanges` immediately', function () {
      expect(narrowSearchToSectionSiblingsChangesSpy.called, '`narrowSearchToSectionSiblingsChanges` should not be called immediately').to.be.false;
    });

    it('should not call `narrowSearchToSectionSiblingsChanges` when a non-select element changes', function () {
      // Dispatch the change event on the search section
      args.section.dispatchEvent(event);
      // Check that `narrowSearchToSectionSiblingsChanges` was not called
      expect(narrowSearchToSectionSiblingsChangesSpy.called, '`narrowSearchToSectionSiblingsChanges` should not be called for non-select changes').to.be.false;
    });

    it('should call `narrowSearchToSectionSiblingsChanges` when a select element changes', function () {
      // Get the select element within the search section
      const selectElement = args.section.querySelector('select');
      // Dispatch the change event on the select element
      selectElement.dispatchEvent(event);
      // Get the target's parent element and value
      const { parentElement, value } = event.target;
      // Check that `narrowSearchToSectionSiblingsChanges` was called
      expect(narrowSearchToSectionSiblingsChangesSpy.calledOnceWithExactly({ parentElement, value }), '`narrowSearchToSectionSiblingsChanges` should be called for select changes').to.be.true;
    });
  });

  describe('initializeNarrowSearchTo()', function () {
    let handleToggleNarrowSearchToSectionSpy = null;
    let args = null;

    beforeEach(function () {
      handleToggleNarrowSearchToSectionSpy = sinon.spy();
      args = {
        allNarrowSearchToSections: getAllNarrowSearchToSections(),
        handleToggle: handleToggleNarrowSearchToSectionSpy
      };

      // Call the function
      initializeNarrowSearchTo(args);
    });

    afterEach(function () {
      handleToggleNarrowSearchToSectionSpy = null;
      args = null;
    });

    it('should call `handleToggleNarrowSearchToSection` with the correct arguments for each section', function () {
      args.allNarrowSearchToSections.forEach((section) => {
        expect(handleToggleNarrowSearchToSectionSpy.calledWithExactly({ section }), '`handleToggleNarrowSearchToSection` should be called with the correct section').to.be.true;
      });
    });
  });
});
