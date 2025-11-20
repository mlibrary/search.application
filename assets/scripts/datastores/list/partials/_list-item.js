const listItemCheckbox = ({ datastore, itemCheckbox, recordId, title }) => {
  // Update the value
  itemCheckbox.value = `${datastore},${recordId}`;

  // Update the label
  itemCheckbox.setAttribute('aria-label', `Select ${title}`);
};

const listItemTitle = ({ index, itemTitle, title, url }) => {
  // Update the number
  const originalNumber = itemTitle.querySelector('.list__item--title-number');
  originalNumber.textContent = `${index + 1}.`;

  // Update original title
  const originalTitle = itemTitle.querySelector('.list__item--title-original');
  originalTitle.href = url;
  originalTitle.textContent = title.original;

  // Update transliterated title or remove if none exists
  const transliteratedTitle = itemTitle.querySelector('.list__item--title-transliterated');
  if (title.transliterated) {
    transliteratedTitle.textContent = title.transliterated;
  } else {
    transliteratedTitle.remove();
  }
};

const listItemMetadata = ({ itemTable, metadata }) => {
  // Get row template
  const rowClass = 'metadata__row--clone';
  const row = itemTable.querySelector(`tr.${rowClass}`);

  metadata.forEach((data) => {
    // Clone the row template
    const clonedRow = row.cloneNode(true);
    // Remove the template class
    clonedRow.classList.remove(rowClass);
    // Update the field
    clonedRow.querySelector('th').textContent = data.field;
    // Update the data
    const rowCell = clonedRow.querySelector('td');
    ['original', 'transliterated'].forEach((type) => {
      const dataElement = rowCell.querySelector(`.metadata__data--${type}`);
      // If the data exists, set its text content; otherwise, remove it
      if (data[type]) {
        dataElement.textContent = data[type];
      } else {
        dataElement.remove();
      }
    });
    // Append the cloned row to the table body
    itemTable.appendChild(clonedRow);
  });

  // Remove the template row
  row.remove();
};

const listItem = ({ datastore, index, record, recordId }) => {
  // Clone the list item template
  const partialClass = 'list__item--clone';
  const listItemPartial = document.querySelector(`.${partialClass}`);
  const clonedListItem = listItemPartial.cloneNode(true);
  // Remove the template class
  clonedListItem.classList.remove(partialClass);
  // Add the record ID as a data attribute
  clonedListItem.setAttribute('data-record-datastore', datastore);
  clonedListItem.setAttribute('data-record-id', recordId);
  // Update the checkbox
  const { metadata, title, url } = record;
  const itemCheckbox = clonedListItem.querySelector('.list__item--checkbox');
  listItemCheckbox({ datastore, itemCheckbox, recordId, title: title.original });
  // Update the title
  const itemTitle = clonedListItem.querySelector('.list__item--title');
  listItemTitle({ index, itemTitle, title, url });
  // Update the metadata
  const itemTable = clonedListItem.querySelector('table.metadata > tbody');
  listItemMetadata({ itemTable, metadata });
  return clonedListItem;
};

export { listItem, listItemCheckbox, listItemMetadata, listItemTitle };
