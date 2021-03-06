async function getStorageValues(items) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(items, result => {
      resolve(result);
    });
  });
}

async function setStorageValue(values) {
  console.log("setStorageValue", values, new Error().stack);
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(values, resolve);
  });
}
