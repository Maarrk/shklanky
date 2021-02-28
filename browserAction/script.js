function bellTimeNow() {
  browser.runtime.sendMessage({
    action: 'bellTimeNow',
  })
}
document.getElementById('buttonNow').addEventListener('click', bellTimeNow)

function mute(event) {
  if (event.target.id.startsWith('buttonMute')) {
    browser.runtime.sendMessage({
      action: 'mute',
      until: event.target.id.split('buttonMute')[1].toLowerCase(),
    })
  }
}
document.getElementById('muteUntil').addEventListener('click', mute)

function unmute() {
  browser.runtime.sendMessage({
    action: 'unmute',
  })
}
document.getElementById('buttonUnmute').addEventListener('click', unmute)

function handleMuteChanged(isMuted) {
  if (isMuted) {
    document.getElementById('muteUntil').disabled = true
    document.getElementById('buttonUnmute').disabled = false
  } else {
    document.getElementById('muteUntil').disabled = false
    document.getElementById('buttonUnmute').disabled = true
  }
}
browser.runtime.sendMessage({ action: 'getMute' })

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

function handleMessage(message) {
  if (message.action == 'muteChanged') {
    handleMuteChanged(message.muted)
  }
}
browser.runtime.onMessage.addListener(handleMessage)
