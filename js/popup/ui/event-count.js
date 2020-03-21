function showTotalRows(status, totalRows) {
  const el = document.querySelector(".js-total-row");
  const loader = el.querySelector(".mdl-js-spinner");
  const textContainer = el.querySelector(".js-text-container");

  if (status === FETCH_STATUS.waitForTotalRows) {
    textContainer.style.display = "none";
    loader.style.display = "block";
    return;
  }
  
  textContainer.style.display = "block";
  loader.style.display = "none";

  if (totalRows) {
    textContainer.innerHTML = totalRows + " events";
  } else {
    el.innerHTML = "No data...";
  }
}
