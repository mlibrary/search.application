const attachTheCitations = (tabPanel, getBibEntries) => {
  const textbox = document.querySelector(`#${tabPanel} [role='textbox']`);
  textbox.innerHTML = getBibEntries.join('\n');
};

export { attachTheCitations };
