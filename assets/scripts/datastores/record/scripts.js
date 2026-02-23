import { defaultTemporaryList, getSessionStorage } from '../list/layout.js';
import { addSelected } from '../partials/actions/action/_add-selected.js';
import { copyLink } from '../partials/actions/action/_link.js';
import { emailAction } from '../partials/actions/action/_email.js';
import { initializeCitations } from '../partials/actions/action/_citation.js';
import { removeSelected } from '../partials/actions/action/_remove-selected.js';
import shelfBrowse from './partials/_shelf-browse.js';
import { tabControl } from '../partials/_actions.js';
import { textAction } from '../partials/actions/action/_text.js';
import { toggleBanner } from '../list/partials/_go-to.js';
import { toggleItems } from '../partials/_toggle.js';
import toggleMARCData from './partials/_marc.js';
import toggleTruncatedText from './partials/_title.js';

// Get the temporary list from session storage
const list = getSessionStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

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

// Copy link
copyLink();

// Add to My Temporary List
addSelected({ list });

// Remove from My Temporary List
removeSelected({ list });

// Record Title
toggleTruncatedText();

// Toggle Items (Metadata, Holdings, etc.)
toggleItems();

// Shelf Browse
shelfBrowse();

// View MARC Data
toggleMARCData();
