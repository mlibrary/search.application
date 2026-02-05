import { changeCount } from './_in-list.js';
import { temporaryListCount } from '../layout.js';

const toggleBanner = ({ countList = temporaryListCount, countPartial = changeCount, list }) => {
  // Define the class name for the banner
  const className = 'list__go-to';

  // Get the banner
  const banner = document.querySelector(`.${className}`);

  // Return early if the banner is not found
  if (!banner) {
    return;
  }

  // Get how many items are in the list
  const count = countList(list);

  // Update the count partial
  countPartial(count);

  // Toggle the empty class if count is greater than 0
  banner.classList.toggle(`${className}--empty`, count < 1);
};

export { toggleBanner };
