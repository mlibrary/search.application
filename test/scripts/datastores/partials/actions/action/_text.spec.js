import { expect } from 'chai';
import sinon from 'sinon';
import { textAction } from '../../../../../../assets/scripts/datastores/partials/actions/action/_text.js';

describe('text', function () {
  let getAlert = null;
  let getForm = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__text--tabpanel">
        <div class="alert"></div>
        <form class="action__text--form" action="/catalog/record/1337/sms" method="post">
          <input type="tel" id="action__text--input" name="action__text--input" value="">
          <button type="submit">Send Text</button>
        </form>
      </div>
    `;

    getAlert = () => {
      return document.querySelector('.alert');
    };

    getForm = () => {
      return document.querySelector('form');
    };
  });

  afterEach(function () {
    getAlert = null;
    getForm = null;
  });

  describe('textAction()', function () {
    let submitEvent = null;
    let preventDefaultSpy = null;
    let mockResponse = null;
    let fetchFormResponseStub = null;
    let changeAlertStub = null;
    let args = null;

    beforeEach(function () {
      submitEvent = new window.Event('submit', {
        bubbles: true,
        cancelable: true
      });
      preventDefaultSpy = sinon.spy(submitEvent, 'preventDefault');
      mockResponse = {
        json: () => {
          return { message: 'Sending your text.' };
        },
        ok: true
      };
      fetchFormResponseStub = sinon.stub().resolves(mockResponse);
      changeAlertStub = sinon.stub();
      args = {
        showAlert: changeAlertStub,
        textResponse: fetchFormResponseStub
      };
    });

    afterEach(function () {
      submitEvent = null;
      preventDefaultSpy = null;
      fetchFormResponseStub = null;
      changeAlertStub = null;
      args = null;
    });

    describe('form not found', function () {
      beforeEach(function () {
        // Apply HTML to the body
        document.body.innerHTML = ``;

        // Check that the form does not exist
        expect(getForm(), 'the form should not be found').to.be.null;

        // Call the function
        textAction(args);
      });

      it('should not call `fetchFormResponse`', function () {
        expect(fetchFormResponseStub.called, '`fetchFormResponse` should have not been called').to.be.false;
      });

      it('should not call `showAlert`', function () {
        expect(changeAlertStub.called, '`showAlert` should have not been called').to.be.false;
      });
    });

    describe('submit event handler', function () {
      beforeEach(async function () {
        // Call the function
        textAction(args);

        // Submit the form
        getForm().dispatchEvent(submitEvent);

        // Wait for the event handler to complete
        await Promise.resolve();
      });

      it('should call `preventDefault` on the submit event', function () {
        expect(preventDefaultSpy.called, '`preventDefault` was not called').to.be.true;
      });

      it('should call `showAlert` with the correct arguments', function () {
        expect(changeAlertStub.calledWithExactly({
          alert: getAlert(),
          response: mockResponse
        }), '`showAlert` was not called with the correct arguments').to.be.true;
      });

      it('should call `fetchFormResponse` with the correct arguments', function () {
        expect(fetchFormResponseStub.calledWithExactly({ form: getForm(), url: '/everything/list/sms' }), '`fetchFormResponse` was not called with the correct arguments').to.be.true;
      });
    });
  });
});
