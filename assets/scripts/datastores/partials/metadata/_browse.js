const getBrowseMetadataPartial = ({ listItem }) => {
  return listItem.querySelector('.metadata__list--browse');
};

const cloneBrowseMetadataPartial = ({ getBrowsePartial = getBrowseMetadataPartial, listItem }) => {
  const partial = getBrowsePartial({ listItem });
  return partial.cloneNode(true);
};

const updateBrowseMetadataPartial = ({ clonedBrowsePartial = cloneBrowseMetadataPartial, listItem }) => {
  const partial = clonedBrowsePartial({ listItem });
  // Add logic on what to change
  return partial;
};

const appendBrowseMetadataPartial = ({ listItem, metadataTable, updateBrowsePartial = updateBrowseMetadataPartial }) => {
  metadataTable.appendChild(updateBrowsePartial({ listItem }));
};

export {
  appendBrowseMetadataPartial,
  cloneBrowseMetadataPartial,
  getBrowseMetadataPartial,
  updateBrowseMetadataPartial
};
