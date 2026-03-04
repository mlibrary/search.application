const getListResults = () => {
  return document.querySelector('.list__results');
};

const removeListResults = ({ listResults = getListResults() } = {}) => {
  if (listResults) {
    listResults.remove();
  }
};

export { getListResults, removeListResults };
