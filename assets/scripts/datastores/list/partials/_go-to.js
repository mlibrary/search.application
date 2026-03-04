const getTemporaryListBanner = () => {
  return document.querySelector('.list__go-to');
};

const getTemporaryListCount = ({ list }) => {
  return Object.values(list).reduce((sum, datastore) => {
    return sum + Object.keys(datastore).length;
  }, 0);
};

const changeTemporaryListBannerCount = ({ banner, count }) => {
  // Get the count element
  const countElement = banner.querySelector('.list__go-to--count');

  // Apply the count to the element or set it to 0 if the count is not a number
  countElement.textContent = Number.isFinite(count) ? count : 0;
};

const temporaryListBannerClass = ({ banner, count }) => {
  // Toggle the hidden class if count is greater than 0
  banner.classList.toggle(`hide__javascript`, count < 1);
};

const temporaryListBanner = ({
  banner = getTemporaryListBanner(),
  countList = getTemporaryListCount,
  list,
  toggleClass = temporaryListBannerClass,
  updateCount = changeTemporaryListBannerCount
}) => {
  // Return early if the banner is not found
  if (!banner) {
    return;
  }

  // Get how many items are in the list
  const count = countList({ list });

  // Update the number of how many items are in My Temporary List
  updateCount({ banner, count });

  // Toggle the hidden class if count is greater than 0
  toggleClass({ banner, count });
};

export {
  changeTemporaryListBannerCount,
  getTemporaryListBanner,
  getTemporaryListCount,
  temporaryListBanner,
  temporaryListBannerClass
};
