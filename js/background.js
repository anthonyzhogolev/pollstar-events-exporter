function getParameterByName(queryString, name) {
    // Escape special RegExp characters
    name = name.replace(/[[^$.|?*+(){}\\]/g, '\\$&');
    // Create Regular expression
    var regex = new RegExp("(?:[?&]|^)" + name + "=([^&#]*)");
    // Attempt to get a match
    var results = regex.exec(queryString);
    console.log(results);
    return decodeURIComponent(results[1].replace(/\+/g, " ")) || '';
}

(function(){
    console.log('start background script 22323');
    chrome.webRequest.onBeforeRequest.addListener(
        function(details) { 
            console.log('request is maded',details);    
            
            const filters = getParameterByName(details.url,'filter').split(/,(?=\w)/).map(item=>item.replace(/(\w*==)/,''));
            console.log('filters',filters);
            chrome.runtime.sendMessage({filters: filters}, function(response) {
                console.log('response',response);
              });
            return {cancel: false}; 
        },
        {urls: ["*://cloud.pollstar.com/api/*"]},
         []);
      

})();