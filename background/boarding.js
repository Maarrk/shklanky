browser.runtime.onInstalled.addListener(async ({ reason, temporary }) => {
  if (temporary) return
  switch (reason) {
    case 'install':
      {
        const url = browser.runtime.getURL('views/installed.html')
        await browser.tabs.create({ url })
      }
      break
  }
})

// open when reloading code with web-ext
// const url = browser.runtime.getURL('views/installed.html')
// browser.tabs.create({ url })
