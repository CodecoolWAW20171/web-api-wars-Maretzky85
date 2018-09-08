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
        } catch (TypeError) {
            
        }
        xhttp.open("GET", request, true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(xhttp.responseText))
            };
            if (this.readyState == 4 && this.status != 200){
                dom.showErrorMsg();
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
                    dom.showErrorMsg();
                    }
            };
            loadingState = 1;
            setTimeout(() => {dataManager.loadArrayData(array, callback, checkParameter)}, 300);
        }else{
        loadingState = 0;
        loadedItems = 0;
        return
        }
    },

    createButtons: function(prevLink, nextlink){
        let buttons = document.createElement('div');
        buttons.classList.add('navigate');

        let prevButton = document.createElement('button');
        prevButton.classList.add('previousButton');
        prevButton.classList.add('btn');
        prevButton.classList.add('disabled');
        prevButton.innerText = "Previous";
        prevButton.dataset.link = prevLink;

        if(prevLink != null){
            prevButton.classList.add('btn-primary');
            prevButton.classList.remove('disabled');
            prevButton.addEventListener('click', function(e){
                dataManager.buttonEvent(this)
            });
        };
        buttons.appendChild(prevButton);

        let msgBox = document.createElement('div');
        msgBox.id = 'msgBox';
        buttons.appendChild(msgBox);

        let next = document.createElement('button');
        next.classList.add('nextButton');
        next.classList.add('btn');
        next.classList.add('disabled');
        next.innerText = "Next";
        next.dataset.link = nextlink;
        
        if(nextlink != null){
            next.classList.add('btn-primary');
            next.classList.remove('disabled');
            next.addEventListener('click', function(e){
                dataManager.buttonEvent(this)
            });
        };
        buttons.appendChild(next)
        return buttons
    },

    buttonEvent: function(targetButton){
        document.querySelector('.nextButton').classList.add('disabled');
        document.querySelector('.previousButton').classList.add('disabled');
        //show loading msg
        let messageBox = document.getElementById('msgBox');
        if(messageBox.children.length < 1){
            let loadingSign = document.createElement('h4');
            loadingSign.innerHTML = 'Please wait, loading data...';
            messageBox.appendChild(loadingSign);
            dataManager.getData(targetButton.dataset.link, dom.showDataInTable);}
    },

    createTableHeader: function(headerArray){
        let header = document.createElement('thead');
        header.classList.add('thead-dark')
        let headerRow = document.createElement('tr')
        let colNames = headerArray;
        //colNames.push('Vote');
        colNames.forEach(name => {
            let col = document.createElement('th');
            col.innerText = name;
            headerRow.appendChild(col);
        });
        header.appendChild(headerRow);
        return header

    },

    createTableRow: function(tableClassArray) {
        let colNames = tableClassArray;
        let row = document.createElement('tr');
        colNames.forEach(name => {
            name = name.toLowerCase().replace(' ','_');
            let col = document.createElement('td');
            col.classList.add(name);
            row.appendChild(col);
        })
        if(0==1){let btnTd = document.createElement('td');
        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.innerText = "vote";
        btnTd.appendChild(btn);
        row.appendChild(btnTd);}
        return row
        },

    createResidentButton: function(planet){
        let btn = document.createElement('button');
        btn.classList.add('btn');
        btn.classList.add('btn-outline-info');
        btn.dataset.toggle = 'modal';
        btn.dataset.target = "#exampleModalLong";
        btn.dataset.data = JSON.stringify(planet.residents);
        btn.innerText = planet.residents.length +' resident(s)';
        btn.addEventListener('click', function(e){
            requestNr++;
            loadedItems = 0;
            let planetName = e.target.parentNode.parentNode.firstChild.innerHTML;
            dom.prepareModalWindow(planetName),
            dataManager.loadArrayData(JSON.parse(btn.dataset.data), dom.showContentInModal, requestNr);
                            
        })
        return btn;
    },
}