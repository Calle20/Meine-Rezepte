$( document ).ready(function() {
    var canvas  = $("#canvas"),
        context = canvas.get(0).getContext('2d'),
        $result = $('#result');
    var croppedImage;

    $('#fileInput').on( 'change', function(){
        if (this.files && this.files[0]) {
        if ( this.files[0].type.match(/^image\//) ) {
            var reader = new FileReader();
            reader.onload = function(evt) {
            var img = new Image();
            img.onload = function() {
                context.canvas.height = img.height;
                console.log("here");
                context.canvas.width  = img.width;
                context.drawImage(img, 0, 0);
                var cropper = canvas.cropper({
                    scalable:false,
                });
                $('#btnCrop').click(function() {
                    // Get a string base 64 data url
                    var croppedImageDataURL = canvas.cropper('getCroppedCanvas').toDataURL("image/png");
                    croppedImage=croppedImageDataURL;
                });
                $('#btnRestore').click(function() {
                
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
});