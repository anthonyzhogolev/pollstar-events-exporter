
function showFetchButton(status){
    console.log('showFetchButton');
    const container = document.querySelector('.js-fetch-button-container');
   
    const button = document.querySelector('.js-run-btn');
    console.log('button.disabled',button.disabled);
    
    
    
    if(status===FETCH_STATUS.disabled || status===FETCH_STATUS.waitForTotalRows){
        
        button.setAttribute("disabled", "disabled");     
        return;
    }

    if(status===FETCH_STATUS.ready){
        button.removeAttribute("disabled");     
        return;
    }

    if(status===FETCH_STATUS.inProgress){

        const loader= container.querySelector('.mdl-js-spinner');
        button.style.display='none';
        loader.style.display='block';
        
        return;
    }

    if(status===FETCH_STATUS.error){
        button.innerText='Retry';
    }
    
}