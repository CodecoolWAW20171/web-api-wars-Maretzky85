let dom = {
    init: function(){
        
        dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable, cached = true);
        
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
            dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable, cached = true)
        });

        let navRegButton = document.getElementById('navRegisterButton')
        navRegButton.addEventListener('click', function(e){
            dataManager.getData('/registration_page', dom.showRegisterModal);
            
        });
        
        let loginButton = document.getElementById('navSignInButton')
        loginButton.addEventListener('click', function(e){
            dataManager.getData('/login_page', dom.showLoginModal);
        });

        let logOutButton = document.getElementById('navLogoutButton');
        logOutButton.addEventListener('click', function(e){
            let msgBox = document.getElementById('msgBox');
            msgBox.innerHTML = '<h4>Logging out...</h4>';
            dataManager.getData('/logout', dom.checkLogout);
        });
        
        let navVoteStat = document.getElementById('navVoteDetails');
        navVoteStat.addEventListener('click', function(e){
            dataManager.getData('/vote_details', dom.showVoteDetailsModal);
        });

        
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
        table.id = 'planetTable';
        table.addEventListener('click', function(e){
            if(e.target.className == 'btn btn-outline-secondary'){
                let targetRow = e.target.parentNode.parentNode;
                let planetName = targetRow.firstChild.innerText;
                let planetId = targetRow.dataset.planetId;
                clickedVoteButton = e.target;
                vote.sendVote(planetName, planetId, userName);
            }
        })
        
        //create headers and append to table
        let header = dataManager.createTableHeader(dataManager.tableFullNames);
        table.appendChild(header);
        
        contentTable.appendChild(table);
        //extract planet objects from results
        let planets = ObjectData.results;

        //for each entry create a row filled with data
        planets.forEach(planet => {
            let planetId = planet.url.replace( /[^\d.]/g, '' ).replace(/\./g,'');
            let planetTable = document.getElementById('planetTable');
            //format data to display
            planet = dataManager.planetDataFormatter(JSON.stringify(planet));
            
            //create data-row
            let row = dataManager.createTableRow(dataManager.tableClasses);
            row.dataset.planetId = planetId
            
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
        modalTable.style.display = 'none'

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
        }
        let modalMsgBox = document.getElementById('modalMsgBox');
        modalMsgBox.innerHTML = "Loaded "+ loadedItems + " of " + itemsToLoad + " residents";
        
        if(loadedItems == itemsToLoad){
            setTimeout(() => {modalMsgBox.innerHTML = "All data loaded";
            document.getElementById('modalTable').style.display = '';
            dom.fadeIn('modalTable');}, 500);
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
        try {
            var fadeTarget = document.getElementById(target);
        } catch (TypeError) {
            return
        }
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
        try {
            var fadeTarget = document.getElementById(fadeTarget);    
        } catch (TypeError) {
            return
        }
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
        try {
            var fadeTarget = document.getElementById(fadeTarget);    
        } catch (TypeError) {
            return
        }
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
        }, 50);
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
        let registerMsgBox = document.createElement('div');
        registerMsgBox.id = 'registerMsgBox';
        modalTitle.appendChild(registerMsgBox);
        let modalContent = document.getElementById('modalBody');
        modalContent.innerHTML = content;

        let saveButton = document.getElementById('saveButton');
        saveButton.removeEventListener('click', dom.loginModalLoginFunction);
        saveButton.addEventListener('click', dom.registerModalSaveFunction);
        saveButton.innerText = 'Register';
        saveButton.style.display = '';
        
        $('#exampleModalLong').modal();
    },
    registerModalSaveFunction: function(){
        if(ongoingRegisterStatus == 0){
            ongoingRegisterStatus = 1;
            register.checkFormCorrectness()};
    },

    showLoginModal: function(content){
        let modalTitle = document.getElementById('ModalTitle');
        modalTitle.innerHTML = "<h4>Login</h4>";
        
        let loginMsgBox = document.createElement('div');
        loginMsgBox.id = 'loginMsgBox';
        modalTitle.appendChild(loginMsgBox);
        
        let modalContent = document.getElementById('modalBody');
        modalContent.innerHTML = content;
        
        let loginButton = document.getElementById('saveButton')
        loginButton.innerText = 'Login';
        loginButton.style.display = '';
        loginButton.removeEventListener('click', dom.registerModalSaveFunction);
        loginButton.addEventListener('click', dom.loginModalLoginFunction)
        
        $('#exampleModalLong').modal();
    },
    loginModalLoginFunction: function(){
        let login = document.getElementById('userName').value;
        let psw = document.getElementById('psw').value;
        let loginData = {
            login: login,
            password: psw
        }
        dataManager.getData("/login/"+JSON.stringify(loginData), dom.checkSuccessLogin)
    },
    
    checkSuccessLogin: function(response){
        let msgBox = document.getElementById('loginMsgBox');
        if(response != "Error"){
            msgBox.style.color = "green";
            msgBox.innerText = "Success"
            let navbarUserName = document.getElementById('loggedUserName');
            navbarUserName.style.display = '';
            navbarUserName.innerText = 'Signed in as '+document.getElementById('userName').value;
            setTimeout(()=>{
                $('#exampleModalLong').modal('hide')}, 1000
            );
            setTimeout(()=>{
                location.reload();
            }, 1200)
        }else{
            msgBox.style.color = "red";
            msgBox.innerText = "Error"
        }
    },
    checkLogout: function(response){
        if(response == 'logged out'){
        let msgBox = document.getElementById('msgBox');
        msgBox.innerHTML = '<h4>Logged out</h4>';}
        setTimeout(()=>{location.reload()}, 500)
    },
    showVoteDetailsModal: function(response){
        let primaryBtn = document.getElementById('saveButton')
        primaryBtn.style.display = 'none'
        let modalTitle = document.getElementById('ModalTitle');
        modalTitle.innerText = 'Voting Data';
        
        let modalBody = document.getElementById('modalBody');
        modalBody.innerHTML = ''
        
        let voteTable = document.createElement('table');
        voteTable.classList.add('table');
        let thead = document.createElement('thead');
        let trow = document.createElement('tr');
        let tcol1 = document.createElement('th');
        let tcol2 = document.createElement('th')
        tcol1.innerHTML = 'Planet Name';
        trow.appendChild(tcol1);
        tcol2.innerHTML = 'Vote Count';
        trow.appendChild(tcol2);
        thead.appendChild(trow);
        voteTable.appendChild(thead);

        let tbody = document.createElement('tbody');
        Object.entries(response).forEach(planetName =>{
            let row = document.createElement('tr');
            let col1 = document.createElement('td');
            let col2 = document.createElement('td');
            col1.innerText = planetName[0];
            row.appendChild(col1);
            col2.innerText = planetName[1];
            row.appendChild(col2);
            tbody.appendChild(row);
        });
        voteTable.appendChild(tbody);
        modalBody.appendChild(voteTable)
        $('#exampleModalLong').modal()
    }

}