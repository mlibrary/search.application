import changeCount from '../../../../../assets/scripts/datastores/list/partials/_in-list.js';
import { expect } from 'chai';
import { getTemporaryList } from '../../../../../assets/scripts/datastores/list/partials/_add-to.js';

const recordIds = ['12345', '67890'];
const recordMetadata = {};
recordIds.forEach((id) => {
  recordMetadata[id] = { holdings: [], metadata: [] };
});

describe('changeCount', function () {
  const temporaryList = recordMetadata;
  let getCount = null;

  beforeEach(function () {
    global.sessionStorage = window.sessionStorage;

    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__in-list">
        <span class="strong">0</span> in list
      </div>
    `;

    getCount = () => {
      return Number(document.querySelector('.list__in-list span.strong').textContent);
    };
  });

  afterEach(function () {
    getCount = null;
    // Clear session storage after each test
    global.sessionStorage.clear();

    delete global.sessionStorage;
  });

  it('should update the count to the number of keys in `temporaryList`', function () {
    // Check that the initial count is 0
    expect(getCount(), 'the initial count should be 0').to.equal(0);

    // Set a temporary list in session storage
    global.sessionStorage.setItem('temporaryList', JSON.stringify(temporaryList));

    // Call the function
    changeCount();

    // Check that the count is updated correctly
    expect(getCount(), 'the count should equal the length of keys in `temporaryList`').to.equal(Object.keys(getTemporaryList()).length);
  });

  it('should return `0` if the list is empty or null', function () {
    // Check that the initial count is 0
    expect(getCount(), 'the initial count should be 0').to.equal(0);

    // Check that the temporary list is empty
    expect(getTemporaryList(), '`temporaryList` should return an empty object').to.be.an('object').that.is.empty;

    // Call the function
    changeCount();

    // Check that the count remains 0
    expect(getCount(), 'the count should remain 0 if the temporary list is empty').to.equal(0);
  });
});
