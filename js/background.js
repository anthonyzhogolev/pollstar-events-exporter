(() => {
  const savePage = async (events, pageIndex) => {
    // console.log('savePage',events,pageIndex)
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
  };

  const runExport = async () => {
    console.log("run export...");

    const { url, headers, totalPages } = await getStorageValues([
      STORAGE_KEYS.url,
      STORAGE_KEYS.headers,
      STORAGE_KEYS.totalPages
    ]);

    toggleListenWebRequests(false);

    await setStorageValue({
      [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,
      [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled
    });

    try {
      const requestData = new RequestData(url, headers);
      await fetchEvents(requestData, totalPages, savePage);

      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.ready
      });
    } catch (e) {
      console.log("runExport throwed exception:", e);
      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: e.message
      });
    }

    toggleListenWebRequests(true);
  };

  const retryExport = async () => {
    
    const {
      url,
      headers,
      totalPages,
      lastSuccessFetchedPage
    } = await getStorageValues([
      STORAGE_KEYS.lastSuccessFetchedPage,
      STORAGE_KEYS.url,
      STORAGE_KEYS.headers,
      STORAGE_KEYS.totalPages
    ]);

    await setStorageValue({
      [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,
      [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled
    });

    console.log("retry export");
    console.log(lastSuccessFetchedPage, "lastSuccessFetchedPage");
    
    try {
      const requestData = new RequestData(url, headers);
      await fetchEvents(
        requestData,
        totalPages,
        savePage,
        lastSuccessFetchedPage + 1
      );
      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.ready
      });
    } catch (e) {
      setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: e.message
      });
    }
  };

  generateCsv = async () =>
    connectDB(async db => {
      await setStorageValue({
        [STORAGE_KEYS.downloadUrl]: null,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.inProgress
      });
      
      const transaction = db.transaction("eventsStore", "readwrite");
      const store = transaction.objectStore("eventsStore");
      const eventsRequest = store.getAll();
      [];

      eventsRequest.onsuccess = async function() {
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
        await setStorageValue({
          [STORAGE_KEYS.downloadUrl]: url,
          [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.finish
        });
        
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
        connectDB(db => {
          const transaction = db.transaction("eventsStore", "readwrite");
          const store = transaction.objectStore("eventsStore");
          store.clear();
          console.log("clear storage...");
          db.close();
        });
        runExport();
        break;
      case "retryExport":
        retryExport();
        break;
      case "generateCsv":
        generateCsv();

        break;
      default:
        sendResponse({ result: "error", message: `Invalid 'cmd'` });
        break;
    }

    return true;
  });

  chrome.runtime.onInstalled.addListener(function() {
    console.log("on installed");
  });

  // setStorageValue({
  //   [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.disabled,
  //   [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled,
  //   [STORAGE_KEYS.lastSuccessFetchedPage]: null,
  //   [STORAGE_KEYS.fetchLastError]: null
  // });
  toggleListenWebRequests(true);
})();
