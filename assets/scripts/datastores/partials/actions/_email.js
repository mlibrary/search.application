import { changeAlert } from '../_actions.js';

const fetchFormResults = async (form) => {
  const formData = new FormData(form);

  const response = await fetch(form.action, {
    body: formData,
    method: form.method
  });

  return response;
};

const handleFormResults = async ({ panel, response }) => {
  const json = await response.json();
  const { message } = json;
  const type = response.ok ? 'success' : 'error';

  changeAlert({ element: `${panel} .alert`, message, type });
};

const sendEmail = (panel, formResults = fetchFormResults) => {
  const form = document.querySelector(`${panel} form`);

  // Return if form not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await formResults(form);
    handleFormResults({ panel, response });
  });
};

export { sendEmail, handleFormResults };
