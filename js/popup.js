function showFilters(filters) {
  const filterListElement = document.querySelector("#filtersList");
  filterListElement.innerHTML = "";
  const runBtn = document.querySelector(".js-run-btn");
  runBtn.setAttribute("disabled", "disabled");
  if (filters) {
    filters.map(filterName => {
      const chip = document.createElement("span");
      chip.className = "mdl-chip";
      chip.style.margin = "0 5px 2px 0";
      const chipText = document.createElement("span");
      chipText.className = "mdl-chip__text";
      chipText.innerText = filterName;
      chip.appendChild(chipText);

      filterListElement.appendChild(chip);
    });
  } else {
    filterListElement.innerHTML = "No filters...";
  }
}

function showDownloadLink(url) {
  const container = document.createElement("div");
  const downloadLink = document.createElement("a");

  downloadLink.download = "my.csv";
  downloadLink.href = url;
  downloadLink.className = "mdl-button mdl-js-button mdl-button--primary";

  downloadLink.style.margin = "0 5px";

  // const downloadIcon = document.createElement("i");
  // downloadIcon.className = "material-icons";
  // downloadIcon.innerText = "file_download";
  // downloadLink.appendChild(downloadIcon);

  downloadLink.innerText = "Download";

  const actionsContainer = document.querySelector(".actions-container");
  container.appendChild(downloadLink);
  actionsContainer.appendChild(container);
}

function showTotalRows(totalRows) {
  const el = document.querySelector(".js-total-row");

  if (totalRows) {
    el.innerHTML = totalRows + " events";
    const runBtn = document.querySelector(".js-run-btn");
    runBtn.removeAttribute("disabled");
  } else {
    el.innerHTML = "...";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //get filters from storage and show chips in popup
  chrome.storage.sync.get(["filters", "totalRows"], result => {
    showFilters(result.filters);
    showTotalRows(result.totalRows);
  });

  //

  var port = chrome.runtime.connect({ name: "pollstar" });

  document.querySelector(".js-run-btn").addEventListener("click", () => {
    const button = document.querySelector(".js-run-btn");
    button.style.display = "none";
    const loader = document.querySelector(".mdl-js-spinner");
    loader.style.display = "block";
    chrome.runtime.sendMessage({ cmd: "runExport" }, function(response) {
      button.style.display = "block";
      loader.style.display = "none";
      if (response.downloadUrl) {
        showDownloadLink(response.downloadUrl);
      }
    });
  });
});
