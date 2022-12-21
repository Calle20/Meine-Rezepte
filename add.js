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
            alert("Invalid file type! Please select an image file.");
        }
        }
        else {
        alert('No file(s) selected.');
        }
    }); 
    window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    dbVersion=1

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
        image.classList.remove('Focused')
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
        console.log("search click");
        let searchinput=document.getElementById('searchInput').value
        document.getElementById('searchInput').value=""
        location.assign(location.href.replace("add.html","search.html?title="+searchinput))
    })
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
            readTXT(croppedImage, $('#txtTitle'))
            currentPart = currentScanPart.Image;
            break;
        case currentScanPart.Image:
            var canvas=$('#imgcanvas');
            var context=canvas.get(0).getContext('2d');
            croppedImage.onload = drawImageScaled.bind(null,croppedImage,context)
            currentPart = currentScanPart.Ingredients;
            break;
        case currentScanPart.Ingredients:
            readTXT(croppedImage, $('#txtIngredients'))
            currentPart = currentScanPart.Making;
            break;
        case currentScanPart.Making:
            readTXT(croppedImage, $('#txtMaking'))
            break;
    }
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
    field.attr('placeholder','Lädt...')
    const worker = Tesseract.createWorker({
    logger: m => console.log(m)
    });
    (async () => {
    await worker.load();
    await worker.loadLanguage('deu');
    await worker.initialize('deu');
    const { data: { text } } = await worker.recognize(croppedImage);
    outtext=text.replace("\n\n", '');
    outtext=outtext.replace(/\n+/g, '\n', "Lol")
    field.val(outtext)
    field.attr('placeholder','')
    await worker.terminate();
    })();
}

function inputFinished(title, imgcanvas, ingredients, making){
    const request = indexedDB.open('MeineRezepte', 1);
    
    request.onerror = (event) => {
        console.error(`Database error: ${event.target.errorCode}`);
    };
    request.onupgradeneeded = (event) => {
        let db = event.target.result;
   
        // create the Contacts object store 
        // with auto-increment id
        let store = db.createObjectStore('Rezepte', {
            autoIncrement: true,
            keyPath: 'by_title'
        });
        store.createIndex("by_title", "Title");
        store.createIndex("by_ingredients", "Ingredients");
    };
    
    request.onsuccess = (event) => {
        const db=event.target.result
        // create a new transaction
        const txn = db.transaction('Rezepte', 'readwrite');
            // get the Contacts object store
        const store = txn.objectStore('Rezepte');
        //
        let query = store.put({Title:title, Image:imgcanvas, Ingredients: ingredients, Making:making});
        // handle success case
        query.onsuccess = function (event) {
            location.href=location.href
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