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
  // Get the current `name` attribute value
  const nameAttribute = booleanInput.getAttribute('name');
  // Use regex to replace the index in the `name` attribute value
  booleanInput.setAttribute('name', nameAttribute.replace(/\d+/u, index));
};

const updateBooleanInputs = ({
  booleanGroup,
  booleanInputs = getBooleanInputs,
  index,
  updateBoolean = updateBooleanInput
} = {}) => {
  // Loop through the boolean inputs
  booleanInputs({ booleanGroup }).forEach((booleanInput) => {
    // Update the boolean input attributes
    updateBoolean({ booleanInput, index });
  });
};

const resetBooleanGroup = ({ booleanGroup, booleanInputs = getBooleanInputs } = {}) => {
  booleanInputs({ booleanGroup }).forEach((booleanInput, index) => {
    booleanInput.default = index === 0;
    booleanInput.checked = index === 0;
  });
};

const updateBooleanGroup = ({
  getGroup = getBooleanGroup,
  index,
  resetGroup = resetBooleanGroup,
  searchField,
  updateInputs = updateBooleanInputs,
  updateLegend = updateBooleanGroupLegend
} = {}) => {
  // Create the arguments object for the update functions
  const args = { booleanGroup: getGroup({ searchField }), index };
  // Remove the `style` attribute from the boolean group to make it visible
  args.booleanGroup.removeAttribute('style');
  // Update the legend text to reflect the new index
  updateLegend(args);
  // Update all the boolean information to reflect the new index
  updateInputs(args);
  // Reset the boolean group to its default state
  resetGroup({ booleanGroup: args.booleanGroup });
};

export {
  getBooleanGroup,
  getBooleanInputs,
  resetBooleanGroup,
  updateBooleanGroup,
  updateBooleanGroupLegend,
  updateBooleanInput,
  updateBooleanInputs
};
