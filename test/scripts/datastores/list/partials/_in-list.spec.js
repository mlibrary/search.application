import changeCount from '../../../../../assets/scripts/datastores/list/partials/_in-list.js';
import { expect } from 'chai';

describe('changeCount', function () {
  let getCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__in-list">
        <span class="strong"></span>
      </div>
    `;

    getCount = () => {
      return Number(document.querySelector('.list__in-list span.strong').textContent);
    };

    // Check that no count exists initially
    expect(document.querySelector('.list__in-list span.strong').textContent, 'the initial count should not exist').to.be.empty;
  });

  afterEach(function () {
    getCount = null;
  });

  it('should return `0` if no argument is provided', function () {
    // Call the function
    changeCount();

    // Check that the count remains 0
    expect(getCount(), 'the count should change to `0` with no argument').to.equal(0);
  });

  it('should return `0` if the argument is a non-number', function () {
    // Create a non-number argument
    const nonNumber = 'string';

    // Check that the argument is not a number
    expect(typeof nonNumber, 'the argument should not be a number').to.not.equal('number');

    // Call the function
    changeCount(nonNumber);

    // Check that the count remains 0
    expect(getCount(), 'the count should change to `0` with a non number argument').to.equal(0);
  });

  it('should update the count based on the given argument', function () {
    // Create a count
    const count = 1337;

    // Call the function
    changeCount(count);

    // Check that the count is updated correctly
    expect(getCount(), `the count should equal to \`${count}\``).to.equal(count);
  });
});
