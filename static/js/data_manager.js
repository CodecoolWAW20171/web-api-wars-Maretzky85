let xhttp = new XMLHttpRequest();
let loadingState = 0;
let loadedItems = 0;
let requestNr = '';
let dataManager = {
    residentDetails: ['name','height', 'mass', 'skin color', 'hair color', 'eye color', 'birth year', 'gender'],

    getData: function(request, callback){
        xhttp.open("GET", request, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(xhttp.responseText))
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
        let itemsToLoad = array.length;
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