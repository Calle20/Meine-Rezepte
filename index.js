$( document ).ready(function() {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    
    request.onsuccess = (event) => {
        const db=event.target.result
        // create a new transaction
        const txn = db.transaction('Rezepte');
            // get the Contacts object store
        const store = txn.objectStore('Rezepte');
        //
        let query = store.getAll();
        
        // handle success case
        query.onsuccess = function (event) {
            const rezepte=query.result;
            initListOfCards(rezepte);
        };
        // handle the error case
        query.onerror = function (event) {
            console.log(event.target.errorCode);
        }
        // close the database once the 
        // transaction completes
        txn.oncomplete = function () {
            db.close();
        };
    };
})
let createCard = (task) => {
    cardContainer = document.getElementById('card-container');    
    let card = document.createElement('div');
    card.className = 'card shadow ms-2';
    card.style="width: 13rem; height: 15rem;"

    let cardImg=document.createElement('img');
    cardImg.className='card-img-top';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';


    let title = document.createElement('h5');
    title.innerText = task.Title;
    title.className = 'card-title';

    cardImg.src=task.Image
    cardImg.style="height: 11rem; object-fit: cover;"

    cardBody.appendChild(title);
    card.appendChild(cardImg)
    card.appendChild(cardBody)
    card.addEventListener('click', (event) => {
        console.log(location.href);
        location.assign(location.href.replace("index.html","show.html?title="+task.Title))
    });
    cardContainer.appendChild(card);
}
let initListOfCards = (rezepte) => {
    cardContainer = document.getElementById('card-container');
    rezepte.forEach((task) => {
        createCard(task);
    });
    if (cardContainer) {
        document.getElementById('card-container').replaceWith(cardContainer);
        return;
    }
}; 