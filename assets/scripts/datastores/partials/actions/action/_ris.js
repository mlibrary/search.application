import { selectedCitations } from '../../../list/partials/list-item/_checkbox.js';
import { viewingTemporaryList } from '../../../list/layout.js';

const generateRISFileName = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  return `MyTemporaryList-${formattedDate}.ris`;
};

const generateRISFile = ({ citations = selectedCitations, list }) => {
  return new Blob([citations({ list, type: 'ris' }).join('\n\n')], { type: 'application/x-research-info-systems' });
};

const generateRISDownloadAnchor = ({ generateFile = generateRISFile, generateFileName = generateRISFileName, list }) => {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(generateFile({ list }));
  anchor.download = generateFileName();
  anchor.click();
  URL.revokeObjectURL(anchor.href);
};

const downloadRISFormSubmit = ({ event, generateDownloadAnchor = generateRISDownloadAnchor, list }) => {
  event.preventDefault();

  return generateDownloadAnchor({ list });
};

const downloadTemporaryListRIS = ({ download = downloadRISFormSubmit, list, viewingList = viewingTemporaryList }) => {
  // Only run if viewing temporary list
  if (!viewingList()) {
    return;
  }

  // `download` is passed in for testing purposes
  document.querySelector('form.action__ris').addEventListener('submit', (event) => {
    return download({ event, list });
  });
};

export { downloadRISFormSubmit, downloadTemporaryListRIS, generateRISDownloadAnchor, generateRISFile, generateRISFileName };
