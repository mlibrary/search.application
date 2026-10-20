import { browsePartial } from './metadata/_browse.js';
import { linkToPartial } from './metadata/_link_to.js';
import { peerReviewPartial } from './metadata/_peer_review.js';
import { plainTextPartial } from './metadata/_plain_text.js';

const getListItemMetadataTable = ({ listItem }) => {
  return listItem.querySelector('table.metadata');
};

const convertPartialType = ({ partial }) => {
  // Split the partial type string by underscore
  const string = partial.split('_');
  // Convert the array to camelCase
  const camelCasePartial = string.map((part, index) => {
    if (index === 0) {
      return part;
    }
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
  // Return the new string
  return camelCasePartial;
};

const partialTypes = {
  browse: browsePartial,
  linkTo: linkToPartial,
  peerReview: peerReviewPartial,
  plainText: plainTextPartial
};

const createMetadataTableRowDataCellListItem = ({
  convertPartial = convertPartialType,
  partial,
  partials = partialTypes,
  value
}) => {
  // Convert the partial type to camelCase
  const camelCasePartial = convertPartial({ partial });
  // Create a list item
  const li = document.createElement('li');
  // Check if the value has a `transliterated` property
  if (value.transliterated) {
    // Create a parallel list element
    const parallelUl = document.createElement('ul');
    // Add classes to the parallel list element
    parallelUl.classList.add('list__no-style', 'metadata__list--parallel');
    // Loop through the value types
    ['original', 'transliterated'].forEach((type) => {
      // Create a list item for each value type
      const parallelLi = document.createElement('li');
      // Set the inner HTML of the list item based on the value type
      parallelLi.innerHTML = partials[camelCasePartial]({ value: value[type] });
      // Append the list item to the parallel list
      parallelUl.appendChild(parallelLi);
    });
    // Append the parallel list to the list item
    li.appendChild(parallelUl);
  } else {
    // Set the inner HTML of the list item
    li.innerHTML = partials[camelCasePartial]({ value: value.original ? value.original : value });
  }
  // Return the list item
  return li;
};

const metadataHasManyValues = ({ shown, total }) => {
  // Return early if there are no additional values to show
  if (total <= shown) {
    return null;
  }
  // Create a list item
  const li = document.createElement('li');
  // Set the text content to indicate there are more values than shown
  li.textContent = `... and ${total - shown} more.`;
  // Return the list item containing the "more" message
  return li;
};

const createMetadataTableRowDataCellList = ({ data, hasManyValues = metadataHasManyValues, metadataTableRowDataCellListItem = createMetadataTableRowDataCellListItem }) => {
  // Destructure the data object
  const { partial, total, values } = data;
  // Create a list element
  const ul = document.createElement('ul');
  // Add classes to the list element based on the data partial type
  ul.classList.add('list__no-style', 'metadata__list', `metadata__list--${partial}`);
  // Loop through the metadata values
  values.forEach((value) => {
    // Create a list item using the helper function
    const li = metadataTableRowDataCellListItem({ partial, value });
    // Append the list item to the list
    ul.appendChild(li);
  });
  const hasMany = hasManyValues({ shown: values.length, total });
  if (hasMany) {
    ul.appendChild(hasMany);
  }
  // Return the newly created list element
  return ul;
};

const createMetadataTableRowDataCell = ({ createTableRowDataCellList = createMetadataTableRowDataCellList, data, row }) => {
  // Create a table data cell
  const td = document.createElement('td');
  // Set the content of the data cell
  td.appendChild(createTableRowDataCellList({ data }));
  // Append the data cell to the row
  row.appendChild(td);
};

const createMetadataTableRowHeader = ({ field, row }) => {
  // Create a table row header cell
  const th = document.createElement('th');
  // Set the scope attribute for the header cell
  th.setAttribute('scope', 'row');
  // Set the text content of the header cell to the field name
  th.textContent = field;
  // Append the header cell to the row
  row.appendChild(th);
};

const createMetadataTableRow = ({
  createTableRowDataCell = createMetadataTableRowDataCell,
  createTableRowHeader = createMetadataTableRowHeader,
  data,
  table
}) => {
  // Get the table body element
  const tbody = table.querySelector('tbody');
  // Create table row element
  const row = document.createElement('tr');
  // Append the new row to the table body
  tbody.appendChild(row);
  // Create the table row header
  createTableRowHeader({ field: data.field, row });
  // Create the table row data cell
  createTableRowDataCell({ data, row });
};

const updateMetadata = ({
  createTableRow = createMetadataTableRow,
  getMetadataTable = getListItemMetadataTable,
  listItem,
  metadata
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
    // Create metadata rows
    metadata.forEach((data) => {
      createTableRow({ data, table });
    });
  }
};

export {
  convertPartialType,
  createMetadataTableRow,
  createMetadataTableRowDataCell,
  createMetadataTableRowDataCellList,
  createMetadataTableRowDataCellListItem,
  createMetadataTableRowHeader,
  getListItemMetadataTable,
  metadataHasManyValues,
  partialTypes,
  updateMetadata
};
