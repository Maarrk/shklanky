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

function strikesCount() {
  var strikes = 0
  var date = new Date()
  var hours = date.getHours()
  var minutes = date.getMinutes()
  if (minutes >= 45) {
    hours += 1
  }
  strikes = 2 * (hours % 4)
  if (minutes >= 15 && minutes < 45) {
    strikes += 1
  }
  if (strikes == 0) {
    // end of watch
    strikes = 8
  }
  return strikes
}

var strikesLeft = 0
const audioSingle = document.getElementById('audioSingle')
const audioDouble = document.getElementById('audioDouble')
function playNextSound() {
  if (strikesLeft >= 2) {
    audioDouble.fastSeek(0)
    audioDouble.play()
    strikesLeft -= 2
  } else if (strikesLeft == 1) {
    audioSingle.fastSeek(0)
    audioSingle.play()
    strikesLeft -= 1
  }
}
audioSingle.addEventListener('ended', playNextSound)
audioDouble.addEventListener('ended', playNextSound)

const notifIconUrl = browser.extension.getURL('icons/bell-96.png')
function handleBellTime() {
  strikesLeft = strikesCount()
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'notification'
  ) {
    browser.notifications.create({
      type: 'basic',
      iconUrl: notifIconUrl,
      title: 'Szklanka',
      message: `${strikesLeft} uderzeń w dzwon`,
    })
  }
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'sound'
  ) {
    playNextSound()
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
