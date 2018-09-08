let xhttp = new XMLHttpRequest();
let loadingState = 0;
let loadedItems = 0;
let requestNr = 0;
let itemsToLoad = 0;
let dataManager = {
    residentDetails: ['Name','Height', 'Mass', 'Skin color', 'Hair color', 'Eye color', 'Birth year', 'Gender'],

    getData: function(request, callback){
        try {
            let waitBox = document.getElementById('initialWaitBox');
            waitBox.innerHTML += '<br><br>Request sent, waiting for response'
        } catch (err) {
            
        }
        xhttp.open("GET", request, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(xhttp.responseText))
            }
            if (this.readyState == 4 && this.status != 200){
                try {
                    document.getElementById('initialWaitBox').innerHTML = 'Something went wrong, please reload'
                } catch (error) {
                    try {
                        document.getElementById('msgBox').innerHTML = 'Something went wrong, please reload'
                    } catch (error) {
                        try {
                            document.getElementById('modalMsgBox').innerHTML = 'Something went wrong, please reload'
                        } catch (error) {
                            
                        }
                    }   
                }

            }
        };
    },
    planetDataFormatter: function(planetObject){
        let planet = JSON.parse(planetObject);
        let classNames = dom.tableClasses;
        classNames.forEach(cName => {
            if(cName == 'diameter'){
                if(Number.isInteger(parseInt(planet[cName])) == true){
                planet[cName] = planet[cName].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' km'}
            }else if(cName == 'surface_water'){
                if(Number.isInteger(parseInt(planet[cName])) == true)
                {planet.surface_water = planet.surface_water + "%";}
            }else if (cName == 'population'){
                if(Number.isInteger(parseInt(planet[cName])) == true){
                planet[cName] = planet[cName].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")+' people';
                }
            }
        })
        return planet
    },

    loadArrayData: function(array, callback, checkParameter){
        if(requestNr != checkParameter){
            return;
        }
        itemsToLoad = array.length;
        if(loadedItems < itemsToLoad){
            if(loadingState == 0){
                xhttp.open("GET", array[loadedItems], true);
                xhttp.send();
            }
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    loadingState = 0;
                    loadedItems++;
                    if(requestNr == checkParameter){
                        callback(JSON.parse(xhttp.responseText))
                    }
                }
            };
            loadingState = 1;
            setTimeout(() => {dataManager.loadArrayData(array, callback, checkParameter)}, 300);
        }else{
        loadingState = 0;
        loadedItems = 0;
        return
        }
    }
}