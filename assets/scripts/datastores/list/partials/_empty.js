const getEmptyListMessage = () => {
  return document.querySelector('.list__empty');
};

const removeEmptyListMessage = ({ emptyListMessage = getEmptyListMessage() } = {}) => {
  if (emptyListMessage) {
    emptyListMessage.remove();
  }
};

export { getEmptyListMessage, removeEmptyListMessage };
