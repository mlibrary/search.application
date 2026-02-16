import { expect } from 'chai';
import { libraryScope } from '../../../../../assets/scripts/datastores/results/partials/_library-scope.js';
import sinon from 'sinon';

describe('library scope', function () {
  let getForm = null;
  let getSelect = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <form class="library-scope" action="/search" method="GET">
        <select>
          <option value="all">All Libraries</option>
          <option value="local">Local Library</option>
        </select>
        <button type="submit" class="library-scope__submit">Update</button>
      </form>
    `;

    getForm = () => {
      return document.querySelector('.library-scope');
    };

    getForm().submit = sinon.spy();

    getSelect = () => {
      return document.querySelector('select');
    };

    // Check that the form exists
    expect(getForm(), 'form should exist').to.not.be.null;

    // Check that the select exists
    expect(getSelect(), 'select should exist').to.not.be.null;
  });

  afterEach(function () {
    getForm = null;
    getSelect = null;
  });

  describe('libraryScope()', function () {
    it('should submit the form when the select element changes', function () {
      // Call the function
      libraryScope();

      // Simulate a change event on the select element
      const event = new window.Event('change');
      getSelect().dispatchEvent(event);

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
        return libraryScope();
      }, '`libraryScope` should not throw an error if form is missing').to.not.throw();
    });
  });
});
