const listItem = () => {
  const partialClass = 'list__item--clone';
  const listItemPartial = document.querySelector(`.${partialClass}`);
  const clonedListItem = listItemPartial.cloneNode(true);
  clonedListItem.classList.remove(partialClass);
  const anchor = clonedListItem.querySelector('a');
  anchor.textContent = 'This has been cloned.';
  return clonedListItem;
};

export default listItem;
