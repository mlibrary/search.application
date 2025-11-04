import CSL from 'citeproc';
import { getActiveCitationTab } from './citation/_tablist.js';
import { getCSLTextarea } from './citation/_csl.js';

const fetchCitationFileText = async (style) => {
  // Return the appropriate `.csl` file if a style is provided, else, return the locale
  const filePath = `/citations/${style ? `${style}.csl` : 'locales-en-US.xml'}`;
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Fetching \`${filePath}\` failed: ${response.status} ${response.statusText}`);
  }
  return await response.text();
};

const generateCitations = async (tab) => {
  const citationStyle = tab.getAttribute('data-citation-style');
  // Fetch files from the server
  const [cslStyle, cslLocale] = await Promise.all([
    fetchCitationFileText(citationStyle),
    fetchCitationFileText()
  ]);

  const cslData = JSON.parse(getCSLTextarea().textContent);

  // Prepare item retrieval callback
  const retrieveItem = (id) => {
    return cslData.find((item) => {
      return item.id === id;
    });
  };

  // Set up system object required by citeproc
  const sys = {
    retrieveItem (id) {
      return retrieveItem(id);
    },
    retrieveLocale () {
      return cslLocale;
    }
  };

  // Create CSL processor
  const citeprocEngine = new CSL.Engine(sys, cslStyle, 'en-US');

  // Register citation items
  citeprocEngine.updateItems(cslData.map((item) => {
    return item.id;
  }));

  // Generate bibliography
  const [, bibEntries] = citeprocEngine.makeBibliography();

  // Example: insert bibliography into the web page
  document.querySelector(`#${tab.getAttribute('id')}--tabpanel [role='textbox']`).innerHTML = bibEntries.join('\n');
};

const handleTabClick = (citations) => {
  // Check if a click occurred in the tablist
  document.querySelector('.citation > [role="tablist"]').addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');

    // Return early if tab is not clicked or has closed
    if (!tab || tab.getAttribute('aria-selected') !== 'true') {
      return;
    }

    // `citations` is passed in for testing purposes
    citations(tab);
  });
};

const displayCitations = (citations = generateCitations, tabClick = handleTabClick) => {
  // Check if there is an active tab on load
  const activeTab = getActiveCitationTab();

  // Get the citations of the active tab
  if (activeTab) {
    // `citations` is passed in for testing purposes
    citations(activeTab);
  }

  // `tabClick` is passed in for testing purposes
  tabClick(citations);
};

export { displayCitations, fetchCitationFileText, handleTabClick };
