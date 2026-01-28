import { changeAlert } from '../../../../../assets/scripts/datastores/partials/actions/_alert.js';
import { expect } from 'chai';

describe('alert', function () {
  let getAlert = null;
  let response = null;
  let args = null;

  beforeEach(async function () {
    // Apply HTML to the body
    document.body.innerHTML = `<div class="alert alert__warning" style="display: none;"></div>`;

    getAlert = () => {
      return document.querySelector('.alert');
    };

    response = {
      json: () => {
        return { message: 'Success!' };
      },
      ok: true
    };

    args = {
      alert: getAlert(),
      response
    };

    // Check that the alert has the `alert__warning` class
    expect(getAlert().classList.contains('alert__warning'), 'the alert should initially have the `alert__warning` class').to.be.true;

    // Check that the alert is empty
    expect(getAlert().textContent, 'the alert should initially be empty').to.equal('');

    // Check that the alert is hidden
    expect(getAlert().style.display, 'the alert should initially be hidden').to.equal('none');

    // Call the function
    await changeAlert(args);

    // Check that the alert no longer has the `alert__warning` class
    expect(getAlert().classList.contains('alert__warning'), 'the alert should no longer have the `alert__warning` class after calling `changeAlert`').to.be.false;
  });

  afterEach(function () {
    getAlert = null;
    response = null;
    args = null;
  });

  describe('changeAlert()', function () {
    it('should update the alert class to `alert__success` after a successful response', function () {
      expect(getAlert().classList.contains('alert__success'), 'the alert should have the `alert__success` class after a successful response').to.be.true;
    });

    it('should update the alert class to `alert__error` after a failed response', async function () {
      // Check that the response is not ok
      response.ok = false;
      expect(response.ok, 'the response should not be ok').to.be.false;

      // Call the function again
      await changeAlert(args);

      // Check that the alert has the `alert__error` class
      expect(getAlert().classList.contains('alert__error'), 'the alert should have the `alert__error` class after a failed response').to.be.true;
    });

    it('should update the alert text content based on the response message', function () {
      expect(getAlert().textContent, 'the alert text content should be updated based on the response message').to.equal(args.response.json().message);
    });

    it('should display the alert', function () {
      expect(getAlert().style.display, 'the alert should be displayed after a successful response').to.equal('block');
    });
  });
});
