import { handleFormResults, sendEmail } from '../../../../../assets/scripts/datastores/partials/actions/_email.js';
import { expect } from 'chai';
import sinon from 'sinon';

describe('sendEmail', function () {
  let getForm = null;
  let getAlert = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div id="actions__email--tabpanel">
        <div class="alert alert__warning actions__alert">
          We're sorry. Something went wrong. Please use Ask a Librarian for help.
        </div>
        <form class="action__email--form" action="/submit" method="post">
          <input type="email" id="email" name="email" required>
          <button type="submit">Send Email</button>
        </form>
      </div>
    `;

    getForm = () => {
      return document.querySelector('.action__email--form');
    };

    getAlert = () => {
      return document.querySelector('.alert');
    };
  });

  afterEach(function () {
    getForm = null;
    getAlert = null;

    // Remove the HTML of the body
    document.body.innerHTML = '';
  });

  it('should handle successful form results', async function () {
    const response = Response.json({ message: 'Email successfully sent.' }, { status: 200 });
    await handleFormResults({ panel: '#actions__email--tabpanel', response });
    expect(getAlert().textContent).to.include('Email successfully sent.');
  });

  it('Should handle unsuccessful form results', async function () {
    const response = Response.json({ message: 'Fail' }, { status: 500 });
    await handleFormResults({ panel: '#actions__email--tabpanel', response });
    expect(getAlert().textContent).to.include('Fail');
  });

  it('should prevent the default form submission and call sendEmail with the input email', async function () {
    const response = Response.json({ message: 'Email successfully sent.' }, { status: 200 });

    const fetchFormFake = sinon.fake.resolves(response);
    sendEmail('#actions__email--tabpanel', fetchFormFake);

    // Simulate form submission
    const submitEvent = new window.Event('submit', {
      bubbles: true,
      cancelable: true
    });
    getForm().dispatchEvent(submitEvent);
    // Wait until the async calls resolve
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    expect(getAlert().textContent).to.include('Email successfully sent.');
  });

  it('should error', async function () {
    const response = Response.json({ message: 'Please enter a valid email address (e.g. uniqname@umich.edu)' }, { status: 500 });

    const fetchFormFake = sinon.fake.returns(response);
    sendEmail('#actions__email--tabpanel', fetchFormFake);

    // Simulate form submission
    const submitEvent = new window.Event('submit', {
      bubbles: true,
      cancelable: true
    });
    getForm().dispatchEvent(submitEvent);
    // Wait until the async calls resolve
    await new Promise((resolve) => {
      setTimeout(resolve, 10);
    });

    expect(getAlert().textContent).to.include('Please enter a valid email address (e.g. uniqname@umich.edu)');
  });
});
