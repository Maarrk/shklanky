let messagesTemplate = ''

document.querySelectorAll('[data-i18n-msg]').forEach((node) => {
  let message = browser.i18n.getMessage(node.dataset.i18nMsg)
  if (message.length > 0) {
    node.innerHTML = message
  } else {
    messagesTemplate += `,

    "${node.dataset.i18nMsg}": {
      "message": "",
      "description": ""
    }`
  }
})

if (messagesTemplate.length > 0) {
  console.log('Messages to localize:\n' + messagesTemplate)
}
