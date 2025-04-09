import { JSDOM } from 'jsdom';
import sinon from 'sinon';

// Setup JSDOM with a base URL to avoid opaque origins
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
});

// Destructure the necessary properties
const { window: { document } } = dom;

// Define global properties for the JSDOM environment
Object.assign(global, { document, window: dom.window });

// Clear everything after each test
export const mochaHooks = {
  afterEach () {
    document.body.innerHTML = '';
    sinon.restore();
  }
};
