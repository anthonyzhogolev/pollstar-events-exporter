const LISTEN_REQUEST_URL_PATTERN = "*://cloud.pollstar.com/api/*";

const STORAGE_KEYS = {
  url: "url",
  headers: "headers",
  totalPages: "totalPages",
  filters: "filters",
  totalRows: "totalRows",
  fetchStatus: "fetchStatus",
  downloadStatus: "downloadStatus",
  downloadUrl: "downloadUrl",
  lastSuccessFetchedPage: "lastSuccessFetchedPage",

  fetchLastError: "fetchLastError"
};

const FETCH_STATUS = {
  disabled: "disabled",
  waitForTotalRows: "waitForTotalRows",
  ready: "ready",
  inProgress: "inProgress",
  finish: "finish",
  error: "error"
};

const DOWNLOAD_STATUS = {
  disabled: "disabled",
  ready: "ready",
  inProgress: "inProgress",
  finish: "finish",
  error: "error"
};

const LOG_LEVEL = {
  debug: "debug",
  warning: "warning",
  error: "error"
};

const DB_STORES = {
  eventsStore: "eventsStore",
  logStore: "log"
};
