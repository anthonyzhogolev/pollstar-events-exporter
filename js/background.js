(() => {
  //bind with popup
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (!request.cmd) {
      return;
    }
    switch (request.cmd) {
      case "runExport":  
 
        chrome.storage.sync.set({ loadedEvents: [] }, () => {
          chrome.storage.sync.get(["url", "headers", "totalPages"], result => {
            const { url, headers, totalPages } = result;
            const requestData = new RequestData(url, headers);
            toggleParsingWebRequests(false);
            fetchEvents(requestData, totalPages, (events,pageIndex) => {
              //saving events to indexed db
      
              let requests = [];
              connectDB(db => {
                const tx = db.transaction(["eventsStore"], "readwrite");
                events.forEach(value => {
                  let request = tx.objectStore("eventsStore").add(value);
                  requests.push(
                    new Promise((resolve, reject) => {
                      request.onsuccess = event => {
                        resolve();
                      };
                    })
                  );
                });
                db.close();
              });
              return Promise.all(requests);
            }).then(() => {
              toggleParsingWebRequests(true);
     
              connectDB(db => {
                const transaction = db.transaction("eventsStore", "readwrite");
                const store = transaction.objectStore("eventsStore");
                const eventsRequest = store.getAll();
                [];

                eventsRequest.onsuccess = function() {
                  const { result } = eventsRequest;
                  const events = result.reduce(
                    (acc, current) => {
                      acc.push(Object.values(current));
                      return acc;
                    },
                    [Object.keys(result[0])]
                  );
                  
                  const blob = generateCsvBlob(events);
                  const url = URL.createObjectURL(blob);
                  sendResponse({ downloadUrl: url });
                  store.clear();
                  db.close();
                  
                };
              });
            });
          });
        });

        break;
      default:
        sendResponse({ result: "error", message: `Invalid 'cmd'` });
        break;
    }

    return true;
  });

  //listen to networkRequest
  toggleParsingWebRequests(true);
})();
