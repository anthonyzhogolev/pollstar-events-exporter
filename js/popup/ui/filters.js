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