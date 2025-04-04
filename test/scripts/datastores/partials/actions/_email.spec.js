/* eslint-disable prefer-destructuring */
import { expect } from 'chai';
import { JSDOM } from 'jsdom';
import { sendEmail, handleFormResults } from '../../../../../assets/scripts/datastores/partials/actions/_email.js';
import sinon from 'sinon';

describe('form handlers', function () {
  let document = null;

  beforeEach(function () {
    const jsdom = new JSDOM(`
      <div id="actions__email--tabpanel">
        <div class="alert alert__warning actions__alert">
          We're sorry. Something went wrong. Please use Ask a Librarian for help.
        </div>
        <form class="action__email--form" action="/submit" method="post">
          <input type="email" id="email" name="email" required>
          <button type="submit">Send Email</button>
        </form>
      </div>
    `);
    document = jsdom.window.document;
    global.window = jsdom.window;
    global.document = document;
  });

  it('should handle successful form results', async function () {
    const response = Response.json({ message: 'Email successfully sent.' }, { status: 200 });
    await handleFormResults(response)
    expect(document.querySelector('.alert').textContent).to.include('Email successfully sent.');
  })

  it('Should handle unsuccessful form results', async function () {
    const response = Response.json({ message: 'Fail' }, { status: 500 });
    await handleFormResults(response)
    expect(document.querySelector('.alert').textContent).to.include('Fail');
  })

  it('should prevent the default form submission and call sendEmail with the input email', async function () {
    const response = Response.json({ message: 'Email successfully sent.' }, { status: 200 });

    const fetchFormFake = sinon.fake.resolves(response);
    sendEmail(fetchFormFake);

    const form = document.querySelector('.action__email--form');

    // Simulate form submission
    const submitEvent = new window.Event('submit', {
      bubbles: true,
      cancelable: true
    });
    form.dispatchEvent(submitEvent);
    //Wait until the async calls resolve
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(document.querySelector('.alert').textContent).to.include('Email successfully sent.');
  });

  it('should error', async function () {
    const response = Response.json({ message: 'Please enter a valid email address (e.g. uniqname@umich.edu)' }, { status: 500 });

    const fetchFormFake = sinon.fake.returns(response);
    sendEmail(fetchFormFake);

    const form = document.querySelector('.action__email--form');

    // Simulate form submission
    const submitEvent = new window.Event('submit', {
      bubbles: true,
      cancelable: true
    });
    form.dispatchEvent(submitEvent);
    //Wait until the async calls resolve
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(document.querySelector('.alert').textContent).to.include('Please enter a valid email address (e.g. uniqname@umich.edu)');
  });
});
