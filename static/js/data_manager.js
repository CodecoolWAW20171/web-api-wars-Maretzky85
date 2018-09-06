let xhttp = new XMLHttpRequest();
let dataManager = {
    getData: function(request, callback){
        xhttp.open("GET", request, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            //console.log(xhttp.responseText);
            callback(JSON.parse(xhttp.responseText))
            }
        };
    }
}