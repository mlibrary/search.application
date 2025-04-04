import { changeAlert } from '../_actions.js';

const fetchFormResults = async (form) => {
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    body: formData,
    method: form.method
  });

  return response;
};

const handleFormResults = async (response) => {
  const json = await response.json();
  const { message } = json;
  const type = response.ok ? 'success' : 'error';
  console.log(type, message);

  changeAlert({ element: '#actions__email--tabpanel .alert', message, type });
}

const sendEmail = async (formResults = fetchFormResults) => {
  const form = document.querySelector('#actions__email--tabpanel .action__email--form');

  // Return if form not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await formResults(form);
    handleFormResults(response)
  });
};

export { sendEmail, handleFormResults };
