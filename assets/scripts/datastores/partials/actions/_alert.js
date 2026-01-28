const changeAlert = async ({ alert, response }) => {
  // Get the message to prevent race conditions
  const { message } = await response.json();
  // Replace the second class with the appropriate alert type class
  alert.classList.replace(alert.classList.item(1), `alert__${response.ok ? 'success' : 'error'}`);
  // Update the alert text content
  alert.textContent = message;
  // Display the alert
  alert.style.display = 'block';
};

export { changeAlert };
