import { actionsPlacement, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import copyLink from '../partials/actions/_link.js';
import toggleMARCData from './partials/_marc.js';

actionsPlacement();
tabControl('.actions');
tabControl('.citation');
copyCitation();
copyLink();
toggleMARCData();
