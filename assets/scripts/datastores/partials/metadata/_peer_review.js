const getPeerReviewMetadataPartial = ({ listItem }) => {
  return listItem.querySelector('.metadata__list--peer_review');
};

const clonePeerReviewMetadataPartial = ({ getPeerReviewPartial = getPeerReviewMetadataPartial, listItem }) => {
  const partial = getPeerReviewPartial({ listItem });
  return partial.cloneNode(true);
};

const updatePeerReviewMetadataPartial = ({ clonedPeerReviewPartial = clonePeerReviewMetadataPartial, listItem }) => {
  const partial = clonedPeerReviewPartial({ listItem });
  // Add logic on what to change
  return partial;
};

const appendPeerReviewMetadataPartial = ({ listItem, metadataTable, updatePeerReviewPartial = updatePeerReviewMetadataPartial }) => {
  metadataTable.appendChild(updatePeerReviewPartial({ listItem }));
};

export {
  appendPeerReviewMetadataPartial,
  clonePeerReviewMetadataPartial,
  getPeerReviewMetadataPartial,
  updatePeerReviewMetadataPartial
};
