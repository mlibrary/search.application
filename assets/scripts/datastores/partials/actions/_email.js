import { changeAlert } from '../_actions.js';

const fetchFormResults = async (form) => {
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    body: formData,
    method: form.method
  });

  return response;
};

const sendEmail = (formResults = fetchFormResults) => {
  const form = document.querySelector('#actions__email--tabpanel .action__email--form');

  // Return if form not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = formResults(form);
    const json = await response.json();
    const { message } = json;
    // const message = response.ok ? 'Email successfully sent.' : 'Please enter a valid email address (e.g. uniqname@umich.edu)';
    const type = response.ok ? 'success' : 'error';
    console.log(type, message);

    changeAlert({ element: '#actions__email--tabpanel .alert', message, type });
  });
};

export default sendEmail;
