import { shareForm, tabControl } from '../partials/_actions.js';
import { copyCitation } from '../partials/actions/_citation.js';
import downloadTemporaryListRIS from '../partials/actions/_ris.js';
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
copyCitation();

// RIS
downloadTemporaryListRIS();

// Display My Temporary List items
temporaryList();

// Select all checkboxes
selectAll();
