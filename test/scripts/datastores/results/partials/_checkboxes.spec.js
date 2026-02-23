import { checkboxFilters } from '../../../../../assets/scripts/datastores/results/partials/_checkboxes.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('checkboxes', function () {
  let getForm = null;
  let getCheckbox = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="filter__checkboxes" action="/search" method="GET">
        <input type="checkbox" name="option1" value="1" />
        <button type="submit" class="filter__checkboxes--submit">Update</button>
      </form>
    `;

    getForm = () => {
      return document.querySelector('.filter__checkboxes');
    };

    getForm().submit = sinon.spy();

    getCheckbox = () => {
      return document.querySelector('input[type="checkbox"]');
    };

    // Check that the form exists
    expect(getForm(), 'form should exist').to.not.be.null;

    // Check that the checkbox exists
    expect(getCheckbox(), 'checkbox should exist').to.not.be.null;
  });

  afterEach(function () {
    getForm = null;
    getCheckbox = null;
  });

  describe('checkboxFilters()', function () {
    it('should submit the form when a checkbox element changes', function () {
      // Call the function
      checkboxFilters();

      // Simulate a change event on the checkbox element
      getCheckbox().checked = !getCheckbox().checked;
      const event = new window.Event('change', { bubbles: true });
      getCheckbox().dispatchEvent(event);

      // Assert that the form's submit method was called
      expect(getForm().submit.calledOnce, '`form.submit` should be called once').to.be.true;
    });

    it('should not throw an error if the form does not exist', function () {
      // Remove the form from the DOM
      document.body.innerHTML = '';

      // Check that the form does not exist
      expect(getForm(), 'form should not exist').to.be.null;

      // Call the function and ensure no error is thrown
      expect(() => {
        return checkboxFilters();
      }, '`checkboxFilters` should not throw an error if form is missing').to.not.throw();
    });
  });
});
