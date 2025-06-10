export async function getStorage(key?: string): Promise<any> {
  return new Promise((resolve) => {
    chrome.windows.getCurrent({}, (window) => {
      const windowId = window.id;

      chrome.storage.local.get([`window_${windowId}`], (data) => {
        if (key) return resolve(data[`window_${windowId}`][key]);
        resolve(data[`window_${windowId}`] || null);
      });
    });
  });
}

export function setStorage({
  name,
  data,
  storage,
}: {
  name?: string;
  data: any;
  storage: Record<string, any>;
}) {
  chrome.windows.getCurrent({}, (window) => {
    const windowId = window.id;

    if (name) {
      chrome.storage.local.set({
        [`window_${windowId}`]: { ...storage, [name]: data },
      });
    } else {
      chrome.storage.local.set({
        [`window_${windowId}`]: { ...storage, ...data },
      });
    }
  });
}
