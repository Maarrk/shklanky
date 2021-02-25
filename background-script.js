function playSound() {
  const soundUrl = browser.extension.getURL("sounds/single.mp3");
  const iconUrl = browser.extension.getURL("icons/icon.png");
  var element = document.getElementById("audioSingle");
  element.play();
  browser.notifications.create({
    "type": "basic",
    "iconUrl": iconUrl,
    "title": "Szklanka",
    "message": `Element audio: ${element}`
  });
}

// playSound();
browser.alarms.onAlarm.addListener(playSound);
browser.alarms.create('playSound', {periodInMinutes: 0.25});
