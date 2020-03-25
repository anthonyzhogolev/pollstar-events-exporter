document.addEventListener("DOMContentLoaded", () => {
  //get filters from storage and show chips in popup

  chrome.storage.sync.get(
    [
      STORAGE_KEYS.filters,
      STORAGE_KEYS.totalRows,
      STORAGE_KEYS.fetchStatus,
      STORAGE_KEYS.downloadStatus,
      STORAGE_KEYS.totalPages,
      STORAGE_KEYS.lastSuccessFetchedPage
    ],
    result => {
      const {
        filters,
        totalRows,
        fetchStatus,
        downloadStatus,
        lastSuccessFetchedPage,
        totalPages
      } = result;

      showFilters(filters);
      showTotalRows(fetchStatus, totalRows);
      showFetchButton(fetchStatus);
      showProgressText(fetchStatus, lastSuccessFetchedPage, totalPages);
      showDownloadButton(downloadStatus);
    }
  );

  chrome.storage.onChanged.addListener(function(changes, namespace) {
    let isDownloadFinished = false;
    let downloadUrl = null;
    for (var key in changes) {
      var storageChange = changes[key];
      console.log(
        'Storage key "%s" in namespace "%s" changed. ' +
          'Old value was "%s", new value is "%s".',
        key,
        namespace,
        storageChange.oldValue,
        storageChange.newValue
      );

      if (
        key === STORAGE_KEYS.downloadStatus &&
        storageChange.oldValue === DOWNLOAD_STATUS.inProgress &&
        storageChange.newValue === DOWNLOAD_STATUS.finish
      ) {
        isDownloadFinished = true;
      }
      if (key === STORAGE_KEYS.downloadUrl) {
        downloadUrl = storageChange.newValue;
      }
    }

    console.log("isDownloadFinished", isDownloadFinished, downloadUrl);

    if (isDownloadFinished && downloadUrl) {
      const a = document.querySelector(".js-download-link");

      a.href = downloadUrl;
      a.download = "my.csv";
      a.click();
      showDownloadButton(DOWNLOAD_STATUS.finish);
      // window.URL.revokeObjectURL(downloadUrl);
    }

    chrome.storage.sync.get(
      [
        STORAGE_KEYS.filters,
        STORAGE_KEYS.totalRows,
        STORAGE_KEYS.fetchStatus,
        STORAGE_KEYS.downloadStatus,
        STORAGE_KEYS.totalPages,
        STORAGE_KEYS.lastSuccessFetchedPage
      ],
      result => {
        const {
          filters,
          totalRows,
          fetchStatus,
          downloadStatus,
          totalPages,
          lastSuccessFetchedPage
        } = result;

        showFilters(filters);
        showTotalRows(fetchStatus, totalRows);
        showFetchButton(fetchStatus);
        showProgressText(fetchStatus, lastSuccessFetchedPage, totalPages);
        showDownloadButton(downloadStatus);
      }
    );
  });

  //

  var port = chrome.runtime.connect({ name: "pollstar" });

  document.querySelector(".js-retry-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ cmd: "retryExport" }, function(response) {});
  });

  document.querySelector(".js-run-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ cmd: "runExport" }, function(response) {});
  });

  document.querySelector(".js-download-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ cmd: "generateCsv" }, function(response) {});
  });
});
