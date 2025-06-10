export function scheduleAlarm(name: string, isoString: string) {
  const now = new Date();
  const target = new Date(isoString);
  if (target <= now) target.setDate(target.getDate() + 1);

  chrome.alarms.create(name, {
    when: target.getTime(),
    periodInMinutes: 1440,
  });
}

export function conditionallyInstantMute(muteTime: string, unmuteTime: string) {
  const now = new Date();
  const muteTimeDate = new Date(muteTime);
  const unmuteTimeDate = new Date(unmuteTime);

  if (muteTimeDate < now && unmuteTimeDate > now) {
    chrome.alarms.create("instantMute", {
      when: Date.now() + 100,
    });
  }
}

export function sendInitStorage(data: any) {
  chrome.windows.getCurrent((win) => {
    chrome.runtime.sendMessage({
      type: "initStorage",
      windowId: win.id,
      data,
    });
  });
}

export function resetStorage() {
  chrome.windows.getCurrent((win) => {
    chrome.storage.local.remove([`window_${win.id}`]);
  });

  sendInitStorage({});
}
