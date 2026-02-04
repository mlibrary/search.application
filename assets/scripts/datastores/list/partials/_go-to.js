import { changeCount } from './_in-list.js';

const toggleBanner = (count) => {
  // Define the class name for the banner
  const className = 'list__go-to';

  // Get the banner
  const banner = document.querySelector(`.${className}`);

  // Make sure count is a number
  const countNumber = Number.isFinite(count) ? count : 0;

  // Update the count partial
  changeCount(countNumber);

  // Remove the empty class if count is greater than 0
  banner.classList.toggle(`${className}--empty`, countNumber < 1);
};

export { toggleBanner };
