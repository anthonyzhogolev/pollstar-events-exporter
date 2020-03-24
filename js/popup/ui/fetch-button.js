
async function showFetchButton(status){
    console.log('showFetchButton');
    const container = document.querySelector('.js-fetch-button-container');
    
    const retryContainer = document.querySelector('.js-retry-button-container');
    
    const button = document.querySelector('.js-run-btn');
    const loader= container.querySelector('.mdl-js-spinner');
    console.log('button.disabled',button.disabled);
    
    if(status==FETCH_STATUS.error){
        
        retryContainer.style.display='block';
        container.style.display = 'none';
        const errorTextContainer = retryContainer.querySelector('.js-error-text-container');
        const {fetchLastError} = await getStorageValues([STORAGE_KEYS.fetchLastError]);
        errorTextContainer.innerHTML(fetchLastError);

    } else {
        retryContainer.style.display='none';
        container.style.display = 'block';
    }
    
    if(status===FETCH_STATUS.inProgress){

        
        button.style.display='none';
        loader.style.display='block';
        
        return;
    } else {
        button.style.display='block';
        loader.style.display='none';
    }
    
    if(status===FETCH_STATUS.disabled || status===FETCH_STATUS.waitForTotalRows){
        console.log('disabling button',status); 
        button.setAttribute("disabled", "disabled");     
        return;
    }

    if(status===FETCH_STATUS.ready || status===FETCH_STATUS.finish){
        button.removeAttribute("disabled");     
        return;
    }

    


    if(status===FETCH_STATUS.error){
        button.innerText='Retry';
    }
    
}