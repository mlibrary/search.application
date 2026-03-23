import { risData } from './_textarea.js';
import { viewingTemporaryList } from '../../../../list/layout.js';

const generateRISFileName = ({ path = window.location.pathname, viewingList = viewingTemporaryList() } = {}) => {
  let prefix = 'mlibrary-search-';
  if (viewingList) {
    // If viewing the temporary list, use that in the filename
    prefix += 'temporary-list';
  } else {
    // Extract the datastore from the path for the filename
    const [datastore] = path.split('/').filter(Boolean);
    prefix += `${datastore}-results`;
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  return `${prefix}-${formattedDate}.ris`;
};

const generateRISFile = ({ data = risData() } = {}) => {
  return new Blob([data.join('\n\n')], { type: 'application/x-research-info-systems' });
};

const generateRISDownloadAnchor = ({ generateFile = generateRISFile, generateFileName = generateRISFileName } = {}) => {
  const anchor = document.createElement('a');
  anchor.href = URL.createObjectURL(generateFile());
  anchor.download = generateFileName();
  anchor.click();
  URL.revokeObjectURL(anchor.href);
};

const handleRISFormSubmit = ({ event, generateDownloadAnchor = generateRISDownloadAnchor } = {}) => {
  // Check if the event target has non-empty `action` attribute before continuing
  if (event.target.getAttribute('action')) {
    return;
  }

  // Prevent the default form submission behavior
  event.preventDefault();

  // Generate and trigger the RIS file download
  generateDownloadAnchor();
};

const downloadRISFormSubmit = ({ risFormSubmit = handleRISFormSubmit } = {}) => {
  // Add event listener to the RIS download form
  document.querySelector('form.action__ris').addEventListener('submit', (event) => {
    // Trigger the download on submit
    risFormSubmit({ event });
  });
};

export {
  downloadRISFormSubmit,
  generateRISDownloadAnchor,
  generateRISFile,
  generateRISFileName,
  handleRISFormSubmit
};
