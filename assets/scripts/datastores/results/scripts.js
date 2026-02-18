import { checkboxFilters } from './partials/_checkboxes.js';
import { hideInfo } from './partials/_info.js';
import { libraryScope } from './partials/_library-scope.js';
import { sortResults } from './partials/summary/_sort.js';
import { toggleItems } from '../partials/_toggle.js';

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
