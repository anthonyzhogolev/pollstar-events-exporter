const fetchEvents = async (request, pagesCount, onPageLoad) => {
  const eventRequests = [];
   
    for (let i = 0; i < pagesCount; i++) {
      const newUrl = request.url.replace(/(page\=\d*)/, `page=${i}`);
      const response =await fetch(newUrl, { headers: request.headers });
      const events  = await response.json();
      await onPageLoad(events);  
    }
     ;
   
};

function RequestData(url, headers) {
  this.url = url;
  this.headers = headers;
  return this;
}
