import CSL from 'citeproc';
import { cslData } from './citation/_csl.js';
import { getActiveCitationTab } from './citation/_tablist.js';

/*
  TO DO: Cache fetched text

  const citationFileCache = {};
*/

const fetchCitationFileText = async (style) => {
  // Return the appropriate `.csl` file if a style is provided, else, return the locale
  const filePath = `/citations/${style ? `${style}.csl` : 'locales-en-US.xml'}`;
  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(`Fetching \`${filePath}\` failed: ${response.status} ${response.statusText}`);
  }
  return await response.text();
};

const fetchCitationFiles = async ({ citationStyle, fetchFileText = fetchCitationFileText }) => {
  // `fetchFileText` passed in for testing
  return await Promise.all([
    fetchFileText(citationStyle),
    fetchFileText()
  ]);
};

const retrieveItem = (id) => {
  return cslData().find((item) => {
    return item.id === id;
  });
};

const systemObject = (locale, retrieveFunc = retrieveItem) => {
  // Set up system object required by citeproc
  return {
    retrieveItem (id) {
      // `retrieveFunc` passed in for testing
      return retrieveFunc(id);
    },
    retrieveLocale () {
      return locale;
    }
  };
};

const generateCitations = async (tab) => {
  const citationStyle = tab.getAttribute('data-citation-style');
  // Fetch files from the server
  const [cslStyle, cslLocale] = await fetchCitationFiles({ citationStyle });

  // Create CSL processor
  const citeprocEngine = new CSL.Engine(systemObject(cslLocale), cslStyle, 'en-US');

  // Register citation items
  citeprocEngine.updateItems(cslData().map((item) => {
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

export { displayCitations, fetchCitationFiles, fetchCitationFileText, handleTabClick, retrieveItem, systemObject };
