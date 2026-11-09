import { defaultTemporaryList, getLocalStorage } from '../list/layout.js';
import { hideInfo } from './partials/_info.js';
import { libraryScope } from './partials/_library-scope.js';
import { resultsList } from './layout.js';
import { sortResults } from './partials/summary/_sort.js';
import { toggleItems } from '../partials/_toggle.js';

// Get the temporary list from local storage
const list = getLocalStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Hide datastore info
hideInfo();

// Library Scope
libraryScope();

// Toggle filters
toggleItems();

// Sort results
sortResults();

// Results list
resultsList({ list });
