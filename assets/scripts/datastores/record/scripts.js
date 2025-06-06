import { shareForm, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import copyLink from '../partials/actions/_link.js';
import toggleMARCData from './partials/_marc.js';
import toggleMetadata from '../partials/_metadata.js';
import toggleHolding from '../partials/_holdings.js';
import toggleTruncatedText from './partials/_title.js';

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

// Record Title
toggleTruncatedText();

// Toggle Metadata
toggleMetadata();

// Toggle Holding
toggleHolding();

// View MARC Data
toggleMARCData();
