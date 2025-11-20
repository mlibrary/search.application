import { attachTheCitations } from './citation/tabpanel/_textbox.js';
import { copyCitation } from './citation/_copy-citation.js';
import CSL from 'citeproc';
import { cslData } from './citation/_csl.js';
import { getActiveCitationTab } from './citation/_tablist.js';
import { tabControl } from '../../_actions.js';

const citationFileCache = {};

const fetchCitationFileText = (style, fileCache = citationFileCache) => {
  const filePath = `/citations/${style ? `${style}.csl` : 'locales-en-US.xml'}`;

  // If the file is already in the cache, return the cached value
  if (fileCache[filePath]) {
    return fileCache[filePath];
  }

  // Create the fetch promise and store it immediately
  const fileText = fetch(filePath)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Fetching \`${filePath}\` failed: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then((text) => {
      return text;
    })
    .catch((err) => {
      // Remove the promise from the cache so retries are possible
      delete fileCache[filePath];
      throw err;
    });

  // Store the file text in the cache
  fileCache[filePath] = fileText;

  return fileText;
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

let citationStyleCache = [];

const generateCitations = async ({
  buildCitations = updateAndAttachCitations,
  buildEngine = buildCiteprocEngine,
  citationCache = citationStyleCache,
  tab
}) => {
  const [citationStyle, tabPanel] = [
    tab.getAttribute('data-citation-style'),
    tab.getAttribute('aria-controls')
  ];

  // Return early if citation style is already cached
  if (citationCache.includes(citationStyle)) {
    return;
  }

  // Create CSL processor
  const citeprocEngine = await buildEngine(citationStyle);

  // Update citation items
  buildCitations({ citeprocEngine, tabPanel });

  // Cache the citation style
  citationCache.push(citationStyle);
};

const regenerateCitations = (citations = generateCitations, activeTab = getActiveCitationTab) => {
  // Clear the cache
  citationStyleCache = [];

  // Generate the citations
  citations({ tab: activeTab() });
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
    citations({ tab });
  });
};

const displayCitations = (citations = generateCitations, tabClick = handleTabClick) => {
  // Check if there is an active tab on load
  const tab = getActiveCitationTab();

  // Get the citations of the active tab
  if (tab) {
    // `citations` is passed in for testing purposes
    citations({ tab });
  }

  // `tabClick` is passed in for testing purposes
  tabClick(citations);
};

const initializeCitations = (citations = displayCitations, copyCitationButton = copyCitation, citationTabs = tabControl) => {
  // Initialize tab control for citations
  citationTabs('.citation');

  // Display the citations
  citations();

  // Initialize the copy citation button
  copyCitationButton();
};

export {
  attachTheCitations,
  buildCiteprocEngine,
  citationStyleCache,
  createCiteprocEngine,
  displayCitations,
  fetchCitationFiles,
  fetchCitationFileText,
  generateCitations,
  getBibliographyEntries,
  handleTabClick,
  initializeCitations,
  regenerateCitations,
  retrieveItem,
  systemObject,
  updateAndAttachCitations,
  updateCitations
};
