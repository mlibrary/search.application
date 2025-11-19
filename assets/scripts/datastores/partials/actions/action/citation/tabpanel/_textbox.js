const attachTheCitations = (tabPanel, getBibEntries = []) => {
  const textbox = document.querySelector(`#${tabPanel} [role='textbox']`);
  const hasEntries = getBibEntries.length > 0;

  // Update the textbox with citation entries or not available message
  textbox.innerHTML = hasEntries ? getBibEntries.join('\n') : '<span class="citation__not-available">Citation not available.</span>';
};

export { attachTheCitations };
