$(function () {

    // Handle file select change
    $('#file-input').on('change', function() {
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          var div=document.getElementsByClassName("resize-image-div")
          div.append("<img src="+e.target.result+"/>");
        };
        reader.readAsDataURL(this.files[0]);
      }
    });
  });