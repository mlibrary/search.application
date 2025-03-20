import { actionsPlacement, tabControl } from '../partials/_actions.js';
import copyCitation from '../partials/actions/_citation.js';
import toggleMARCData from './partials/_marc.js';

actionsPlacement();
tabControl('.actions');
tabControl('.citation');
copyCitation();
toggleMARCData();
