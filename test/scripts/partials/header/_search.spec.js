import displaySearchTip from '../../../../assets/scripts/partials/header/_search.js';
import { expect } from 'chai';

// Mock data for tips
const options = [
  {
    name: 'Keyword',
    selected: false,
    tip: 'This is a tip for `keyword`.',
    value: 'keyword'
  },
  {
    name: 'Title',
    selected: false,
    tip: 'This is a tip for `title`.',
    value: 'title'
  },
  {
    name: 'Author',
    selected: false,
    tip: 'This is a tip for `author`.',
    value: 'author'
  },
  {
    name: 'No tip',
    selected: false,
    value: 'no_tip'
  }
];

const tips = options
  .filter((option) => {
    return 'tip' in option;
  })
  .map((option) => {
    return `
          <p class="search-form__tip" data-value="${option.value}" style="display: none;">
            ${option.tip}
          </p>
        `;
  })
  .join('');

const htmlSnippet = () => {
  return `
    <form class="search-form">
      <div class="search-form__inputs viewport-container">
        <select aria-label="Select an option" class="search-form__inputs--select" autocomplete="off">
          ${options.map((option) => {
            return `
              <option value="${option.value}" ${option.selected ? 'selected' : ''}>
                ${option.name}
              </option>
            `;
          }).join('')}
        </select>
      </div>
      ${tips}
    </form>
  `;
};

describe('displaySearchTip', function () {
  let getSearchOption = null;
  let getSearchTips = null;
  let allTipsAreHidden = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = htmlSnippet();

    getSearchOption = () => {
      return document.querySelector('.search-form__inputs--select');
    };
    getSearchTips = (dataValue) => {
      if (dataValue) {
        return document.querySelector(`.search-form__tip[data-value="${dataValue}"]`);
      }
      return document.querySelectorAll('.search-form__tip');
    };
    allTipsAreHidden = () => {
      return [...getSearchTips()].every((tip) => {
        return (tip).style.display === 'none';
      });
    };
  });

  afterEach(function () {
    getSearchOption = null;
    getSearchTips = null;
    allTipsAreHidden = null;
  });

  describe('on load', function () {
    it('should display the tip for the selected value', function () {
      // Check if the select element has an option selected
      const selectedValue = getSearchOption().value;
      expect(selectedValue, '`.search-form__inputs--select` should have a selected option').to.not.be.null;
      // Check if all tips are hidden before load
      expect(allTipsAreHidden(), 'all `.search-form__tip` elements should not be displayed before load').to.be.true;

      // Invoke function
      displaySearchTip();

      // Check if the tip that matches the selected value is displayed after load
      expect(getSearchTips(selectedValue).style.display, `\`.search-form__tip[data-value="${selectedValue}"]\` should be displayed after load`).to.not.equal('none');
    });

    it('should not display a tip if a tip does not exist for the selected value', function () {
      // Change selected option to `no_tip`, and reset the body's innerHTML
      const noTip = options.find((option) => {
        return option.value === 'no_tip';
      });
      noTip.selected = true;
      document.body.innerHTML = htmlSnippet();

      // Check if the select element has an option selected
      expect(getSearchOption().value, '`.search-form__inputs--select` should have a selected option').to.not.be.null;
      // Check if all tips are hidden before load
      expect(allTipsAreHidden(), 'all `.search-form__tip` elements should not be displayed before load').to.be.true;

      // Invoke function
      displaySearchTip();

      // Check if a tip exists for the value
      expect(getSearchTips(getSearchOption().value), `\`.search-form__tip[data-value="${getSearchOption().value}"]\` should not exist`).to.be.null;
      // Check if all tips remain hidden after load
      expect(allTipsAreHidden(), 'all `.search-form__tip` elements should not be displayed after load').to.be.true;

      // Reset the selected option to `no_tip`
      noTip.selected = false;
    });
  });

  describe('on change', function () {
    beforeEach(function () {
      // Set search tip on load
      displaySearchTip();
    });

    it('should update the visible tip when search option changes', function () {
      // Define current and new values
      const currentValue = getSearchOption().value;
      const newValue = options.find((option) => {
        return option.value !== currentValue && option.tip;
      }).value;
      // Check if the select element has an option selected
      expect(currentValue, '`.search-form__inputs--select` should have a selected option').to.not.be.null;
      // Check if the tip that matches the current selected value is displayed after load
      expect(getSearchTips(currentValue).style.display, `\`.search-form__tip[data-value="${currentValue}"]\` should be displayed after load`).to.not.equal('none');
      // Check if the tip of the future selected value is not displayed after load
      expect(getSearchTips(newValue).style.display, `\`.search-form__tip[data-value="${newValue}"]\` should not be displayed after load`).to.equal('none');

      // Simulate changing the selection
      getSearchOption().value = newValue;
      const event = new window.Event('change');
      getSearchOption().dispatchEvent(event);

      // Check if the previous tip is no longer displaying after change
      expect(getSearchTips(currentValue).style.display, `\`.search-form__tip[data-value="${currentValue}"]\` should not be displayed after change`).to.equal('none');
      // Check if the tip that matches the new selected value is displayed after change
      expect(getSearchTips(newValue).style.display, `\`.search-form__tip[data-value="${newValue}"]\` should be displayed after change`).to.not.equal('none');
    });

    it('should not show a tip when the search option changes to a value that does not have a tip', function () {
      // Define current and new values
      const currentValue = getSearchOption().value;
      const newValue = 'no_tip';
      // Check if the select element has an option selected
      expect(currentValue, '`.search-form__inputs--select` should have a selected option').to.not.be.null;
      // Check if the tip that matches the current selected value is displayed after load
      expect(getSearchTips(currentValue).style.display, `\`.search-form__tip[data-value="${currentValue}"]\` should be displayed after load`).to.not.equal('none');

      // Simulate changing the selection
      getSearchOption().value = newValue;
      const event = new window.Event('change');
      getSearchOption().dispatchEvent(event);

      // Check if the previous tip is no longer displaying after change
      expect(getSearchTips(currentValue).style.display, `\`.search-form__tip[data-value="${currentValue}"]\` should not be displayed after change`).to.equal('none');
      // Check if the tip for the new value does not exist
      expect(getSearchTips(newValue), `\`.search-form__tip[data-value="${newValue}"]\` should not exist`).to.be.null;
    });
  });
});
