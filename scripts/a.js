









function getTitle(externalUrl){
  var proxyurl = "http:localhost/get_external_content.php?url=" + externalUrl;
  $.ajax({
    url: proxyurl,
    async: true,
    success: function(response) {
      alert(response);
    },   
    error: function(e) {
      alert("error! " + e);
    }
  });
}
getTitle();


  $.ajax({
         url: "http:textance.herokuapp.com/title/" + url,
         complete: function(data) {
            //alert(data.responseText);
        //  nome = data.responseText;
        console.log(data);
         }
   });

  //  return result;