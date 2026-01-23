import { changeAlert } from '../_alert.js';
import { fetchFormResponse } from './_email.js';

const textAction = ({ showAlert = changeAlert, textResponse = fetchFormResponse } = {}) => {
  const form = document.querySelector('form.action__text--form');

  // Return early if the form is not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAlert({
      alert: document.querySelector('#actions__text--tabpanel .alert'),
      response: await textResponse({ form, url: '/everything/list/sms' })
    });
  });
};

export { textAction };
