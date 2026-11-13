import { defaultTemporaryList, getLocalStorage, temporaryList } from './layout.js';

// Get the temporary list from local storage
const list = getLocalStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Display My Temporary List items
temporaryList({ list });
