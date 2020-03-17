const fetchEvents = async (request, pagesCount, onPageLoad) => {
    
    for (let i = 0; i < pagesCount; i++) {
      console.log('begin request ',i);
      const newUrl = request.url.replace(/(page\=\d*)/, `page=${i}`);
      const rawResponse =await fetch(newUrl, { headers: request.headers });
      console.log('fetch ',i);
      const response  = await rawResponse.json();
     
      await onPageLoad(response.events,i);  
    }
    
   
};

function RequestData(url, headers) {
  this.url = url;
  this.headers = headers;
  return this;
}
