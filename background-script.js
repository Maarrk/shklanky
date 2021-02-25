function handleBellTime() {
  const iconUrl = browser.extension.getURL("icons/bell-96.png");
  var element = document.getElementById("audioSingle");
  element.play();
  browser.notifications.create({
    "type": "basic",
    "iconUrl": iconUrl,
    "title": "Szklanka",
    "message": "Wybijanie jednej szklanki"
  });
}

function scheduleBells() {
  var date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if (minutes >= 30) {
    date.setHours(hours + 1);
    date.setMinutes(0);
  } else {
    date.setMinutes(30);
  }
  date.setSeconds(0);
  date.setMilliseconds(0);

  browser.alarms.onAlarm.addListener(handleBellTime);
  browser.alarms.create('handleBellTime', {
    when: date.getTime(),
    periodInMinutes: 30
  });
}

scheduleBells();
