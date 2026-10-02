const getPlainTextMetadataPartial = ({ listItem }) => {
  return listItem.querySelector('.metadata__list--plain_text');
};

const clonePlainTextMetadataPartial = ({ getPlainTextPartial = getPlainTextMetadataPartial, listItem }) => {
  const partial = getPlainTextPartial({ listItem });
  return partial.cloneNode(true);
};

const updatePlainTextMetadataPartial = ({ clonedPlainTextPartial = clonePlainTextMetadataPartial, listItem }) => {
  const partial = clonedPlainTextPartial({ listItem });
  // Add logic on what to change
  return partial;
};

const appendPlainTextMetadataPartial = ({ listItem, metadataTable, updatePlainTextPartial = updatePlainTextMetadataPartial }) => {
  metadataTable.appendChild(updatePlainTextPartial({ listItem }));
};

export {
  appendPlainTextMetadataPartial,
  clonePlainTextMetadataPartial,
  getPlainTextMetadataPartial,
  updatePlainTextMetadataPartial
};
