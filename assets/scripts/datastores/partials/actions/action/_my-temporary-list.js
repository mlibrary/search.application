/*
  - Check if in full record view
    - If so, grab `data-record-id` and `data-record-datastore` from `.record__container` element
    - Check if item is already in temporary list
      - If so, change button text to "Remove item from list"

  ^^ Create function to check if in full record view
  ^^ Create function to check if item is in temporary list

  - If not in full record view
    - Grab all selected items from datastore results
    - For each selected item, grab `data-record-id` and `data-record-datastore`
    - Check if all items are already in temporary list
      - If so, change button text to "Remove selected items from list"
  ^^ Create function to grab selected items from results
  ^^ Create function to check if all items are in temporary list

  - On button click
    - If in full record view
      - If item is already in temporary list
        - Remove item from temporary list
        - Change button text to "Add item to list"
      - If item is not in temporary list
        - Add item to temporary list
        - Change button text to "Remove item from list"
    - If not in full record view
      - For each selected item
        - If item is already in temporary list
          - Remove item from temporary list
        - If item is not in temporary list
          - Add item to temporary list
      - If all items were already in temporary list
        - Change button text to "Add selected items to list"
      - If any items were not in temporary list
        - Change button text to "Remove selected items from list"
  ^^ Create function to handle button click event
*/

const toggleTemporaryListItem = ({ list }) => {
  // eslint-disable-next-line no-console
  console.log('Toggling temporary list item with list:', list);
};

export { toggleTemporaryListItem };
