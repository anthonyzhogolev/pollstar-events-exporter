function showDownloadLink(url) {
    const container = document.createElement("div");
    const downloadLink = document.createElement("a");
  
    downloadLink.download = "my.csv";
    downloadLink.href = url;
    downloadLink.className = "mdl-button mdl-js-button mdl-button--primary";
  
    downloadLink.style.margin = "0 5px";
   
    downloadLink.innerText = "Download";
  
    const actionsContainer = document.querySelector(".actions-container");
    container.appendChild(downloadLink);
    actionsContainer.appendChild(container);
  }