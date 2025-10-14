import { getTemporaryListCitations } from './_citation.js';

const downloadTemporaryListRIS = () => {
  document.querySelector('form.action__ris').addEventListener('submit', (event) => {
    event.preventDefault();

    // Create content
    const blob = new Blob([getTemporaryListCitations('ris').join('\n\n')], { type: 'application/x-research-info-systems' });

    // Get today's date
    const today = new Date();
    const formattedDate = today.toISOString().slice(0, 10);

    // Create a link to download the content
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `MyTemporaryList-${formattedDate}.ris`;
    link.click();
    URL.revokeObjectURL(link.href);
  });
};

export default downloadTemporaryListRIS;
