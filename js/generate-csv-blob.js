function generateCsvBlob(data) {
  var lineArray = [];
  data.forEach(function(infoArray, index) {
    var line = infoArray.join(",");
    lineArray.push(line);
  });

  var csvContent = lineArray.join("\n");  
  return new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
}
