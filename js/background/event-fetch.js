const fetchEvents = async (request, pagesCount, onPageLoad, startPage = 0) => {
  let page;

  for (let page = startPage; page < pagesCount; page++) {
    const newUrl = request.url.replace(/(page\=\d*)/, `page=${page}`);

    // const rawResponse =
    //   page === 2
    //     ? await fetch(newUrl, { headers: {} })
    //     : await fetch(newUrl, { headers: request.headers });
    const rawResponse = await fetch(newUrl, { headers: request.headers });
    console.log("rawResponse", rawResponse);
    if (rawResponse.status !== 200) {
      throw new Error(
        "Request returns " + rawResponse.status + " on page#" + page
      );
    }
    const response = await rawResponse.json();

    console.log("responseJsoned", response);
    await onPageLoad(response.events, page);
  }
};

function RequestData(url, headers) {
  this.url = url;
  this.headers = headers;
  return this;
}
