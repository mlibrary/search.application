import { defaultTemporaryList, getSessionStorage } from '../list/layout.js';
import { checkboxFilters } from './partials/filters/_checkboxes.js';
import { hideInfo } from './partials/_info.js';
import { initializeActions } from '../partials/_actions.js';
import { libraryScope } from './partials/_library-scope.js';
import { resultsList } from './layout.js';
import { selectAll } from '../partials/_select-all.js';
import { sortResults } from './partials/summary/_sort.js';
import { temporaryListBanner } from '../list/partials/_go-to.js';
import { toggleItems } from '../partials/_toggle.js';

// Get the temporary list from session storage
const list = getSessionStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Hide datastore info
hideInfo();

// Library Scope
libraryScope();

// Checkbox Filters
checkboxFilters();

// Toggle filters
toggleItems();

// Sort results
sortResults();

// Show My Temporary List banner
temporaryListBanner({ list });

// Actions panel
initializeActions({ list });

// Select all
selectAll();

// Results list
resultsList({ list });
