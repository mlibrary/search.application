import { filterSelectedRecords, someCheckboxesChecked } from '../../list/layout.js';
import { copyToClipboard } from '../_actions.js';
import CSL from 'citeproc';
import { getTemporaryList } from '../../list/partials/_add-to.js';

const citationPanel = document.querySelector('.citation');
const tabList = citationPanel.querySelector('.citation__tablist');

const getTemporaryListCitations = (type = 'csl') => {
  let list = [];
  if (someCheckboxesChecked(true)) {
    // If some are checked, filter the selected records
    filterSelectedRecords().forEach((record) => {
      const [datastore, recordId] = record.split(',');
      list.push(getTemporaryList()[datastore][recordId]);
    });
  } else {
    // Return the entire list
    list = getTemporaryList();
  }

  // Map the citations
  return Object.values(list).map((listItem) => {
    return listItem.citation[type];
  });
};

const displayCSLData = () => {
  const citations = getTemporaryListCitations('csl');
  document.querySelector('.citation__csl').textContent = JSON.stringify(citations);
};

const generateFullRecordCitations = () => {
  tabList.addEventListener('click', async (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }
    if (tab.getAttribute('aria-selected') === 'true') {
      const citationStyle = tab.getAttribute('data-citation-style');
      // Fetch files from the server
      const [styleRes, localeRes] = await Promise.all([
        fetch(`/citations/${citationStyle}.csl`),
        fetch('/citations/locales-en-US.xml')
      ]);

      if (!styleRes.ok || !localeRes.ok) {
        throw new Error('Could not load CSL files');
      }

      const [cslStyle, cslLocale] = await Promise.all([
        styleRes.text(),
        localeRes.text()
      ]);

      const cslData = JSON.parse(document.querySelector('.citation textarea.citation__csl').textContent);

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
    }
  });
};

const copyCitation = () => {
  const copyCitationButton = citationPanel.querySelector('.citation__copy');

  // Enable "Copy citation" button if a tab is already selected
  if (tabList.querySelector('[aria-selected="true"]')) {
    copyCitationButton.removeAttribute('disabled');
  }

  tabList.addEventListener('click', (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (!tab) {
      return;
    }

    const isSelected = tab.getAttribute('aria-selected') === 'true';
    const currentTab = citationPanel.querySelector(`#${tab.getAttribute('aria-controls')}`);
    const alert = currentTab.querySelector('.actions__alert');

    if (isSelected) {
      // Enable "Copy citation" button if a tab is selected
      copyCitationButton.removeAttribute('disabled');
      // Grab the citation content of the selected tab
      copyCitationButton.onclick = () => {
        return copyToClipboard({ alert, text: currentTab.querySelector('.citation__input').textContent.trim() });
      };
    } else {
      // Disable "Copy citation" button if no tab is selected
      copyCitationButton.setAttribute('disabled', true);
      copyCitationButton.onclick = null;
    }
  });
};

export { copyCitation, displayCSLData, generateFullRecordCitations, getTemporaryListCitations };
