import { selectedCitations } from '../_citation.js';

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

const handleRISFormSubmit = ({ event, generateDownloadAnchor = generateRISDownloadAnchor, list }) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Check if the event target has non-empty `action` attribute before continuing
  if (event.target.getAttribute('action')) {
    return;
  }

  // Generate and trigger the RIS file download
  generateDownloadAnchor({ list });
};

const downloadRISFormSubmit = ({ download = handleRISFormSubmit, list }) => {
  // Add event listener to the RIS download form
  document.querySelector('form.action__ris').addEventListener('submit', (event) => {
    // Trigger the download on submit
    download({ event, list });
  });
};

export {
  downloadRISFormSubmit,
  generateRISDownloadAnchor,
  generateRISFile,
  generateRISFileName,
  handleRISFormSubmit
};
