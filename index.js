var editMode=false;
$( document ).ready(function() {
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        alert(`Database error: ${event.target.errorCode}`);
    };

    request.onupgradeneeded = (event) => {
        let db = event.target.result;
   
        // create the Contacts object store 
        // with auto-increment id
        let store = db.createObjectStore('Rezepte')
        store.createIndex("Title", "Title", {unique: true});
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
            alert(event.target.errorCode);
        }
        // close the database once the 
        // transaction completes
        txn.oncomplete = function () {
            db.close();
        };
    };

    const search=document.getElementById('search');
    search.addEventListener("click", (event)=>{
        let searchinput=document.getElementById('searchInput').value
        document.getElementById('searchInput').value=""
        location.assign(location.href.replace("index.html","search.html?title="+searchinput))
    })
    const editswitch=document.getElementById('switch-btn');
    editswitch.addEventListener('change', (event)=>{
        if(editswitch.checked){
            editMode=true
        }
        else{
            editMode=false
        }
    })
})
let createCard = (task) => {
    cardContainer = document.getElementById('card-container');    
    let card = document.createElement('div');
    card.className = 'card shadow ms-2';
    card.style="width: 13rem; height: 15rem;"

    let cardImg=document.createElement('img');
    cardImg.className='card-img-top';
    cardImg.alt="Kein Bild hinzugefügt"

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body  d-flex align-items-center justify-content-center';

    let title = document.createElement('h5');
    title.innerText = task.Title;
    title.className = 'card-title';

    cardImg.src=task.Image
    cardImg.style="min-height: 10rem; max-height: 10rem; object-fit: cover; padding-top: 0.5vh;"

    cardBody.appendChild(title);
    card.appendChild(cardImg)
    card.appendChild(cardBody)
    card.addEventListener('click', (event) => {
        if(editMode){
            location.assign(location.href.replace("index.html","add.html?title="+task.Title))
        }
        else{
            location.assign(location.href.replace("index.html","show.html?title="+task.Title))
        }
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