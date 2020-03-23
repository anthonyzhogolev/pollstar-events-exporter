function getParameterByName(queryString, name) {
  // Escape special RegExp characters
  name = name.replace(/[[^$.|?*+(){}\\]/g, "\\$&");
  // Create Regular expression
  var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
  // Attempt to get a match
  var results = regex.exec(queryString);
  return decodeURIComponent(results[1].replace(/\+/g, " ")) || "";
}

async function storePagesCount(url, headers) {
  return new Promise((resolve, reject) => {
    fetch(url, { headers })
      .then(response => response.json())
      .then(response => {
        const { totalPages, totalRows } = response;
        chrome.storage.sync.set({ totalPages, totalRows }, () => resolve());
      });
  });
}

const storeUrl = async url =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.set({ url }, () => resolve(url));
  });

const storeHeaders = async requestHeaders =>
  new Promise((resolve, reject) => {
    const headers = requestHeaders.reduce((acc, header) => {
      acc[header.name] = header.value;
      return acc;
    }, {});
    chrome.storage.sync.set({ headers }, () => resolve(headers));
  });

function toggleListenWebRequests(enable) {
  if (enable) {
    chrome.webRequest.onSendHeaders.addListener(
      storeRequestData,
      { urls: [LISTEN_REQUEST_URL_PATTERN] },
      ["requestHeaders"]
    );
  } else {
    chrome.webRequest.onSendHeaders.removeListener(storeRequestData);
  }
}

async function storeRequestData(details) {
  console.log('storeRequestData...');
  const filters = getParameterByName(details.url, "filter")
    .split(/,(?=\w)/)
    .map(item => item.replace(/(\w*==)/, ""));

  await setStorageValue({
    filters,
    totalPages: null,
    totalRows: null,
    [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.waitForTotalRows
  });
  
  toggleListenWebRequests(false);

  Promise.all([
    storeUrl(details.url),
    storeHeaders(details.requestHeaders)
  ]).then(values => {
    chrome.storage.sync.get(["headers"], async result => {
      await storePagesCount(details.url, result.headers);
      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.ready
      });
      toggleListenWebRequests(true);
    });
  });

  return { cancel: false };
}
