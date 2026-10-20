import { linkToPartial } from './_link_to.js';
import { plainTextPartial } from './_plain_text.js';

const browsePartial = ({ linkTo = linkToPartial, plainText = plainTextPartial, value }) => {
  const partial = value.url ? linkTo({ value }) : plainText({ value });
  return `
    ${partial}
    <span class="metadata__list--browse-link">
      <a href="${value.browse_url}">Browse in ${value.kind.replace('_', ' ')} list</a>
    </span>
  `;
};

export {
  browsePartial
};
