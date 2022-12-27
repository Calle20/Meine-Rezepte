var currentScanPart;
(function (currentScanPart) {
    currentScanPart[currentScanPart["Title"] = 0] = "Title";
    currentScanPart[currentScanPart["Image"] = 1] = "Image";
    currentScanPart[currentScanPart["Making"] = 2] = "Making";
    currentScanPart[currentScanPart["Ingredients"] = 3] = "Ingredients";
})(currentScanPart || (currentScanPart = {}));
var croppedImageDataURL;
var RecipeImage;
$( document ).ready(function() {
    var canvas  = $("#canvas"),
        context = canvas.get(0).getContext('2d');
    $('#fileInput').on( 'change', function(){
        canvas.cropper('destroy');
        if (this.files && this.files[0]) {
        if ( this.files[0].type.match(/^image\//) ) {
            var reader = new FileReader();
            reader.onload = function(evt) {
            var img = new Image();
            img.onload = function() {
                context.canvas.height = img.height;
                context.canvas.width  = img.width;
                context.drawImage(img, 0, 0);
                var cropper = canvas.cropper({
                    scalable:false,
                });
                $('#btnCrop').click(function() {
                    croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png");
                    if(currentPart==currentScanPart.Image){
                        RecipeImage=croppedImageDataURL;
                    }
                    displayCurrentPart(croppedImageDataURL)
                });
                $('#btnRestore').click(function() {
                    canvas.cropper('reset');
                });
            };
            img.src = evt.target.result;
            };
            reader.readAsDataURL(this.files[0]);
        }
        else {
            alert("Ungültiger Datei-Typ. Bitte eine Bilddatei auswählen.");
        }
        }
        else {
        alert('No file(s) selected.');
        }
    }); 
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1
    
    var query=location.search
    if(query!=""){
        GetRecipes(decodeURIComponent(query.split("=")[1]))
        document.getElementById('btnDeleteBox').classList.remove('visually-hidden')
        document.getElementById('btnDeleteBox').addEventListener('click', (event)=>{
            deleteRecipe(query.split("=")[1]);
            location.href=location.href
        })
        var uri = window.location.toString();
        if (uri.indexOf("?") > 0) {
            var clean_uri = uri.substring(0, uri.indexOf("?"));
            window.history.replaceState({}, document.title, clean_uri);
        }
    }
    //#region events
    const title= document.querySelector('input[id="txtTitle"]')
    const ingredients= document.querySelector('textarea[id=txtIngredients]')
    const making= document.querySelector('textarea[id="txtMaking"]')
    const imagediv=document.querySelector('div[id="imgdiv"]')
    const repeatImg= document.querySelector('input[id="repeatImg"]')
    const repeatIngredients= document.querySelector('input[id="repeatIngredients"]')
    const repeatMaking= document.querySelector('input[id="repeatMaking"]')
    const btnFinished=document.querySelector('input[id="btnFinished"]')
    const search=document.getElementById('search');
    const btnExport=document.getElementById('btnExport');
    const btnImport=document.getElementById('btnImport');
    const fileInput = document.getElementById("fileInput");

    window.addEventListener('paste', e => {
        if (e.clipboardData.files[0].type.match(/^image\//)){
            fileInput.files = e.clipboardData.files;
            var clickevent=document.createEvent("MouseEvents");
            clickevent.initEvent("change", true, true);
            document.getElementById("fileInput").dispatchEvent(clickevent);
        }
    });
    var element=document.createElement("canvas")
    element.setAttribute("id","imgcanvas")
    imagediv.appendChild(element)
    var imgcanvas=document.querySelector('canvas[id=imgcanvas]')
    title.addEventListener('click', (event) => {
        currentPart=currentScanPart.Title
        imagediv.classList.remove('Focused')
        making.classList.remove('Focused')
        ingredients.classList.remove('Focused')
        title.classList.add('Focused')
    });
    ingredients.addEventListener('click', (event) => {
        currentPart=currentScanPart.Ingredients
        imagediv.classList.remove('Focused')
        making.classList.remove('Focused')
        ingredients.classList.add('Focused')
        title.classList.remove('Focused')
    });
    making.addEventListener('click', (event) => {
        currentPart=currentScanPart.Making
        imagediv.classList.remove('Focused')
        making.classList.add('Focused')
        ingredients.classList.remove('Focused')
        title.classList.remove('Focused')
    });
    imagediv.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Image
        imagediv.classList.add('Focused')
        making.classList.remove('Focused')
        ingredients.classList.remove('Focused')
        title.classList.remove('Focused')
    })
    repeatImg.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Image
        imagediv.classList.add('focused')
        ingredients.classList.remove('Focused')
        title.classList.remove('Focused')
        making.classList.remove('Focused')

        imgcanvas.parentNode.removeChild(imgcanvas)
        var element=document.createElement("canvas")
        element.setAttribute("id","imgcanvas")
        imagediv.appendChild(element)
        imgcanvas=document.querySelector('canvas[id=imgcanvas]')
    })
    repeatIngredients.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Ingredients
        imagediv.classList.remove('Focused')
        making.classList.remove('Focused')
        ingredients.classList.add('Focused')
        title.classList.remove('Focused')
        $('#txtIngredients').val("")
    })
    repeatMaking.addEventListener('click', (event)=> {
        imagediv.classList.remove('Focused')
        making.classList.add('Focused')
        ingredients.classList.remove('Focused')
        title.classList.remove('Focused')
        currentPart=currentScanPart.Making
        $('#txtMaking').val("")
    })
    btnFinished.addEventListener("click", (event)=>{
        inputFinished($('#txtTitle').val(), RecipeImage, $('#txtIngredients').val(), $('#txtMaking').val())
    })
    search.addEventListener("click", (event)=>{
        let searchinput=document.getElementById('searchInput').value
        document.getElementById('searchInput').value=""
        location.assign(location.href.replace("add.html","search.html?title="+searchinput))
    })

    btnExport.addEventListener("click", (event)=>{
        window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
        dbVersion=1
        const request = indexedDB.open('MeineRezepte', 1);
        
        request.onerror = (event) => {
            alert(`Database error: ${event.target.errorCode}`);
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
                download("rezepte.json", JSON.stringify(query.result));
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

    })
    btnImport.addEventListener('change', readSingleFile, false);
    //#endregion
});
//#region Variables
var currentPart=currentScanPart.Title
var title_inserted=false,
    image_inserted=false,
    ingredients_inserted=false,
    making_inserted=false; 
