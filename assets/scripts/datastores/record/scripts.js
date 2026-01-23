import { addToList, getTemporaryList } from '../list/partials/_add-to.js';
import { shareForm, tabControl } from '../partials/_actions.js';
import copyLink from '../partials/actions/action/_link.js';
import { emailAction } from '../partials/actions/action/_email.js';
import { initializeCitations } from '../partials/actions/action/_citation.js';
import shelfBrowse from './partials/_shelf-browse.js';
import toggleItems from '../partials/_toggle.js';
import toggleMARCData from './partials/_marc.js';
import toggleTruncatedText from './partials/_title.js';

// Get the temporary list from session storage
const list = getTemporaryList();

// Actions panel
tabControl('.actions');

// Email
emailAction();

// Text
shareForm('#actions__text--tabpanel');

// Citations
initializeCitations();

// Copy link
copyLink();

// Add to My Temporary List
addToList({ list });

// Record Title
toggleTruncatedText();

// Toggle Items (Metadata, Holdings, etc.)
toggleItems();

// Shelf Browse
shelfBrowse();

// View MARC Data
toggleMARCData();
