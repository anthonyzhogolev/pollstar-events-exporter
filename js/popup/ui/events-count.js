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