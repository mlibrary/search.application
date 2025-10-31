import CSL from 'citeproc';
import { selectedCitations } from '../../../list/partials/list-item/_checkbox.js';

const tabList = document.querySelector('.citation .citation__tablist');

const getCSLTextarea = () => {
  return document.querySelector('.citation textarea.citation__csl');
};

const displayCSLData = () => {
  getCSLTextarea().textContent = JSON.stringify(selectedCitations('csl'));
};

const generateFullRecordCitations = () => {
  // Generate citation

  // Generate citation on click
  tabList.addEventListener('click', async (event) => {
    const tab = event.target.closest('[role="tab"]');

    // Return early if tab is not clicked or has closed
    if (!tab || tab.getAttribute('aria-selected') !== 'true') {
      return;
    }

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
  });
};

export { displayCSLData, getCSLTextarea, generateFullRecordCitations };
