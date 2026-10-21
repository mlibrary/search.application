import { plainTextPartial } from './_plain_text.js';

const peerReviewPartial = ({ plainText = plainTextPartial, value }) => {
  return `
    ${plainText({ value })}
    <span class="metadata__peer-review">
      <span class="material-symbols-rounded" aria-hidden="true">
        verified
      </span><span>Peer-reviewed publication</span>
    </span>
  `;
};

export {
  peerReviewPartial
};
