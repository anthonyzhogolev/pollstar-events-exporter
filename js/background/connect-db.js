var indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB,
  IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction;
const baseName = "pollstarBase";
const eventsStoreName = "eventsStore";
const logStoreName = "log";

function connectDB(f) {
  var request = indexedDB.open(baseName, 2);
  request.onerror = err => console.log("connection err", err);
  request.onsuccess = function() {
    f(request.result);
  };
  request.onupgradeneeded = function(e) {
    const { result } = e.currentTarget;

    if (!result.objectStoreNames.contains(eventsStoreName)) {
      result.createObjectStore(eventsStoreName, { keyPath: "eventId" });
    }
    if (!result.objectStoreNames.contains(logStoreName)) {
      result.createObjectStore(logStoreName, { keyPath: "id" });
    }

    connectDB(f);
  };
}
