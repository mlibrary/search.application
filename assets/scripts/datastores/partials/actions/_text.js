import { changeAlert } from '../_actions';

const sendText = () => {
  const form = document.querySelector('#actions__text--tabpanel .action__text--form');
  const element = '#actions__text--tabpanel .alert';
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
        return changeAlert({ element, message: 'Text successfully sent.' });
      })
      .catch(() => {
        return changeAlert({ element, message: 'Please enter a valid 10-digit phone number (e.g. 000-123-5555)', type: 'error' });
      });
  });
};

export default sendText;
