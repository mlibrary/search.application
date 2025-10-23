import { selectedCitations } from '../../../list/partials/list-item/_checkbox.js';
import { viewingTemporaryList } from '../../../list/layout.js';

const generateRISFileName = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  return `MyTemporaryList-${formattedDate}.ris`;
};

const generateRISFile = () => {
  return new Blob([selectedCitations('ris').join('\n\n')], { type: 'application/x-research-info-systems' });
};

const generateRISDownloadAnchor = () => {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(generateRISFile());
  anchor.download = generateRISFileName();
  anchor.click();
  URL.revokeObjectURL(anchor.href);
};

const downloadRISFormSubmit = (event) => {
  event.preventDefault();

  return generateRISDownloadAnchor();
};

const downloadTemporaryListRIS = (download = downloadRISFormSubmit) => {
  // Only run if viewing temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  // `download` is passed in for testing purposes
  document.querySelector('form.action__ris').addEventListener('submit', download);
};

export { downloadRISFormSubmit, downloadTemporaryListRIS, generateRISDownloadAnchor, generateRISFile, generateRISFileName };
