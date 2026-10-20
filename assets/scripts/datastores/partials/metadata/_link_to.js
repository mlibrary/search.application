const linkToPartial = ({ value }) => {
  return `<a href="${value.url}">${value.text}</a>`;
};

export {
  linkToPartial
};
