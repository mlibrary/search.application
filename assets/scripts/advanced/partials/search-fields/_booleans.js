const getBooleanGroup = ({ searchField } = {}) => {
  return searchField.querySelector('.advanced-search__search-field--booleans');
};

const getBooleanInputs = ({ booleanGroup } = {}) => {
  return booleanGroup.querySelectorAll('input[type="radio"]');
};

const updateBooleanGroupLegend = ({ booleanGroup, index } = {}) => {
  const legend = booleanGroup.querySelector('legend');
  // Use regex to replace the index in the legend text
  legend.textContent = legend.textContent.replace(/\d+/u, index);
};

const updateBooleanInput = ({ booleanInput, index } = {}) => {
  // Create an array of attributes to update
  const attributes = ['id', 'name'];

  // Loop through the attributes and update them
  attributes.forEach((attribute) => {
    // Get the current attribute value
    const attributeValue = booleanInput.getAttribute(attribute);
    // Use regex to replace the index in the attribute value
    booleanInput[attribute] = attributeValue.replace(/\d+/u, index);
  });
};

const updateBooleanLabel = ({ booleanLabel, index } = {}) => {
  // Get the current `for` attribute value
  const forAttribute = booleanLabel.getAttribute('for');
  // Use regex to replace the index in the `for` attribute value
  booleanLabel.setAttribute('for', forAttribute.replace(/\d+/u, index));
};

const updateBooleanInputs = ({
  booleanGroup,
  booleanInputs = getBooleanInputs,
  index,
  updateInput = updateBooleanInput,
  updateLabel = updateBooleanLabel
} = {}) => {
  // Loop through the boolean inputs
  booleanInputs({ booleanGroup }).forEach((booleanInput) => {
    // Update the boolean input attributes
    updateInput({ booleanInput, index });
    // Update the corresponding label for the boolean input
    updateLabel({ booleanLabel: booleanInput.nextElementSibling, index });
  });
};

const updateBooleanGroup = ({
  getGroup = getBooleanGroup,
  index,
  searchField,
  updateInputs = updateBooleanInputs,
  updateLegend = updateBooleanGroupLegend
} = {}) => {
  // Create the arguments object for the update functions
  const args = { booleanGroup: getGroup({ searchField }), index };
  // Update the legend text to reflect the new index
  updateLegend(args);
  // Update all the boolean information to reflect the new index
  updateInputs(args);
};

const resetBooleanGroup = ({ booleanGroup, booleanInputs = getBooleanInputs } = {}) => {
  booleanInputs({ booleanGroup }).forEach((booleanInput, index) => {
    booleanInput.checked = index === 0;
  });
};

export {
  getBooleanGroup,
  getBooleanInputs,
  resetBooleanGroup,
  updateBooleanGroup,
  updateBooleanGroupLegend,
  updateBooleanInput,
  updateBooleanInputs,
  updateBooleanLabel
};
