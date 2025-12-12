const updateButtonClass = ({ button, isAdded }) => {
  button.classList.toggle('button__ghost--active', isAdded);
};

const updateButtonIcon = ({ button, isAdded }) => {
  const buttonIcon = button.querySelector('.material-symbols-rounded');
  buttonIcon.textContent = isAdded ? 'delete' : 'add';
};

const updateButtonTitle = ({ button, isAdded }) => {
  button.setAttribute('title', `${isAdded ? 'Remove from' : 'Add to'} My Temporary List`);
};

const updateButtonText = ({ button, isAdded }) => {
  const buttonContent = button.querySelector('.visually-hidden');
  buttonContent.textContent = buttonContent.textContent
    .replace(/Add|Remove/u, isAdded ? 'Remove' : 'Add')
    .replace(/to My Temporary List|from My Temporary List/u, isAdded ? 'from My Temporary List' : 'to My Temporary List');
};

const buttonUIFuncs = {
  updateButtonClass,
  updateButtonIcon,
  updateButtonText,
  updateButtonTitle
};

const updateButtonUI = ({ button, isAdded }) => {
  // Initiate all functions
  Object.keys(buttonUIFuncs).forEach((func) => {
    buttonUIFuncs[func]({ button, isAdded });
  });
};

export {
  buttonUIFuncs,
  updateButtonClass,
  updateButtonIcon,
  updateButtonText,
  updateButtonTitle,
  updateButtonUI
};
