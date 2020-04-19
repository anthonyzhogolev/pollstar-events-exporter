const logToDb = (db, message, level) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("log", "readwrite");
    const store = transaction.objectStore("log");
    const date = new Date().toISOString();

    const request = store.add({ date, message, level });
    request.onsuccess = () => resolve();
    request.onerror = (e) => {
      console.log("exception", e);
      reject(e);
    };
  });
};
