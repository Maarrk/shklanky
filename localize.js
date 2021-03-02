document.querySelectorAll('[data-i18n-msg]').forEach((node) => {
  let message = browser.i18n.getMessage(node.dataset.i18nMsg)
  if (message.length > 0) {
    node.innerHTML = message
  }
})
