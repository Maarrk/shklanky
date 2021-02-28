function bellTimeNow() {
  browser.runtime.sendMessage({
    action: 'bellTimeNow',
  })
}
document.getElementById('buttonNow').addEventListener('click', bellTimeNow)

browser.storage.sync.get('notificationMethod').then((results) => {
  var radio = document.querySelector(
    `#notificationMethod input[value='${results.notificationMethod}']`
  )
  if (radio) {
    radio.checked = true
  }
})
function saveNotificationMethod(event) {
  browser.storage.sync.set({
    notificationMethod: event.target.value,
  })
  browser.runtime.sendMessage({
    action: 'optionsChanged',
  })
}
document
  .getElementById('notificationMethod')
  .addEventListener('input', saveNotificationMethod)
