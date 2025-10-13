import { shareForm, tabControl } from '../partials/_actions.js';
import downloadTemporaryListRIS from '../partials/actions/_ris.js';
import { removeSelected } from '../partials/actions/_remove-selected.js';
import { selectAll } from './partials/_select-all.js';
import { temporaryList } from './layout.js';

// Actions panel
tabControl('.actions');

// Email
shareForm('#actions__email--tabpanel');

// Text
shareForm('#actions__text--tabpanel');

// Citations
tabControl('.citation');

// RIS
downloadTemporaryListRIS();

// Remove selected
removeSelected();

// Display My Temporary List items
temporaryList();

// Select all checkboxes
selectAll();
