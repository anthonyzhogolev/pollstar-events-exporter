
const createChip = container=>contentText=>{
  const chip = document.createElement("span");
        chip.className = "mdl-chip";        
        const chipText = document.createElement("span");
        chipText.className = "mdl-chip__text";
        chipText.innerText = contentText;
        chip.appendChild(chipText);
        container.appendChild(chip);
}

function showFilters(filters) {
    const filtersList = document.querySelector("#filtersList");
    filtersList.innerHTML = "";
 
    if (filters) {
      filters.map(createChip(filtersList));
    } else {
      filtersList.innerHTML = "No filters...";
    }
  }