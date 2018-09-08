let xhttp = new XMLHttpRequest();
let loadingState = 0;
let loadedItems = 0;
let requestNr = 0;
let itemsToLoad = 0;
let dataManager = {
    tableClasses: ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'],
    tableFullNames: ['Name', 'Diameter', 'Climate', 'Terrain', 'Surface Water Percentage', 'Population', 'Residents'],
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
            };
            if (this.readyState == 4 && this.status != 200){
                try {
                    msgTarget = document.getElementById('initialWaitBox');
                    msgTarget.style.color = 'red';
                    msgTarget.innerHTML = 'Something went wrong, please reload';  
                } catch (TypeError) {
                    try {
                        let msgTarget = document.getElementById('msgBox')
                        msgTarget.innerHTML = 'Something went wrong, please reload';
                        msgTarget.style.color = 'red';
                        msgTarget = document.getElementById('modalMsgBox')
                        msgTarget.style.color = 'red';
                        msgTarget.innerHTML = 'Something went wrong, please reload';
                    } catch (TypeError) {
                        console.log('Other problem');
                        document.innerHTML = '<h1>Something went wrong, please reload</h1>'
                    }
                }
                }
        };
    },
    planetDataFormatter: function(planetObject){
        let planet = JSON.parse(planetObject);
        let classNames = dataManager.tableClasses;
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
                }if (this.readyState == 4 && this.status != 200){
                    try {
                        msgTarget = document.getElementById('initialWaitBox');
                        msgTarget.style.color = 'red';
                        msgTarget.innerHTML = 'Something went wrong, please reload';  
                    } catch (TypeError) {
                        try {
                            let msgTarget = document.getElementById('msgBox')
                            msgTarget.innerHTML = 'Something went wrong, please reload';
                            msgTarget.style.color = 'red';
                            msgTarget = document.getElementById('modalMsgBox')
                            msgTarget.style.color = 'red';
                            msgTarget.innerHTML = 'Something went wrong, please reload';
                        } catch (TypeError) {
                            console.log('Other problem');
                            document.innerHTML = '<h1>Something went wrong, please reload</h1>'
                        }
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