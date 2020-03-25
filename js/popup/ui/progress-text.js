function showProgressText(fetchStatus, currentPage = 0, totalPages = 0) {
  console.log("show progress text", fetchStatus, currentPage, totalPages);
  const container = document.querySelector(".js-progress-container");
  const text = container.querySelector(".js-progress-text");
  if (fetchStatus === FETCH_STATUS.inProgress && currentPage && totalPages) {
    text.style.display = "block";
    text.innerHTML = "page#" + currentPage + " of " + totalPages;
  } else {
    text.style.display = "none";
  }
}
