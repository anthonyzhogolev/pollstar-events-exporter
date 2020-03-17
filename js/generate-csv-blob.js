function formatValue(value) {
  let result;
  if (typeof value === "string") {
    result = '"' + value.replace(/\"/g, "").replace(",", " ::") + '"';
    return result;
  }
  return value;
}

function generateCsvBlob(data) {
  var lineArray = [];
  data.forEach(function(infoArray, index) {
    var line = infoArray.map(formatValue).join(",");

    lineArray.push(line);
  });

  var csvContent = lineArray.join("\n");
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}
