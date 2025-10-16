import { getTemporaryListCitations } from './_citation.js';
import { viewingTemporaryList } from '../../../list/layout.js';

const generateRISFileName = () => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  return `MyTemporaryList-${formattedDate}.ris`;
};

const generateTemporaryListRIS = () => {
  return [
    'TY  - JOUR',
    `TI  - Title`,
    `AU  - Author`,
    `PY  - Publish year`,
    'ER  -'
  ];
};

const generateRISFile = () => {
  return new Blob([generateTemporaryListRIS().join('\n\n')], { type: 'application/x-research-info-systems' });
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

const downloadRISFile = (download = downloadRISFormSubmit) => {
  // Only run if viewing temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  // `download` is passed in for testing purposes
  document.querySelector('form.action__ris').addEventListener('submit', download);
};

const downloadTemporaryListRIS = () => {
  // Only run if viewing temporary list
  if (!viewingTemporaryList()) {
    return;
  }

  document.querySelector('form.action__ris').addEventListener('submit', (event) => {
    event.preventDefault();

    // Create content
    const blob = new Blob([getTemporaryListCitations('ris').join('\n\n')], { type: 'application/x-research-info-systems' });

    // Create a link to download the content
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = generateRISFileName();
    link.click();
    URL.revokeObjectURL(link.href);
  });
};

export { downloadRISFile, downloadRISFormSubmit, downloadTemporaryListRIS, generateRISDownloadAnchor, generateRISFile, generateRISFileName, generateTemporaryListRIS };
