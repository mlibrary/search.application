import { filterSelectedRecords, splitCheckboxValue } from '../../../results/partials/results-list/list-item/header/_checkbox.js';
import { changeAlert } from '../_alert.js';

const responseBody = ({ elements, selectedRecords = filterSelectedRecords() }) => {
  const body = { data: {} };

  // Convert form elements to key value pairs
  Array.from(elements).forEach((element) => {
    if (element.name && !element.disabled) {
      body[element.name] = element.value;
    }
  });

  // Loop through the selected records and add them to the body
  selectedRecords.forEach((value) => {
    // Get the datastore and mmsid from the value
    const { recordDatastore, recordId } = splitCheckboxValue({ value });
    // If the datastore is not already in the body, add it
    if (!body.data[recordDatastore]) {
      body.data[recordDatastore] = [];
    }
    // Add the mmsid to the datastore array
    body.data[recordDatastore].push(recordId);
  });

  // Return the object
  return body;
};

const fetchFormResponse = async ({ body = responseBody, form }) => {
  const { action, elements, method } = form;
  return await fetch(
    action,
    {
      body: JSON.stringify(body({ elements })),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method
    }
  );
};

const shareAction = ({ action, response = fetchFormResponse, showAlert = changeAlert } = {}) => {
  const form = document.querySelector(`form.action__${action}--form`);

  // Return early if the form is not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAlert({
      alert: document.querySelector(`#actions__${action}--tabpanel .alert`),
      response: await response({ form })
    });
  });
};

const emailAction = ({ submitAction = shareAction } = {}) => {
  // Initialize the share action with the appropriate action name
  submitAction({ action: 'email' });
};

export {
  emailAction,
  fetchFormResponse,
  responseBody,
  shareAction
};
