document.addEventListener("DOMContentLoaded", () => {
  //get filters from storage and show chips in popup

  chrome.storage.sync.get(
    [
      STORAGE_KEYS.filters,
      STORAGE_KEYS.totalRows,
      STORAGE_KEYS.fetchStatus,
      STORAGE_KEYS.downloadStatus
    ],
    result => {
      const { filters, totalRows, fetchStatus, downloadStatus } = result;

      showFilters(filters);
      showTotalRows(fetchStatus, totalRows);
      showFetchButton(fetchStatus);
      // showDownloadButton(downloadStatus);
    }
  );

  chrome.storage.onChanged.addListener(function(changes, namespace) {
 
 

    chrome.storage.sync.get(
      [
        STORAGE_KEYS.filters,
        STORAGE_KEYS.totalRows,
        STORAGE_KEYS.fetchStatus,
        STORAGE_KEYS.downloadStatus
      ],
      result => {
        const { filters, totalRows, fetchStatus, downloadStatus } = result;
  
        showFilters(filters);
        showTotalRows(fetchStatus, totalRows);
        showFetchButton(fetchStatus);
        // showDownloadButton(downloadStatus);
      }
    );
  
  });

  //

  var port = chrome.runtime.connect({ name: "pollstar" });

  document.querySelector(".js-run-btn").addEventListener("click", () => {
    const button = document.querySelector(".js-run-btn");
    button.style.display = "none";
    const loader = document.querySelector(".mdl-js-spinner");
    loader.style.display = "block";
    chrome.runtime.sendMessage({ cmd: "runExport" }, function(response) {
      button.style.display = "block";
      loader.style.display = "none";
      if (response.downloadUrl) {
        showDownloadLink(response.downloadUrl);
      }
    });
  });
});
