var options = {
  // specifies default options
  notificationMethod: 'both',
  mutedUntilDate: 0,
}
function updateOptions() {
  browser.storage.sync.get(options).then((results) => {
    options = results
    browser.storage.sync.set(options)
  })
}
updateOptions()

function strikesCount() {
  let strikes = 0
  let date = new Date()
  let hours = date.getHours()
  let minutes = date.getMinutes()
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

var nextStrikesMuted = false
var sessionStrikesMuted = false
function isMuted() {
  if (nextStrikesMuted) {
    return true
  }
  if (sessionStrikesMuted) {
    return true
  }
  let date = new Date()
  if (options.mutedUntilDate > date.getTime()) {
    return true
  }
  return false
}

function notifyMuteChanged() {
  browser.browserAction.setIcon({
    path: {
      64: isMuted() ? '../icons/bell-gray-64.png' : '../icons/bell-64.png',
    },
  })

  browser.runtime.sendMessage({
    action: 'muteChanged',
    muted: isMuted(),
  })
}

function mute(until) {
  if (until == 'next') {
    nextStrikesMuted = true
  } else if (until == 'restart') {
    sessionStrikesMuted = true
  } else if (until == 'watch') {
    let date = new Date()
    let hours = date.getHours()
    hours -= hours % 4
    hours += 3
    date.setHours(hours)
    date.setMinutes(59)

    options.mutedUntilDate = date.getTime()
    browser.storage.sync.set(options)
  } else if (until == 'permanent') {
    let date = new Date()
    date.setFullYear(date.getFullYear() + 1000)
    options.mutedUntilDate = date.getTime()
    browser.storage.sync.set(options)
  }

  notifyMuteChanged()
}
function unmute() {
  nextStrikesMuted = false
  sessionStrikesMuted = false
  options.mutedUntilDate = 0
  browser.storage.sync.set(options)
  notifyMuteChanged()
}

function strikesText(count) {
  let text = Array(Math.floor(count / 2))
    .fill('••')
    .join(' ')
  if (count % 2 == 1) {
    text += ' •'
  }
  return text
}

const notifIconUrl = browser.extension.getURL('../icons/bell-96.png')
function handleBellTime() {
  if (isMuted()) {
    if (nextStrikesMuted) {
      nextStrikesMuted = false
      notifyMuteChanged()
    }
    return
  }

  strikesLeft = strikesCount()
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'notification'
  ) {
    let message = browser.i18n.getMessage('notificationContent', strikesLeft)
    if (options.notificationMethod == 'both') {
      message += '\n\n' + browser.i18n.getMessage('notificationMuteHint')
    }

    let title =
      browser.i18n.getMessage('notificationTitle') +
      ' ' +
      strikesText(strikesLeft)

    browser.notifications.create('bellTime', {
      type: 'basic',
      iconUrl: notifIconUrl,
      title: title,
      message: message,
      // notification buttons are not supported as of firefox 86.0
    })

    // this will clear prematurely if replayed before time elapsed
    // but doesn't happen in normal operation every 30 minutes
    setTimeout(() => browser.notifications.clear('bellTime'), 4500)
  }
  if (
    options.notificationMethod == 'both' ||
    options.notificationMethod == 'sound'
  ) {
    playNextSound()
  }
}

function scheduleBells() {
  let date = new Date()
  let hours = date.getHours()
  let minutes = date.getMinutes()
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
  } else if (message.action == 'mute') {
    mute(message.until)
  } else if (message.action == 'unmute') {
    unmute()
  } else if (message.action == 'getMute') {
    notifyMuteChanged()
  }
}
browser.runtime.onMessage.addListener(handleMessage)

function handleNotificationClick() {
  // stop sound
  audioSingle.pause()
  audioDouble.pause()
  strikesLeft = 0
}
browser.notifications.onClicked.addListener(handleNotificationClick)
