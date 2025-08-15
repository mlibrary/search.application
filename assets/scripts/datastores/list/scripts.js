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
