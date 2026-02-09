import {
  emailAction,
  fetchFormResponse,
  responseBody,
  shareAction
} from '../../../../../../assets/scripts/datastores/partials/actions/action/_email.js';
import { filterSelectedRecords, splitCheckboxValue } from '../../../../../../assets/scripts/datastores/list/partials/list-item/_checkbox.js';
import { expect } from 'chai';
import { nonEmptyDatastores } from '../../../../../../assets/scripts/datastores/list/layout.js';
import sinon from 'sinon';

const checkboxValues = Object.entries(nonEmptyDatastores(global.temporaryList)).flatMap(([recordDatastore, record]) => {
  return Object.keys(record).map((recordId) => {
    return `${recordDatastore},${recordId}`;
  });
});
const temporaryListHTML = checkboxValues.map((value, index) => {
  return `<input type="checkbox" class="list__item--checkbox" value="${value}" ${index === 0 ? 'checked' : ''}>`;
}).join('');

describe('email', function () {
  let getAlert = null;
  let getForm = null;
  let getInput = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__email--tabpanel">
        <div class="alert"></div>
        <form class="action__email--form" action="/actions/email" method="post">
          <input type="email" id="action__email--input" name="email" value="test@umich.edu">
          <button type="submit">Send Email</button>
        </form>
      </div>
      ${temporaryListHTML}
    `;

    getAlert = () => {
      return document.querySelector('.alert');
    };

    getForm = () => {
      return document.querySelector('form');
    };

    getInput = () => {
      return getForm().querySelector('input');
    };
  });

  afterEach(function () {
    getAlert = null;
    getForm = null;
    getInput = null;
  });

  describe('responseBody()', function () {
    let response = null;

    beforeEach(function () {
      // Call the function
      response = responseBody({ elements: getForm().elements });
    });

    afterEach(function () {
      response = null;
    });

    it('should return an object', function () {
      expect(response).to.be.an('object');
    });

    it('should contain a property that matches the `name` of the input with the `value` of the input', function () {
      // Get the attributes of the input
      const { name, value } = getInput();

      // Check that the object contains a property that matches the `name` of the input with the `value` of the input
      expect(response[name], 'response should contain a property that matches the `name` of the input with the `value` of the input').to.deep.equal(value);
    });

    it('should contain a `data` property that is an object', function () {
      expect(response.data, 'response should contain a `data` property that is an object').to.be.an('object');
    });

    it('the `data` property should contain the datastore of every selected record', function () {
      // Loop through every selected record
      filterSelectedRecords().forEach((value) => {
        // Get the datastore
        const { recordDatastore } = splitCheckboxValue({ value });

        // Check that the `data` property contains the datastore
        expect(response.data).to.have.property(recordDatastore);
      });
    });

    it('the selected record IDs should be grouped by datastore within the `data` property', function () {
      // Loop through every selected record
      filterSelectedRecords().forEach((value) => {
        // Get the datastore
        const { recordDatastore, recordId } = splitCheckboxValue({ value });

        // Check that the record ID exists within the datastore array
        expect(response.data[recordDatastore], `the record ID ${recordId} should exist within the datastore array`).to.be.an('array').that.includes(recordId);
      });
    });
  });

  describe('fetchFormResponse()', function () {
    let responseBodyStub = null;
    let args = null;
    let fetchStub = null;
    let fetchArgs = null;

    beforeEach(async function () {
      responseBodyStub = sinon.stub().returns(responseBody({ elements: getForm().elements }));
      args = {
        body: responseBodyStub,
        form: getForm()
      };
      fetchStub = sinon.stub(global, 'fetch').resolves('mocked-fetch-response');

      // Call the function
      await fetchFormResponse(args);

      [[, fetchArgs]] = fetchStub.args;
    });

    afterEach(function () {
      responseBodyStub = null;
      args = null;
      fetchStub = null;
      fetchArgs = null;
    });

    it('should call `fetch` once', function () {
      expect(fetchStub.calledOnce, '`fetch` was not called once').to.be.true;
    });

    it('should fetch the form `action`', function () {
      // Check that `fetch` was called with the form `action`
      expect(fetchStub.args[0][0], '`fetch` was not called with the form `action`').to.equal(getForm().action);
    });

    it('should call `responseBody` with the correct arguments', function () {
      expect(responseBodyStub.args[0][0], '`responseBody` was not called with the correct arguments').to.deep.equal({ elements: getForm().elements });
    });

    it('`body` should equal the stringified JSON of the result of `responseBody`', function () {
      expect(fetchArgs.body, '`body` should equal the result of `responseBody`').to.deep.equal(JSON.stringify(responseBodyStub()));
    });

    it('`headers` should equal the correct headers', function () {
      expect(fetchArgs.headers, '`headers` should equal the correct headers').to.deep.equal({
        Accept: 'application/json',
        'Content-Type': 'application/json'
      });
    });

    it('`method` should equal the form `method`', function () {
      expect(fetchArgs.method, '`method` should equal the form `method`').to.equal(getForm().method);
    });
  });

  describe('shareAction()', function () {
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
          return { message: 'Sending your email.' };
        },
        ok: true
      };
      fetchFormResponseStub = sinon.stub().resolves(mockResponse);
      changeAlertStub = sinon.stub();
      args = {
        action: getInput().name,
        response: fetchFormResponseStub,
        showAlert: changeAlertStub
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
        shareAction(args);
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
        shareAction(args);

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
        expect(fetchFormResponseStub.calledWithExactly({ form: getForm() }), '`fetchFormResponse` was not called with the correct arguments').to.be.true;
      });
    });
  });

  describe('emailAction()', function () {
    let shareActionSpy = null;
    let args = null;

    beforeEach(function () {
      shareActionSpy = sinon.spy();
      args = {
        submitAction: shareActionSpy
      };

      // Call the function
      emailAction(args);
    });

    afterEach(function () {
      shareActionSpy = null;
      args = null;
    });

    it('should call `shareAction` with the correct arguments', function () {
      expect(shareActionSpy.calledWithExactly({ action: 'email' }), 'the `shareAction` function should be called with the correct arguments').to.be.true;
    });
  });
});
