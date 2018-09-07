let xhttp = new XMLHttpRequest();
let dataManager = {
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
    }
}