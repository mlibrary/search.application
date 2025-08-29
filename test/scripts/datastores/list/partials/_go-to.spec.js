import { expect } from 'chai';
import toggleBanner from '../../../../../assets/scripts/datastores/list/partials/_go-to.js';

describe('toggleBanner', function () {
  const count = 1337;
  const emptyClass = 'list__go-to--empty';
  let getBanner = null;
  let getCount = null;

  beforeEach(function () {
    // Apply HTML to the body
    document.body.innerHTML = `
      <div class="list__go-to ${emptyClass}">
        <div class="list__in-list">
          <span class="strong">0</span> in list
        </div>
      </div>
    `;

    getBanner = () => {
      return document.querySelector('.list__go-to');
    };

    getCount = () => {
      return Number(document.querySelector('.list__in-list span.strong').textContent);
    };

    // Check that the empty class is present initially
    expect(getBanner().classList.contains(emptyClass), 'the empty class should be present initially').to.be.true;

    // Check that the count is initially 0
    expect(getCount(), 'the initial count should be `0`').to.equal(0);
  });

  afterEach(function () {
    getBanner = null;
    getCount = null;
  });

  it('should not remove the empty class if no argument is provided', function () {
    // Call the function
    toggleBanner();

    // Check that the empty class has not been removed
    expect(getBanner().classList.contains(emptyClass), 'the empty class should not be removed when no argument has been provided').to.be.true;
  });

  it('should not remove the empty class if the argument is a non-number', function () {
    // Create a non-number argument
    const nonNumber = 'string';

    // Check that the argument is not a number
    expect(typeof nonNumber, 'the argument should not be a number').to.not.equal('number');

    // Call the function
    toggleBanner(nonNumber);

    // Check that the empty class has not been removed
    expect(getBanner().classList.contains(emptyClass), 'the empty class should not be removed for a non-number argument').to.be.true;
  });

  it('should not remove the empty class if the argument less than `1`', function () {
    // Call the function
    toggleBanner(0);

    // Check that the empty class has not been removed
    expect(getBanner().classList.contains(emptyClass), 'the empty class should not be removed for a count less than `1`').to.be.true;
  });

  it('should remove the empty class if the argument greater than `0`', function () {
    // Call the function
    toggleBanner(count);

    // Check that the empty class is removed
    expect(getBanner().classList.contains(emptyClass), 'the empty class should be removed').to.be.false;
  });

  it('should update the count text to match the argument', function () {
    // Call the function
    toggleBanner(count);

    // Check that the count is updated correctly
    expect(getCount(), `the count should equal to \`${count}\``).to.equal(count);
  });
});
