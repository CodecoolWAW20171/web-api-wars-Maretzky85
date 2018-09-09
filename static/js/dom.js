let dom = {
    init: function (){
        dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable);
        
        let navbar = document.getElementById('navbar');
        navbar.removeAttribute('style');
        
        let planetListButton = document.getElementById('planetList');
        planetListButton.addEventListener('click', function(e){
            try {
                let msgBox = document.getElementById('msgBox');
                msgBox.innerHTML = "<h4>Please wait, loading data...</h4>"
            } catch (TypeError) {
                let msgBox = document.getElementById('content');
                msgBox.innerHTML = '<h1>Loading Data</h1>'
            }
            dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable)
        });

        let regButton = document.getElementById('registerButton')
        regButton.addEventListener('click', function(e){
            dataManager.getData('/registration', dom.showRegisterModal);
            
        })
    },

    showDataInTable: function(ObjectData) {
        
        let contentTable = document.getElementById('content');
        //clear present content 
        contentTable.innerHTML = '';
        
        //create and append prev/next buttons
        let buttonsDiv = dataManager.createButtons(ObjectData.previous, ObjectData.next);
        contentTable.appendChild(buttonsDiv);
        
        //create table element
        let table = document.createElement('table');
        table.classList.add('table')
        table.id = 'planetTable'
        
        //create headers and append to table
        let header = dataManager.createTableHeader(dataManager.tableFullNames);
        table.appendChild(header);
        
        contentTable.appendChild(table);
        //extract planet objects from results
        let planets = ObjectData.results;

        //for each entry create a row filled with data
        planets.forEach(planet => {
            let planetTable = document.getElementById('planetTable');
            //format data to display
            planet = dataManager.planetDataFormatter(JSON.stringify(planet));
            
            //create data-row
            let row = dataManager.createTableRow(dataManager.tableClasses);
            
            //enter data for each column
            dataManager.tableClasses.forEach(colName => {
                //for each column name(selected by class name in target row)
                
                let targetCol = row.querySelector('.'+colName);
                //if target column is residents display button, or text info
                if(colName == 'residents'){
                    if(planet.residents.length > 0){
                        //create resident button for planet
                        let btn = dataManager.createResidentButton(planet);
                        targetCol.appendChild(btn);}
                    else{
                        targetCol.innerText = 'No known residents'
                    }
                //other data display normal
                }else{
                targetCol.innerText = planet[colName];

                //append row to table
                planetTable.appendChild(row);}
            });
        let navbar = document.getElementById('navbar');
        navbar.removeAttribute('style');
        })
    },

    prepareModalWindow: function(planetName){
        let modalTitle = document.getElementById('ModalTitle');
        modalTitle.innerHTML = "Residents of "+planetName;
        
        let modalMsgBox = document.createElement('div');
        modalMsgBox.id = 'modalMsgBox';
        modalMsgBox.innerHTML = 'Loading data...';

        modalTitle.appendChild(modalMsgBox);
        
        let modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = '';

        let saveButton = document.getElementById('saveButton');
        saveButton.style.display = 'none'
    },

    drawTableInModal: function(){
        let modalBody = document.getElementById('modalBody');
        let modalTable = document.createElement('table');
        modalTable.id = 'modalTable';
        modalTable.classList.add('table');
        modalTable.style.opacity = 0;

        let tableHeader = dataManager.createTableHeader(dataManager.residentDetails)
        modalTable.appendChild(tableHeader);
        
        let modalTableBody = document.createElement('tbody');
        modalTableBody.id = 'modalTableBody';
        
        modalTable.appendChild(modalTableBody);
        modalBody.appendChild(modalTable);
    },

    showContentInModal: function(contentToAdd){
        if(document.getElementById('modalBody').children.length < 1){
            dom.drawTableInModal();
            dom.fadeIn('modalTable');
        }
        let modalMsgBox = document.getElementById('modalMsgBox');
        modalMsgBox.innerHTML = "Loaded "+ loadedItems + " of " + itemsToLoad + " residents";
        
        if(loadedItems == itemsToLoad){
            setTimeout(() => {modalMsgBox.innerHTML = "All data loaded";}, 1000);
            setTimeout(() => {dom.fadeOut('modalMsgBox')}, 2000);
            setTimeout(() => {dom.slowClose('modalMsgBox')},2200);
        };

        let modalTableBody = document.getElementById('modalTableBody');
        
        let row = dataManager.createTableRow(dataManager.residentDetails);
        
        dataManager.residentDetails.forEach(className => {
            className = className.toLocaleLowerCase().replace(' ',"_")
            
            let targetCol = row.querySelector('.'+className);
            targetCol.innerText = contentToAdd[className]
        });
        
        modalTableBody.appendChild(row);
    },

    slowClose: function(target){
        var fadeTarget = document.getElementById(target);
        var fadeEffect = setInterval(function () {
            if (!fadeTarget.style.height) {
                fadeTarget.style.height = fadeTarget.clientHeight+'px';
                fadeTarget.dataset.height = fadeTarget.clientHeight;
            }
            if (fadeTarget.dataset.height > 0) {
                fadeTarget.dataset.height -= 2;
                fadeTarget.style.height = fadeTarget.dataset.height + 'px';
            } else {
                clearInterval(fadeEffect);
            }
        }, 25);
    },

    fadeOut: function(fadeTarget) {
        var fadeTarget = document.getElementById(fadeTarget);
        var fadeEffect = setInterval(function () {
            if (!fadeTarget.style.opacity) {
                fadeTarget.style.opacity = 1;
            }
            if (fadeTarget.style.opacity > 0) {
                fadeTarget.style.opacity -= 0.1;
            } else {
                clearInterval(fadeEffect);
            }
        }, 25);
    },

    fadeIn: function(fadeTarget) {
        var fadeTarget = document.getElementById(fadeTarget);
        var fadeEffect = setInterval(function () {
            if (!fadeTarget.style.opacity) {
                console.log('opacity set to 0')
                fadeTarget.style.opacity = 0;
            }
            if (fadeTarget.style.opacity < 1) {
                let opacity = parseFloat(fadeTarget.style.opacity)
                fadeTarget.style.opacity = (0.1 + opacity);
            } else {
                clearInterval(fadeEffect);
            }
        }, 25);
    },

    showErrorMsg: function(){
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
    },
    
    showRegisterModal: function(content){
        let modalTitle = document.getElementById('ModalTitle');
        modalTitle.innerHTML = "<h4>Registration</h4>";
        let modalContent = document.getElementById('modalBody');
        modalContent.innerHTML = content;
        let saveButton = document.getElementById('saveButton')
        saveButton.style.display = '';
        $('#exampleModalLong').modal();

    },

}