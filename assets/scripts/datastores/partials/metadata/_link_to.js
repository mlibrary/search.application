const getLinkToMetadataPartial = ({ listItem }) => {
  return listItem.querySelector('.metadata__list--link_to');
};

const cloneLinkToMetadataPartial = ({ getLinkToPartial = getLinkToMetadataPartial, listItem }) => {
  const partial = getLinkToPartial({ listItem });
  return partial.cloneNode(true);
};

const updateLinkToMetadataPartial = ({ clonedLinkToPartial = cloneLinkToMetadataPartial, listItem }) => {
  const partial = clonedLinkToPartial({ listItem });
  // Add logic on what to change
  return partial;
};

const appendLinkToMetadataPartial = ({ listItem, metadataTable, updateLinkToPartial = updateLinkToMetadataPartial }) => {
  metadataTable.appendChild(updateLinkToPartial({ listItem }));
};

export {
  appendLinkToMetadataPartial,
  cloneLinkToMetadataPartial,
  getLinkToMetadataPartial,
  updateLinkToMetadataPartial
};
