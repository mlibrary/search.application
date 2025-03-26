import { actionsPlacement, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import copyLink from '../partials/actions/_link.js';
import sendEmail from '../partials/actions/_email.js';
import sendText from '../partials/actions/_text.js';
import toggleMARCData from './partials/_marc.js';

// Actions panel
actionsPlacement();
tabControl('.actions');

// Email
sendEmail();

// Text
sendText();

// Citations
tabControl('.citation');
copyCitation();

// Copy link
copyLink();

// View MARC Data
toggleMARCData();
