  const LISTEN_REQUEST_URL_PATTERN = "*://cloud.pollstar.com/api/*";

  const STORAGE_KEYS = {
    url:"url",  
    headers:"headers",
    totalPages:"totalPages",
    filters: "filters",
    totalRows: "totalRows",
    fetchStatus: "fetchStatus",
    downloadStatus: "downloadStatus",
    lastSuccessFetchedPage: "lastSuccessFetchedPage",
    errorPage:"errorPage",
    fetchLastError:"fetchLastError"
  };

  const FETCH_STATUS = {
    disabled: "disabled",
    waitForTotalRows:"waitForTotalRows",
    ready: "ready",
    inProgress: "inProgress",
    finish:"finish",
    error: "error"
  };

  const DOWNLOAD_STATUS = {
    disabled: "disabled",
    ready: "ready",
    inProgress: "inProgress",
    finish: "finish",
    error: "error"
  };
