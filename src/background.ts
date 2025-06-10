type WindowStore = {
  createdAt: number;
  data: Record<string, any>;
};

const windowStores: Record<number, WindowStore> = {};

chrome.windows.onRemoved.addListener((windowId) => {
  delete windowStores[windowId];
  saveStores();
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  try {
    const window = Number(alarm.name.split("_")[1]);
    const name = alarm.name.split("_")[0];
    console.log("alarm", alarm, window, name);

    if (!window) return;

    const storage = (await chrome.storage.local.get("windowStores"))[
      "windowStores"
    ];

    console.log("storage", storage);

    if (!storage) {
      console.error("No storage found", window);
      return;
    }

    if (!storage[window]) {
      console.error("No storage for window found for window:", window);
      return;
    }

    const tabs = await chrome.tabs.query({ windowId: Number(window) });

    if (!tabs) {
      console.warn("No tabs found for window:", window);
      return;
    }

    const { from, to, domains } = storage[window].data;

    if (!from || !to) {
      console.error("No time found for window:", window);
      return;
    }

    if (!domains) {
      console.error("No domains found for window:", window);
      return;
    }

    for (const tab of tabs) {
      if (!tab.url || !tab.id) continue;

      const matches = domains.some((site: string) => tab.url!.includes(site));
      if (!matches) continue;

      if (name === "muteAlarm" || name === "instantMute") {
        console.log("muting tab", tab.url);
        await chrome.tabs.update(tab.id, { muted: true });
      } else if (name === "unmuteAlarm" || name === "instantUnmute") {
        console.log("unmuting tab", tab.url);
        await chrome.tabs.update(tab.id, { muted: false });
      }
    }
  } catch (error) {
    console.error("Error handling alarm:", error);
  }
});

function saveStores() {
  chrome.storage.local.set({ windowStores }, () => {
    console.log("Saved windowStores to storage", windowStores);
  });
}

chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  if (typeof msg.windowId === "number") {
    if (msg.type === "initStorage") {
      const { windowId } = msg;

      if (!windowStores[windowId]) {
        windowStores[windowId] = {
          createdAt: Date.now(),
          data: {},
        };
        saveStores();
        console.log("store created", windowId);
      }

      sendResponse({ status: "ok" });
    }

    if (msg.type === "getStorage") {
      const { windowId } = msg;

      windowStores[windowId].data;
      sendResponse(windowStores[windowId].data || null);
    }

    if (msg.type === "setStorage") {
      const { windowId, data, name } = msg;

      if (windowStores[windowId]) {
        windowStores[windowId].data[name] = data;
        saveStores();
        sendResponse({ status: "ok" });
      } else {
        sendResponse({ status: "store_not_found" });
      }
    }

    if (msg.type === "removeStorage") {
      const { windowId } = msg;
      if (windowStores[windowId]) {
        windowStores[windowId] = { createdAt: Date.now(), data: {} };
        saveStores();
        sendResponse({ status: "ok" });
      } else {
        sendResponse({ status: "store_not_found" });
      }
    }
  }
});
