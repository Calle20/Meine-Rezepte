$(document).ready(function() {
    const search=document.getElementById('search');
    search.addEventListener("click", (event)=>{
        let searchinput=document.getElementById('searchInput').value
        document.getElementById('searchInput').value=""
        location.assign(location.href.replace("show.html","search.html?title="+searchinput))
    })
    
    var query=location.search
    if(query==""){
        query=localStorage.getItem("currentRecipeShown")
    }
    localStorage.setItem("currentRecipeShown", query)
    
    GetRecipes(decodeURIComponent(query.split("=")[1]))
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
        var clean_uri = uri.substring(0, uri.indexOf("?"));
        window.history.replaceState({}, document.title, clean_uri);
    }
});

function GetRecipes(title){
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    
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
                if(ele.Title==title){
                    ShowRecipe(ele);
                }
            });
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
function ShowRecipe(recipe){
    console.table(recipe)
    document.getElementById('showTitle').innerText=recipe.Title,
    document.getElementById('showIngredients').innerText=recipe.Ingredients
    document.getElementById('showMaking').innerText=recipe.Making
    let img=document.getElementById('showImage')
    img.src=recipe.Image
}