document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".download-log").addEventListener("click", () => {
    connectDB(db => {
      const logTransaction = db.transaction("log", "readwrite");
      const logStore = logTransaction.objectStore("log");
      const request = logStore.getAll();
      request.onsuccess = async function() {
        const { result } = request;
        const logItems = result.reduce((acc, current) => {
          acc.push(`${current.date}:  ${current.level} - ${current.message}`);
          return acc;
        }, []);
        const blob = new Blob([logItems.join("\n")], {
          type: "text;charset=utf-8;"
        });
        const url = URL.createObjectURL(blob);
        const a = document.querySelector("#download-hidden-link");
        a.href = url;

        a.download = "my.txt";
        a.click();
      };
    });
  });
});
