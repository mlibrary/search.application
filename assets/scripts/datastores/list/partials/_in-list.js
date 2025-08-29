const changeCount = (count) => {
  // Get the count element
  const countElement = document.querySelector('.list__in-list span.strong');

  // Apply the count to the element or set it to 0 if the count is not a number
  countElement.textContent = Number.isFinite(count) ? count : 0;
};

export default changeCount;
