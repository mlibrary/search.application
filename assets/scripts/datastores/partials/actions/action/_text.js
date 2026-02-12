import { shareAction } from './_email.js';

const textAction = ({ submitAction = shareAction } = {}) => {
  // Initialize the share action with the appropriate action name
  submitAction({ action: 'text' });
};

export { textAction };
