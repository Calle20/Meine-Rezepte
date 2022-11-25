var currentScanPart;
(function (currentScanPart) {
    currentScanPart[currentScanPart["Title"] = 0] = "Title";
    currentScanPart[currentScanPart["Image"] = 1] = "Image";
    currentScanPart[currentScanPart["Making"] = 2] = "Making";
    currentScanPart[currentScanPart["Ingredients"] = 3] = "Ingredients";
})(currentScanPart || (currentScanPart = {}));

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
                    // Get a string base 64 data url
                    var croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png");
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
    const title= document.querySelector('input[id="txtTitle"]')
    const ingredients= document.querySelector('textarea[id=txtIngredients]')
    const making= document.querySelector('textarea[id="txtMaking"]')
    const image=document.querySelector('canvas[id="imgcanvas"]')
    const repeatImg= document.querySelector('input[id="repeatImg"]')
    const repeatIngredients= document.querySelector('input[id="repeatIngredients"]')
    const repeatMaking= document.querySelector('input[id="repeatMaking"]')
    title.addEventListener('focus', (event) => {
        currentPart=currentScanPart.Title
    });
    ingredients.addEventListener('focus', (event) => {
        currentPart=currentScanPart.Ingredients
    });
    making.addEventListener('focus', (event) => {
        currentPart=currentScanPart.Making
    });
    image.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Image
    })
    repeatImg.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Image
        context.clearRect(0,0,canvas.width, canvas.height)
    })
    repeatIngredients.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Ingredients
        $('#txtIngredients').val=("")
    })
    repeatMaking.addEventListener('click', (event)=> {
        currentPart=currentScanPart.Making
        $('#txtMaking').val("")
    })
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
            making_inserted=true;
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
    text.replace("\r\n"," ")
    field.val(text)
    field.attr('placeholder','')
    await worker.terminate();
    })();
}