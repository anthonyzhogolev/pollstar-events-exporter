var indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB,
  IDBTransaction =
    window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction,
  baseName = "pollstarBase",
  storeName = "eventsStore";

function connectDB(f) {
  var request = indexedDB.open(baseName, 1);
  request.onerror = err => console.log("connection err", err);
  request.onsuccess = function() {
    f(request.result);
  };
  request.onupgradeneeded = function(e) {
    e.currentTarget.result.createObjectStore(storeName, { keyPath: "eventId" });
    connectDB(f);
  };
}
