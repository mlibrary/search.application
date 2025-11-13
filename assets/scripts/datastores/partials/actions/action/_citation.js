import { attachTheCitations } from './citation/tabpanel/_textbox.js';
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

const createCiteprocEngine = ({ CSLModule = CSL, cslLocale, cslStyle, sys = systemObject }) => {
  // Create and return a new CSL engine
  return new CSLModule.Engine(sys(cslLocale), cslStyle, 'en-US');
};

const updateCitations = (citeprocEngine, items = cslData()) => {
  // Update citation items with the CSL engine
  citeprocEngine.updateItems(items.map((item) => {
    return item.id;
  }));
};

const getBibliographyEntries = (citeprocEngine) => {
  const [, bibEntries] = citeprocEngine.makeBibliography();
  return bibEntries;
};

const buildCiteprocEngine = async (citationStyle, fetchFiles = fetchCitationFiles, createEngine = createCiteprocEngine) => {
  // Fetch files from the server
  const [cslStyle, cslLocale] = await fetchFiles({ citationStyle });

  // Create and return CSL engine
  return createEngine({ cslLocale, cslStyle });
};

const updateAndAttachCitations = ({
  attach = attachTheCitations,
  citeprocEngine,
  getBibEntries = getBibliographyEntries,
  tabPanel,
  update = updateCitations
}) => {
  // Update citation items
  update(citeprocEngine);

  // Attach the bibliography entries to the tab panel
  attach(tabPanel, getBibEntries(citeprocEngine));
};

const generateCitations = async (tab, buildEngine = buildCiteprocEngine, buildCitations = updateAndAttachCitations) => {
  const [citationStyle, tabPanel] = [
    tab.getAttribute('data-citation-style'),
    tab.getAttribute('aria-controls')
  ];

  // Create CSL processor
  const citeprocEngine = await buildEngine(citationStyle);

  // Update citation items
  buildCitations({ citeprocEngine, tabPanel });
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

export {
  attachTheCitations,
  buildCiteprocEngine,
  createCiteprocEngine,
  displayCitations,
  fetchCitationFiles,
  fetchCitationFileText,
  generateCitations,
  getBibliographyEntries,
  handleTabClick,
  retrieveItem,
  systemObject,
  updateAndAttachCitations,
  updateCitations
};
