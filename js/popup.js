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

  document.querySelector(".js-retry-btn").addEventListener("click", () => {
    
    chrome.runtime.sendMessage({ cmd: "retryExport" }, function(response) {
      
    });
  });

  document.querySelector(".js-run-btn").addEventListener("click", () => {
    
    
    chrome.runtime.sendMessage({ cmd: "runExport" }, function(response) {
      
    });
  });
});