//#endregion  
function displayCurrentPart(croppedImageDataURL){
    var croppedImage = new Image();
    croppedImage.src=croppedImageDataURL
    switch (currentPart){
        case currentScanPart.Title:
            readTXT(croppedImage, document.querySelector('input[id=txtTitle]'))
            currentPart = currentScanPart.Image;
            break;
        case currentScanPart.Image:
            var canvas=$('#imgcanvas');
            var context=canvas.get(0).getContext('2d');
            croppedImage.onload = drawImageScaled.bind(null,croppedImage,context)
            currentPart = currentScanPart.Ingredients;
            break;
        case currentScanPart.Ingredients:
            readTXT(croppedImage, document.querySelector('textarea[id=txtIngredients]'))
            currentPart = currentScanPart.Making;
            break;
        case currentScanPart.Making:
            readTXT(croppedImage, document.querySelector('textarea[id="txtMaking"]'))
            break;
    }
}

function GetRecipes(title){
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        alert(`Database error: ${event.target.errorCode}`);
    };
    
    request.onsuccess = (event) => {
        const db=event.target.result
        // get the Contacts object store
        const txn=db.transaction('Rezepte')
        const store = txn.objectStore('Rezepte');
        //
        let query = store.get(title);
        
        // handle success case
        query.onsuccess = function (event) {
            ShowRecipe(query.result)
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
}

function deleteRecipe(title){
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        alert(`Database error: ${event.target.errorCode}`);
    };
    
    request.onsuccess = (event) => {
        const db=event.target.result
        // get the Contacts object store
        const txn=db.transaction('Rezepte','readwrite')
        const store = txn.objectStore('Rezepte');
        //
        query=store.delete(title)

        query.onsuccess = function (event) {
            console.log("succes");
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
}

function readSingleFile(evt) {
    var f = evt.target.files[0];
    var contents=[];
    if (f) {
        var r = new FileReader();
        r.onload = function(e) { 
            contents = e.target.result;
            var content=JSON.parse(contents);
            content.forEach(recipe => {
                inputFinished(recipe.Title, recipe.Image, recipe.Ingredients, recipe.Making)
            });
        }
        r.readAsText(f);
    } else {
        alert("Failed to load file");
    }
    
}
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function drawImageScaled(img, ctx) {
    var canvas = ctx.canvas ;
    var hRatio = canvas.width  / img.width    ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.min ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
    var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.drawImage(img, 0,0, img.width, img.height,centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
}

function readTXT(croppedImage, field){
    let pBar=CreateProgressBar(field)
    const worker = Tesseract.createWorker({
        logger: m => {
            if(m.status=='recognizing text')
            {
                pBar.style="width: "+m.progress*100+"%;"
                pBar.innerText=Math.round(m.progress*100)+"%"
            }
        }
    });
    (async () => {
    await worker.load();
    await worker.loadLanguage('deu');
    await worker.initialize('deu');
    const { data: { text } } = await worker.recognize(croppedImage);
    outtext=text.replace("\n\n", '');
    outtext=outtext.replace(/\n+/g, '\n', "Lol")
    ShowOutput(field, outtext)
    await worker.terminate();
    RemoveProgressBar(field, pBar)
    })();
    
}

function CreateProgressBar(field){
    let pDiv=document.createElement('div')
    pDiv.className="progress"

    let pBar=document.createElement('div')
    pBar.className="progress-bar"
    pBar.role="progressbar"
    pBar.ariaLabel="Progressbar"
    pBar.ariaValueNow="0"
    pBar.ariaValueMin="0"
    pBar.ariaValueMax="100"
    pDiv.appendChild(pBar)

    field.parentElement.appendChild(pDiv)
    return pBar
}

function RemoveProgressBar(field, pBar){
    field.parentElement.removeChild(pBar.parentElement);
}

function ShowOutput(field, outtext){
    if(field==document.querySelector('textarea[id=txtIngredients]')){
        $('#txtIngredients').val(outtext)
    }
    else if(field==document.querySelector('textarea[id="txtMaking"]')){
        $('#txtMaking').val(outtext)
    }
    else{
        $('#txtTitle').val(outtext)
    }
}

function inputFinished(title, imgcanvas, ingredients, making){
    const request = indexedDB.open('MeineRezepte', 1);
    request.onerror = (event) => {
        alert(`Database error: ${event.target.errorCode}`);
    };
    
    request.onsuccess = (event) => {
        const db=event.target.result
        // create a new transaction
        const txn = db.transaction('Rezepte', 'readwrite');
            // get the Contacts object store
        const store = txn.objectStore('Rezepte');
        //
        let query = store.put({Title:title, Image:imgcanvas, Ingredients: ingredients, Making:making}, title);
        // handle success case
        query.onsuccess = function (event) {
            document.getElementById('btnDeleteBox').classList.add('visually-hidden')
            location.href=location.href
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
}

function ShowRecipe(recipe){
    $('#txtTitle').val(recipe.Title)
    var croppedImage = new Image();
    croppedImage.src=recipe.Image
    RecipeImage=recipe.Image
    var canvas=$('#imgcanvas');
    var context=canvas.get(0).getContext('2d');
    croppedImage.onload = drawImageScaled.bind(null,croppedImage,context)
    $('#txtIngredients').val(recipe.Ingredients)
    $('#txtMaking').val(recipe.Making)
    deleteRecipe(recipe.Title)
}