// Make a button toggle the truncation of the text
const toggleTruncatedText = () => {
  const attribute = 'data-truncate';
  const elements = document.querySelectorAll(`[${attribute}]`);

  elements.forEach((element) => {
    // Ensure element only contains text
    if (element.children.length > 0) {
      return;
    }

    // Get character count from attribute or use default
    const characterCount = Number(element.getAttribute(attribute)) || 180;

    // Minimum amount to trim because hiding one character or word is not appealing
    const trimCount = 60;

    // Skip elements with insufficient length
    if (characterCount <= trimCount) {
      return;
    }

    const characterTrim = characterCount - trimCount;
    const fullText = element.textContent.trim();

    // Do not truncate if text is already short enough
    if (fullText.length <= characterTrim) {
      return;
    }

    // Truncate the text and add ellipses
    const truncatedText = `${fullText.substring(0, characterTrim)}...`;

    // Create a span and button for toggling
    const span = document.createElement('span');
    span.className = 'truncate__text';
    span.textContent = truncatedText;

    const button = document.createElement('button');
    button.className = 'button__ghost truncate__button';
    button.setAttribute('aria-expanded', 'false');
    button.textContent = 'Show more';

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      span.textContent = isExpanded ? truncatedText : fullText;
      button.textContent = `Show ${isExpanded ? 'more' : 'less'}`;
      button.setAttribute('aria-expanded', !isExpanded);
    });

    // Clear element and append span and button
    element.textContent = '';
    element.appendChild(span);
    element.appendChild(button);
  });
};

export default toggleTruncatedText;
