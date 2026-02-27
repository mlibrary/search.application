import { removeToggleButton } from './_toggle.js';

const getListItemMetadataTable = ({ listItem }) => {
  return listItem.querySelector('table.metadata');
};

const prepareMetadataElement = ({ listItem, removeToggle = removeToggleButton, table }) => {
  // Remove the toggle button before it gets copied
  removeToggle({ listItem });

  // Remove the list's ID before it gets copied
  table.querySelector('ul.metadata__list').removeAttribute('id');
};

const cloneMetadataRow = ({ row }) => {
  return row.cloneNode(true);
};

const updateMetadataRowField = ({ field, row }) => {
  row.querySelector('th').textContent = field;
};

const updateMetadataRowList = ({ original, row, transliterated }) => {
  // Grab the list items
  const listItems = row.querySelectorAll('ul.metadata__list--parallel > li');
  // Loop through the data types
  [original, transliterated].forEach((value, index) => {
    if (value) {
      // Update the list item text
      listItems[index].textContent = value;
    } else {
      // Remove the list item if the data type is not available
      listItems[index].remove();
    }
  });
};

const updateMetadataRow = ({
  data,
  row,
  updateMetadataData = updateMetadataRowList,
  updateMetadataField = updateMetadataRowField
}) => {
  // Break down the data
  const { field, original, transliterated } = data;
  // Update the metadata field in the row
  updateMetadataField({ field, row });
  // Update the metadata data in the row
  updateMetadataData({ original, row, transliterated });
};

const updateMetadataTable = ({
  cloneRow = cloneMetadataRow,
  metadata,
  table,
  updateRow = updateMetadataRow
}) => {
  // Get the original row
  const originalRow = table.querySelector('tbody > tr');

  // Loop through all the metadata
  metadata.forEach((data) => {
    // Clone the original row
    const clonedRow = cloneRow({ row: originalRow });
    // Update the metadata in the cloned row
    updateRow({ data, row: clonedRow });
    // Insert the cloned row
    originalRow.parentNode.insertBefore(clonedRow, originalRow);
  });

  // Remove the original row
  originalRow.remove();
};

const updateMetadata = ({
  getMetadataTable = getListItemMetadataTable,
  listItem,
  metadata,
  prepareElement = prepareMetadataElement,
  updateTable = updateMetadataTable
}) => {
  // Get the metadata table
  const table = getMetadataTable({ listItem });

  // Return early if table is not found
  if (!table) {
    return;
  }

  // Check if there is any metadata
  if (metadata.length === 0) {
    // Remove the table if there is no metadata
    table.remove();
  } else {
    // Prepare the table before updating metadata
    prepareElement({ listItem, table });

    // Update the metadata table
    updateTable({ listItem, metadata, table });
  }
};

export {
  cloneMetadataRow,
  getListItemMetadataTable,
  prepareMetadataElement,
  updateMetadata,
  updateMetadataRow,
  updateMetadataRowField,
  updateMetadataRowList,
  updateMetadataTable
};
