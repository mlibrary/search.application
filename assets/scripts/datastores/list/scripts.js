import { defaultTemporaryList, getSessionStorage, temporaryList } from './layout.js';
import { initializeActions } from '../partials/_actions.js';
import { selectAll } from '../partials/_select-all.js';

// Get the temporary list from session storage
const list = getSessionStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Actions panel
initializeActions({ list });

// Display My Temporary List items
temporaryList({ list });

// Select all checkboxes
selectAll();
