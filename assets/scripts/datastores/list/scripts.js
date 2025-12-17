import { shareForm, tabControl } from '../partials/_actions.js';
import { downloadTemporaryListRIS } from '../partials/actions/action/_ris.js';
import { getTemporaryList } from './partials/_add-to.js';
import { initializeCitations } from '../partials/actions/action/_citation.js';
import { removeSelected } from '../partials/actions/action/_remove-selected.js';
import { selectAll } from './partials/_select-all.js';
import { temporaryList } from './layout.js';

// Get the temporary list from session storage
const list = getTemporaryList();

// Actions panel
tabControl('.actions');

// Email
shareForm('#actions__email--tabpanel');

// Text
shareForm('#actions__text--tabpanel');

// Citations
initializeCitations();

// RIS
downloadTemporaryListRIS({ list });

// Remove selected
removeSelected({ list });

// Display My Temporary List items
temporaryList({ list });

// Select all checkboxes
selectAll();
