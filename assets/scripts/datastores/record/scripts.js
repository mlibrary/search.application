import { shareForm, tabControl } from '../partials/_actions.js';
import { addToList } from '../list/partials/_add-to.js';
import copyLink from '../partials/actions/_link.js';
import { generateFullRecordCitations } from '../partials/actions/_citation.js';
import shelfBrowse from './partials/_shelf-browse.js';
import toggleItems from '../partials/_toggle.js';
import toggleMARCData from './partials/_marc.js';
import toggleTruncatedText from './partials/_title.js';

// Actions panel
tabControl('.actions');

// Email
shareForm('#actions__email--tabpanel');

// Text
shareForm('#actions__text--tabpanel');

// Citations
tabControl('.citation');
generateFullRecordCitations();

// Copy link
copyLink();

// Add to My Temporary List
addToList();

// Record Title
toggleTruncatedText();

// Toggle Items (Metadata, Holdings, etc.)
toggleItems();

// Shelf Browse
shelfBrowse();

// View MARC Data
toggleMARCData();
