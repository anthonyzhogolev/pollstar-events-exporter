function getParameterByName(queryString, name) {
  // Escape special RegExp characters
  name = name.replace(/[[^$.|?*+(){}\\]/g, "\\$&");
  // Create Regular expression
  var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
  // Attempt to get a match
  var results = regex.exec(queryString);
  if (results && results.length) {
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || "";
  }
  return null;
}

async function storePagesCount(url, headers) {
  const rawResponse = await fetch(url, { headers });
  if (rawResponse.status !== 200) {
    throw new Error("Request returns " + rawResponse.status);
  }
  const response = await rawResponse.json();
  const { totalPages, totalRows } = response;
  return setStorageValue({ totalPages, totalRows });
}

const storeUrl = async (url) => setStorageValue({ url });

const storeHeaders = async (requestHeaders) => {
  const headers = requestHeaders.reduce((acc, header) => {
    acc[header.name] = header.value;
    return acc;
  }, {});
  return setStorageValue({ headers });
};

function toggleListenWebRequests(enable) {
  if (enable) {
    chrome.webRequest.onSendHeaders.addListener(
      processWebRequest,
      { urls: [LISTEN_REQUEST_URL_PATTERN] },
      ["requestHeaders"]
    );
  } else {
    chrome.webRequest.onSendHeaders.removeListener(processWebRequest);
  }
}

async function processWebRequest(details) {
  if (details.url.includes("&summaryOnly=true")) {
    console.log("summary url canceled...");
    return;
  }
  await setInitialState();
  await storeRequestData(details);
  return { cancel: false };
}

async function setInitialState() {
  console.log("setInitialState...");
  await setStorageValue({
    [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.disabled,
    [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled,
    [STORAGE_KEYS.lastSuccessFetchedPage]: null,
    [STORAGE_KEYS.fetchLastError]: null,
  });
}

async function storeRequestData(details) {
  const filtersStr = getParameterByName(details.url, "filter");
  const filters = filtersStr
    ? filtersStr.split(/,(?=\w)/).map((item) => item.replace(/(\w*==)/, ""))
    : null;

  await setStorageValue({
    filters,
    totalPages: null,
    totalRows: null,
    [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.waitForTotalRows,
  });

  toggleListenWebRequests(false);

  Promise.all([
    storeUrl(details.url),
    storeHeaders(details.requestHeaders),
  ]).then((values) => {
    chrome.storage.sync.get(["headers"], async (result) => {
      await storePagesCount(details.url, result.headers);
      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.ready,
      });
      toggleListenWebRequests(true);
    });
  });
}
