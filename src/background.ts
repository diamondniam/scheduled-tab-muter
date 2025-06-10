async function getStorage(): Promise<any> {
  return new Promise((resolve) => {
    chrome.windows.getCurrent({}, (window) => {
      const windowId = window.id;
      chrome.storage.local.get([`window_${windowId}`], (data) => {
        resolve(data[`window_${windowId}`] || null);
      });
    });
  });
}

chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.local.remove([`window_${windowId}`]);
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const storage = await getStorage();
  const domains = storage?.domains || [];
  const tabs = await chrome.tabs.query({});

  for (const tab of tabs) {
    if (!tab.url || !tab.id) continue;
    const matches = domains.some((site: string) => tab.url!.includes(site));

    if (matches) {
      if (alarm.name === "muteAlarm") {
        chrome.tabs.update(tab.id, { muted: true });
      } else if (alarm.name === "unmuteAlarm") {
        chrome.tabs.update(tab.id, { muted: false });
      } else if (alarm.name === "instantMute") {
        chrome.tabs.update(tab.id, { muted: true });
      }
    }
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "initStorage") {
    const { data } = msg;

    chrome.windows.getCurrent({}, (window) => {
      const windowId = window.id;
      chrome.storage.local.set({ [`window_${windowId}`]: data });
    });
  }
});
