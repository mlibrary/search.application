import { changeAlert } from '../_alert.js';
import { viewingFullRecord } from '../../../record/layout.js';

const responseBody = ({ elements }) => {
  const params = new URLSearchParams();
  // Convert form elements to URL-encoded string
  Array.from(elements).forEach((element) => {
    if (element.name && !element.disabled) {
      params.append(element.name, element.value);
    }
  });
  // Return the URL-encoded string
  return params.toString();
};

const fetchFormResponse = async ({ body = responseBody, form, isFullRecord = viewingFullRecord(), url }) => {
  const { action, elements, method } = form;
  return await fetch(
    isFullRecord ? action : url,
    {
      body: body({ elements }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method
    }
  );
};

const emailAction = ({ emailResponse = fetchFormResponse, showAlert = changeAlert } = {}) => {
  const form = document.querySelector('form.action__email--form');

  // Return early if the form is not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAlert({
      alert: document.querySelector('#actions__email--tabpanel .alert'),
      response: await emailResponse({ form, url: '/everything/list/email' })
    });
  });
};

export {
  emailAction,
  fetchFormResponse,
  responseBody
};
