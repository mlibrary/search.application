import { defaultTemporaryList, getSessionStorage, temporaryList } from './layout.js';

// Get the temporary list from session storage
const list = getSessionStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Display My Temporary List items
temporaryList({ list });
