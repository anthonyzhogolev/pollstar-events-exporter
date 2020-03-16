function getParameterByName(queryString, name) {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, "\\$&");
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || "";
  }
  

  const storePagesCount = (url, headers) =>
  new Promise((resolve, reject) => {
    
    fetch(url, { headers })
      .then(response => response.json())
      .then(response => {
        const { totalPages, totalRows } = response;
        chrome.storage.sync.set({ totalPages, totalRows }, () => resolve());
      });
  });

const storeUrl = url =>
  new Promise((resolve, reject) => {
    chrome.storage.sync.set({ url }, () => resolve(url));
  });

const storeHeaders = requestHeaders =>
  new Promise((resolve, reject) => {
    const headers = requestHeaders.reduce((acc, header) => {
      acc[header.name] = header.value;
      return acc;
    }, {});
    chrome.storage.sync.set({ headers }, () => resolve(headers));
  });

function toggleParsingWebRequests(enable) {
  if (enable) {
    chrome.webRequest.onSendHeaders.addListener(
      storeRequestData,
      { urls: ["*://cloud.pollstar.com/api/*"] },
      ["requestHeaders"]
    );
  } else {    
    chrome.webRequest.onSendHeaders.removeListener(storeRequestData);
  }
}

function storeRequestData(details) {
  const filters = getParameterByName(details.url, "filter")
    .split(/,(?=\w)/)
    .map(item => item.replace(/(\w*==)/, ""));

  chrome.storage.sync.set({ filters },()=>{
    chrome.storage.sync.set({ totalPages:null,totalRows:null });
  });

  toggleParsingWebRequests(false);

  Promise.all([
    storeUrl(details.url),
    storeHeaders(details.requestHeaders)
  ]).then(values => {
    chrome.storage.sync.get(["headers"], result => {
      storePagesCount(details.url,result.headers).then(() => toggleParsingWebRequests(true));
    });
  });

  return { cancel: false };
}
