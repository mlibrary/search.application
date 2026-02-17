import { defaultTemporaryList, getSessionStorage, temporaryList } from './layout.js';
import { downloadTemporaryListRIS } from '../partials/actions/action/_ris.js';
import { emailAction } from '../partials/actions/action/_email.js';
import { initializeCitations } from '../partials/actions/action/_citation.js';
import { removeSelected } from '../partials/actions/action/_remove-selected.js';
import { selectAll } from './partials/_select-all.js';
import { tabControl } from '../partials/_actions.js';
import { textAction } from '../partials/actions/action/_text.js';

// Get the temporary list from session storage
const list = getSessionStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

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

// Remove selected
removeSelected({ list });

// Display My Temporary List items
temporaryList({ list });

// Select all checkboxes
selectAll();
