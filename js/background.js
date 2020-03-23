(() => {

  const savePage = async (events, pageIndex) => {
    //saving events to indexed db
    let requests = [];
    connectDB(db => {
      const tx = db.transaction(["eventsStore"], "readwrite");
      events.forEach(value => {
        let request = tx.objectStore("eventsStore").add(value);
        requests.push(
          new Promise((resolve, reject) => {
            request.onsuccess = event => {
              resolve();
            };
          })
        );
      });
      db.close();
    });
    await Promise.all(requests);
    setStorageValue({ [STORAGE_KEYS.lastSuccessFetchedPage]: pageIndex });
  }

  const runExport = async () => {
    const { url, headers, totalPages } = await getStorageValues([
      STORAGE_KEYS.url,
      STORAGE_KEYS.headers,
      STORAGE_KEYS.totalPages
    ]);
    toggleListenWebRequests(false);
    const requestData = new RequestData(url, headers);
    setStorageValue({ [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.disabled });
    try {
      await fetchEvents(requestData, totalPages,savePage );
      setStorageValue({ [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.ready });
    } catch (e) {
      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: error.message
      });
    }

    toggleListenWebRequests(true);
  };

  const retryExport = async () => {
    const { lastSuccessFetchedPage } = await getStorageValues([
      STORAGE_KEYS.lastSuccessFetchedPage
    ]);
    setStorageValue({ [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.disabled });
    console.log('retry export');
    console.log(lastSuccessFetchedPage, "lastSuccessFetchedPage");
    try {
      await fetchEvents(
        requestData,
        totalPages,
        savePage,
        lastSuccessFetchedPage + 1
      );
      setStorageValue({ [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.ready });
    } catch (e) {
      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: error.message
      });
    }
  };

  generateCsv = () =>
    connectDB(db => {
      const transaction = db.transaction("eventsStore", "readwrite");
      const store = transaction.objectStore("eventsStore");
      const eventsRequest = store.getAll();
      [];

      eventsRequest.onsuccess = function() {
        const { result } = eventsRequest;
        const events = result.reduce(
          (acc, current) => {
            acc.push(Object.values(current));
            return acc;
          },
          [Object.keys(result[0])]
        );

        const blob = generateCsvBlob(events);
        const url = URL.createObjectURL(blob);
        sendResponse({ downloadUrl: url });
        store.clear();
        db.close();
      };
    });

  //bind with popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request.cmd) {
      return;
    }
    switch (request.cmd) {
      case "runExport":
        runExport();
        break;
      case "retryExport":
        retryExport();
      case "generateCsv":
        generateCsv();

        break;
      default:
        sendResponse({ result: "error", message: `Invalid 'cmd'` });
        break;
    }

    return true;
  });

  setStorageValue({[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.disabled});

  chrome.webRequest.onSendHeaders.addListener(
    ()=>setStorageValue({[STORAGE_KEYS.downloadStatus]:DOWNLOAD_STATUS.disabled}),
    { urls: [LISTEN_REQUEST_URL_PATTERN] },
    ["requestHeaders"]
  );

  //listen to networkRequest
  toggleListenWebRequests(true);
})();
