import { changeAlert, fetchFormResults } from '../_actions.js';

const sendEmail = (panel, formResults = fetchFormResults) => {
  const form = document.querySelector(`${panel} form`);

  // Return if form not found because the user is not logged in
  if (!form) {
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const response = await formResults(form);
    changeAlert({ element: `${panel} .alert`, response });
  });
};

export { sendEmail };
