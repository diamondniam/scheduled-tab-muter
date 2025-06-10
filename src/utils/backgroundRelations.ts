export function getNextTime(time: string) {
  const timeDate = new Date(time);

  return timeDate;
}

export function scheduleAlarms(windowId: number, from: string, to: string) {
  const fromDate = getNextTime(from);
  const toDate = getNextTime(to);

  chrome.alarms.create(`muteAlarm_${windowId}`, {
    when: fromDate.getTime(),
    periodInMinutes: 1440,
  });
  chrome.alarms.create(`unmuteAlarm_${windowId}`, {
    when: toDate.getTime(),
    periodInMinutes: 1440,
  });
}

export function conditionallyInstantMute(
  windowId: number,
  muteTime: string,
  unmuteTime: string
) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const muteTimeDate = getNextTime(muteTime);
  const unmuteTimeDate = getNextTime(unmuteTime);

  const muteMinutes = muteTimeDate.getHours() * 60 + muteTimeDate.getMinutes();
  const unmuteMinutes =
    unmuteTimeDate.getHours() * 60 + unmuteTimeDate.getMinutes();

  let isMute = false;

  if (muteMinutes === unmuteMinutes) {
    isMute = true;
  }

  if (muteMinutes < unmuteMinutes) {
    isMute = nowMinutes >= muteMinutes && nowMinutes < unmuteMinutes;
  } else {
    isMute = nowMinutes >= muteMinutes || nowMinutes < unmuteMinutes;
  }

  if (isMute) {
    chrome.alarms.create(`instantMute_${windowId}`, {
      when: Date.now() + 1000,
    });
  } else {
    chrome.alarms.create(`instantUnmute_${windowId}`, {
      when: Date.now() + 1000,
    });
  }
}

export async function initStorage(windowId: number): Promise<void> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "initStorage",
        windowId: windowId,
      },
      resolve
    );
  });
}

export async function getCurrentWindowId(): Promise<number> {
  return new Promise((resolve) => {
    chrome.windows.getCurrent((win) => {
      if (typeof win.id !== "number") return;
      console.log(win.id);
      resolve(win.id);
    });
  });
}

export async function resetStorage(windowId: number): Promise<void> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "removeStorage",
        windowId: windowId,
      },
      resolve
    );
  });
}

export async function getStorage(windowId: number): Promise<any> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "getStorage",
        windowId: windowId,
      },
      resolve
    );
  });
}

export async function setStorage(
  windowId: number,
  name: string,
  data: any
): Promise<any> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      {
        type: "setStorage",
        windowId: windowId,
        data,
        name,
      },
      resolve
    );
  });
}
