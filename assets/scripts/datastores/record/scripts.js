import { defaultTemporaryList, getLocalStorage } from '../list/layout.js';
import { initializeActions } from '../partials/_actions.js';
import shelfBrowse from './partials/_shelf-browse.js';
import { temporaryListBanner } from '../list/partials/_go-to.js';
import { toggleItems } from '../partials/_toggle.js';
import toggleMARCData from './partials/_marc.js';
import { truncateText } from '../partials/_truncate.js';

// Get the temporary list from local storage
const list = getLocalStorage({ defaultValue: defaultTemporaryList, itemName: 'temporaryList' });

// Show My Temporary List banner
temporaryListBanner({ list });

// Actions panel
initializeActions({ list });

// Truncate record title text
truncateText();

// Toggle Items (Metadata, Holdings, etc.)
toggleItems();

// Shelf Browse
shelfBrowse();

// View MARC Data
toggleMARCData();
