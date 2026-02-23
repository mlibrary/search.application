import { defaultTemporaryList, getSessionStorage } from '../list/layout.js';
import { addSelected } from '../partials/actions/action/_add-selected.js';
import { checkboxFilters } from './partials/_checkboxes.js';
import { copyLink } from '../partials/actions/action/_link.js';
import { downloadTemporaryListRIS } from '../partials/actions/action/_ris.js';
import { emailAction } from '../partials/actions/action/_email.js';
import { hideInfo } from './partials/_info.js';
import { initializeCitations } from '../partials/actions/action/_citation.js';
import { libraryScope } from './partials/_library-scope.js';
import { removeSelected } from '../partials/actions/action/_remove-selected.js';
import { sortResults } from './partials/summary/_sort.js';
import { tabControl } from '../partials/_actions.js';
import { textAction } from '../partials/actions/action/_text.js';
import { toggleBanner } from '../list/partials/_go-to.js';
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
toggleBanner({ list });

// Actions panel
tabControl('.actions');

// Email
emailAction();

// Text
textAction();

// Citations
initializeCitations();

// RIS
downloadTemporaryListRIS({ list });

// Copy link
copyLink();

// Add to My Temporary List
addSelected({ list });

// Remove selected
removeSelected({ list });
