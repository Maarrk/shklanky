function bellTimeNow() {
  browser.runtime.sendMessage({
    action: 'bellTimeNow',
  })
}

document.getElementById('buttonNow').onclick = bellTimeNow
