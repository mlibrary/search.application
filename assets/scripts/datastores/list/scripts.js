import { shareForm, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import toggleItems from '../partials/_toggle.js';

/*
// Actions panel
tabControl('.actions');

// Email
shareForm('#actions__email--tabpanel');

// Text
shareForm('#actions__text--tabpanel');

// Citations
tabControl('.citation');
copyCitation();
*/

// Toggle Items (Metadata, Holdings, etc.)
toggleItems();
