import { changeAlert } from '../_actions';

const sendEmail = () => {
  const form = document.querySelector('#actions__email--tabpanel .action__email--form');
  const element = '#actions__email--tabpanel .alert';
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    fetch(form.action, {
      body: formData,
      method: form.method
    })
      .then((response) => {
        return response.json();
      })
      .then(() => {
        return changeAlert({ element, message: 'Email successfully sent.' });
      })
      .catch(() => {
        return changeAlert({ element, message: 'Please enter a valid email address (e.g. uniqname@umich.edu)', type: 'error' });
      });
  });
};

export default sendEmail;
