(async () => {
  const clearDb = () => {
    return new Promise((resolve, reject) => {
      connectDB((db) => {
        const transaction = db.transaction(
          [DB_STORES.eventsStore],
          "readwrite"
        );

        const logTransaction = db.transaction(
          [DB_STORES.logStore],
          "readwrite"
        );
        const logStore = logTransaction.objectStore(DB_STORES.logStore);
        logStore.clear();

        const eventsStore = transaction.objectStore("eventsStore");
        eventsStore.clear();

        db.close();
        resolve();
      });
    });
  };

  const logToDbWrapper = async (message, level = LOG_LEVEL.debug) => {
    connectDB(async (db) => {
      try {
        await logToDb(db, message, level);
        db.close();
      } catch (e) {
        console.error("logToDbException:", e);
      }
    });
  };

  const savePage = async (events, pageIndex, url, status) => {
    let requests = [];
    logToDbWrapper(`${status} ${url} `, LOG_LEVEL.debug);
    connectDB((db) => {
      const tx = db.transaction([DB_STORES.eventsStore], "readwrite");
      events.forEach((value) => {
        let request = tx.objectStore("eventsStore").add(value);
        requests.push(
          new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
              resolve();
            };
          })
        );
      });
      db.close();
    });
    await Promise.all(requests);

    setStorageValue({ [STORAGE_KEYS.lastSuccessFetchedPage]: pageIndex });
    logToDbWrapper(
      `${events.length} from page#${pageIndex} saved`,
      LOG_LEVEL.debug
    );
  };

  const runExport = async () => {
    const { url, headers, totalPages } = await getStorageValues([
      STORAGE_KEYS.url,
      STORAGE_KEYS.headers,
      STORAGE_KEYS.totalPages,
    ]);

    await logToDbWrapper(
      `run export... totalPages=${totalPages}`,
      LOG_LEVEL.debug
    );

    await setStorageValue({
      [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,
      [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled,
    });

    try {
      const requestData = new RequestData(url, headers);
      await fetchEvents(requestData, totalPages, savePage);

      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.ready,
        [STORAGE_KEYS.lastSuccessFetchedPage]: null,
      });

      await logToDbWrapper(`export finished`, LOG_LEVEL.debug);
    } catch (e) {
      console.log("runExport throwed exception:", e);

      const { lastSuccessFetchedPage } = await getStorageValues([
        STORAGE_KEYS.lastSuccessFetchedPage,
      ]);
      await logToDbWrapper(
        `error on page#${lastSuccessFetchedPage + 1}: ${e.message}`,
        LOG_LEVEL.error
      );

      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: e.message,
      });
    }
  };

  const retryExport = async () => {
    const {
      url,
      headers,
      totalPages,
      lastSuccessFetchedPage,
    } = await getStorageValues([
      STORAGE_KEYS.lastSuccessFetchedPage,
      STORAGE_KEYS.url,
      STORAGE_KEYS.headers,
      STORAGE_KEYS.totalPages,
    ]);

    await setStorageValue({
      [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.inProgress,
      [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled,
    });

    await logToDbWrapper(
      `retry export from page#${lastSuccessFetchedPage + 1}`,
      LOG_LEVEL.debug
    );

    try {
      const requestData = new RequestData(url, headers);
      await fetchEvents(
        requestData,
        totalPages,
        savePage,
        lastSuccessFetchedPage + 1
      );
      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.finish,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.ready,
        [STORAGE_KEYS.lastSuccessFetchedPage]: null,
      });
    } catch (e) {
      const { lastSuccessFetchedPage } = await getStorageValues([
        STORAGE_KEYS.lastSuccessFetchedPage,
      ]);
      await logToDbWrapper(
        `error on page#${lastSuccessFetchedPage + 1}: ${e.message}`,
        LOG_LEVEL.debug
      );

      await setStorageValue({
        [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.error,
        [STORAGE_KEYS.fetchLastError]: e.message,
      });
    }
  };

  generateCsv = async () =>
    connectDB(async (db) => {
      await setStorageValue({
        [STORAGE_KEYS.downloadUrl]: null,
        [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.inProgress,
      });

      const transaction = db.transaction("eventsStore", "readwrite");
      const store = transaction.objectStore("eventsStore");
      const eventsRequest = store.getAll();
      [];

      eventsRequest.onsuccess = async function () {
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
          [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.finish,
        });

        db.close();
      };
    });

  //bind with popup
  chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
  ) {
    if (!request.cmd) {
      return;
    }
    switch (request.cmd) {
      case "runExport":
        await clearDb();
        await logToDbWrapper("clear databases...", LOG_LEVEL.debug);

        toggleListenWebRequests(false);
        await runExport();
        toggleListenWebRequests(true);

        break;
      case "retryExport":
        toggleListenWebRequests(false);
        await retryExport();
        toggleListenWebRequests(true);

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
  await clearDb();

  chrome.runtime.onInstalled.addListener(function () {
    console.log("on installed");
  });

  setStorageValue({
    [STORAGE_KEYS.totalRows]: null,
    [STORAGE_KEYS.filters]: [],
    [STORAGE_KEYS.fetchStatus]: FETCH_STATUS.disabled,
    [STORAGE_KEYS.downloadStatus]: DOWNLOAD_STATUS.disabled,
    [STORAGE_KEYS.lastSuccessFetchedPage]: null,
    [STORAGE_KEYS.fetchLastError]: null,
  });
  toggleListenWebRequests(true);
})();
