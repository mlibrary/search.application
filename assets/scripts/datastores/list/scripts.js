import { shareForm, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import copyLink from '../partials/actions/_link.js';
import { deselectAll } from './partials/_deselect-all.js';
import { removeSelected } from './partials/_remove-selected.js';
import { selectAll } from './partials/_select-all.js';
import { temporaryList } from './layout.js';

// Display My Temporary List items
temporaryList();

// Select all button
selectAll();

// Deselect all button
deselectAll();

// Remove selected button
removeSelected();

// Actions panel
tabControl('.actions');

// Email
shareForm('#actions__email--tabpanel');

// Text
shareForm('#actions__text--tabpanel');

// Citations
tabControl('.citation');
copyCitation();

// Copy link
copyLink();
