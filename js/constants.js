const ENV = "prod";

const LISTEN_REQUEST_URL_PATTERN_PROD = "*://cloud.pollstar.com/api/*";
const LISTEN_REQUEST_URL_PATTERN_DEBUG = "http://localhost/api/*";

const LISTEN_REQUEST_URL_PATTERN =
  ENV === "debug"
    ? LISTEN_REQUEST_URL_PATTERN_DEBUG
    : LISTEN_REQUEST_URL_PATTERN_PROD;

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

  fetchLastError: "fetchLastError",
};

const FETCH_STATUS = {
  disabled: "disabled",
  waitForTotalRows: "waitForTotalRows",
  errorOnRequestInitial: "errorOnRequestInitial",
  ready: "ready",
  inProgress: "inProgress",
  finish: "finish",
  error: "error",
};

const DOWNLOAD_STATUS = {
  disabled: "disabled",
  ready: "ready",
  inProgress: "inProgress",
  finish: "finish",
  error: "error",
};

const LOG_LEVEL = {
  debug: "debug",
  warning: "warning",
  error: "error",
};

const DB_STORES = {
  eventsStore: "eventsStore",
  logStore: "log",
};
