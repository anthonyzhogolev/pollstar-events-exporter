const logToDb = (db, message, level) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("log", "readwrite");
    const store = transaction.objectStore("log");
    const date = new Date().toISOString();
    const id = `f${(+new Date()).toString(16)}`;

    const request = store.add({ id, date, message, level });
    request.onsuccess = () => resolve();
    request.onerror = () => reject();
  });
};
