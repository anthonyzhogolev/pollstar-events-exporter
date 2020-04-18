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
  var request = indexedDB.open(baseName, DB_VERSION);
  request.onerror = (err) => console.log("connection err", err);
  request.onsuccess = function () {
    f(request.result);
  };
  request.onupgradeneeded = function (event) {
    const { result } = event.currentTarget;
    console.log("onupgradeneeded", event, event.oldVersion);

    if (event.oldVersion < 3) {
      if (!result.objectStoreNames.contains(eventsStoreName)) {
        result.createObjectStore(eventsStoreName, { keyPath: "eventId" });
        console.log("createObjectStore", eventsStoreName);
      }
      if (!result.objectStoreNames.contains(logStoreName)) {
        result.createObjectStore(logStoreName, { keyPath: "id" });
        console.log("createObjectStore", logStoreName);
      }
    }
    if (event.oldVersion < 4) {
      result.deleteObjectStore(logStoreName);
      console.log("delete store", logStoreName);
      result.createObjectStore(logStoreName, {
        keyPath: "id",
        autoIncrement: true,
      });
    }

    connectDB(f);
  };
}
