const fetchEvents = (request, pagesCount, onPageLoad) => {
  const eventRequests = [];
   
    for (let i = 0; i < 2; i++) {
      const newUrl = request.url.replace(/(page\=\d*)/, `page=${i}`);
      const req = fetch(newUrl, { headers: request.headers })
        .then(response => response.json())
        .then(response => {          
          return onPageLoad(response.events);
        });
      eventRequests.push(req);
    }
    return Promise.all(eventRequests);
   
};

function RequestData(url, headers) {
  this.url = url;
  this.headers = headers;
  return this;
}
