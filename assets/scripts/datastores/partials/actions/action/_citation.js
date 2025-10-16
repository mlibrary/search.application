import { filterSelectedRecords, someCheckboxesChecked } from '../../../list/partials/list-item/_checkbox.js';
import CSL from 'citeproc';
import { getTemporaryList } from '../../../list/partials/_add-to.js';

const tabList = document.querySelector('.citation .citation__tablist');

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

export { displayCSLData, generateFullRecordCitations, getTemporaryListCitations };
