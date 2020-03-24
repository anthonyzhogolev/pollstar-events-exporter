function showDownloadButton(status) {
  const container = document.querySelector(".js-download-button-container");
  const button = document.querySelector(".js-download-btn");
  const loader = container.querySelector(".mdl-js-spinner");

  if (status === DOWNLOAD_STATUS.disabled) {
    button.setAttribute("disabled", "disabled");
    return;
  }
  if (status === DOWNLOAD_STATUS.ready || status === DOWNLOAD_STATUS.finish) {
    button.removeAttribute("disabled");
    return;
  }
  if (status === DOWNLOAD_STATUS.inProgress) {
    loader.style.display = "block";
    button.style.display = "none";
  } else {
    loader.style.display = "none";
    button.style.display = "block";
  }
  
}
