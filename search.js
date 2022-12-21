$( document ).ready(function() {
    document.getElementById('alert').classList.add('visually-hidden')
    const search=document.getElementById('search');
    search.addEventListener("click", (event)=>{
        let searchinput=document.getElementById('searchInput').value
        document.getElementById('searchInput').value=""
        location.assign(location.href.replace("search.html","search.html?title="+searchinput))
    })
    var query=location.search
    if(query==""){
        query=localStorage.getItem("currentSearchWord")
    }

    localStorage.setItem("currentSearchWord", query)
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
    GetRecipes(decodeURIComponent(query.split("=")[1]))
    
})
function GetRecipes(searchWord){
    
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    let result=[]
    request.onsuccess = (event) => {
        const db=event.target.result
        // get the Contacts object store
        const txn=db.transaction('Rezepte')
        const store = txn.objectStore('Rezepte');
        //
        let query = store.getAll();
        
        
        // handle success case
        query.onsuccess = function (event) {
            const recipes=query.result
            recipes.forEach(ele => {
                if(ele.Title.toUpperCase().includes(searchWord.toUpperCase())||ele.Ingredients.toUpperCase().includes(searchWord.toUpperCase())){
                    result.push(ele)
                }
            }); 
            if(result.length==0){
                ShowNothingFound();
            }
            else{
                initListOfCards(result)
            }
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

   
}
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
        location.assign(location.href.replace("search.html","show.html?title="+task.Title))
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

function ShowNothingFound() {
    document.getElementById('alert').classList.remove('visually-hidden')
}