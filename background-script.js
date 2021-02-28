var options = {
  // specifies default options
  notificationMethod: 'both',
}
function updateOptions() {
  browser.storage.sync.get(options).then((results) => {
    options = results
  })
}
updateOptions()

function handleBellTime() {
  const iconUrl = browser.extension.getURL('icons/bell-96.png')
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'sound'
  ) {
    var element = document.getElementById('audioSingle')
    element.fastSeek(0)
    element.play()
  }
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'notification'
  ) {
    browser.notifications.create({
      type: 'basic',
      iconUrl: iconUrl,
      title: 'Szklanka',
      message: 'Wybijanie jednej szklanki',
    })
  }
}

function scheduleBells() {
  var date = new Date()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  if (minutes >= 30) {
    date.setHours(hours + 1)
    date.setMinutes(0)
  } else {
    date.setMinutes(30)
  }
  date.setSeconds(0)
  date.setMilliseconds(0)

  browser.alarms.onAlarm.addListener(handleBellTime)
  browser.alarms.create('handleBellTime', {
    when: date.getTime(),
    periodInMinutes: 30,
  })
}
scheduleBells()

function handleMessage(message) {
  if (message.action == 'bellTimeNow') {
    handleBellTime()
  } else if (message.action == 'optionsChanged') {
    updateOptions()
  }
}
browser.runtime.onMessage.addListener(handleMessage)
