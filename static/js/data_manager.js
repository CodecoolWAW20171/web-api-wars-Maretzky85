let xhttp = new XMLHttpRequest();
let loadingState = 0;
let loadedItems = 0;
let requestNr = 0;
let itemsToLoad = 0;
let ongoingRegisterStatus = 0;
let session = 0;
let userName = '';
let clickedVoteButton = '';
let dataManager = {
    tableClasses: ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'],
    tableFullNames: ['Name', 'Diameter', 'Climate', 'Terrain', 'Surface Water Percentage', 'Population', 'Residents'],
    residentDetails: ['Name','Height', 'Mass', 'Skin color', 'Hair color', 'Eye color', 'Birth year', 'Gender'],
    sessionCall: function(){
        dataManager.getData("/session", dataManager.sessionResponseCheck);
    },
    sessionResponseCheck: function(response){
        if (response != "error"){
            session = 1;
            userName = response
            let loggedUserName = document.getElementById('loggedUserName');
            loggedUserName.style.display = '';
            loggedUserName.innerText = 'Logged as '+response;
        }
        dom.init();
    },

    getData: function(request, callback){
        try {
            let waitBox = document.getElementById('initialWaitBox');
            waitBox.innerHTML = '<br>waiting for response'
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
        colNames.forEach(name => {
            let col = document.createElement('th');
            col.innerText = name;
            headerRow.appendChild(col);
        });
        if(session == 1 && headerArray == dataManager.tableFullNames){
            let col = document.createElement('th');
            headerRow.appendChild(col);}
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
        if(session == 1 && tableClassArray == dataManager.tableClasses){
            let btnTd = document.createElement('td');
            let btn = document.createElement('button');
            btn.classList.add('btn');
            btn.classList.add('btn-outline-secondary')
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

    
    checkResponse: function(response){
        console.log('response: '+response);
    },
};
let register = {
    checkFormCorrectness: function(){
        ongoingRegisterStatus = 1;
        let registerMsgBox = document.getElementById('registerMsgBox');
        registerMsgBox.innerHTML = '';
        registerMsgBox.style.color = 'red';
        let RUserName = document.getElementById('userName');
        let psw = document.getElementById('psw');
        let pswR = document.getElementById('psw-r');
        if(psw.value != pswR.value){
            registerMsgBox.innerText = 'Password fields not match'
            ongoingRegisterStatus = 0;
            return
        };
        if(psw.value < 5){
            registerMsgBox.innerText = 'Password too short (min 5 signs)';
            ongoingRegisterStatus = 0;
            return
        }
        if(RUserName.value.length < 5){
            registerMsgBox.innerText = 'User name too short (min 5 signs)';
            ongoingRegisterStatus = 0;
            return
        };
        register.checkIfUsernameExistsSend(RUserName.value)
    },
    checkIfUsernameExistsSend: function(username){
        ongoingRegisterStatus = 0;
        dataManager.getData('/check_username/'+username, register.checkIfUsernameExistsRecive)
    },
    checkIfUsernameExistsRecive: function(response){
        if(response=='ok'){
            register.registerNewUser()
        }else{
            let registerMsgBox = document.getElementById('registerMsgBox');
            registerMsgBox.innerText = 'User name taken';
            ongoingRegisterStatus = 0;
            return
        }
    },
    registerNewUser: function(){
        let RUserName = document.getElementById('userName')
        let formObject = {
            userName: RUserName.value,
            password: psw.value,
        };
        dataManager.getData("/register_new_user/"+JSON.stringify(formObject), register.checkStatus)
    },
    checkStatus: function(response){
        let registerMsgBox = document.getElementById('registerMsgBox');
        if (response == 'ok'){
            registerMsgBox.style.color = 'green';
            registerMsgBox.innerText = 'Registered';
            setTimeout(()=>{
                $('#exampleModalLong').modal('hide');
                ongoingRegisterStatus = 0;
                let saveButton = document.getElementById('saveButton');
                saveButton.removeEventListener('click',dom.registerModalSaveFunction)
            },1500)
        }else{
            registerMsgBox.innerText = 'Something went wrong, please reload';
            ongoingRegisterStatus = 0;
        }
    },
};
let vote = {
    sendVote: function(planetName, planetId, userName){
        let msgBox = document.getElementById('msgBox')
        msgBox.innerHTML = '<h4>sending vote</h4>';
        clickedVoteButton.innerText = 'Sent'
        let voteData = {
            planetName: planetName,
            planetId: planetId,
            userName: userName
        };
        dataManager.getData('/add_vote/'+JSON.stringify(voteData), vote.checkStatus)
    },
    checkStatus: function(response){
        let msgBox = document.getElementById('msgBox')
        if(response == "Voted"){
            clickedVoteButton.classList.remove('btn-outline-secondary')
            clickedVoteButton.classList.add('btn-success')
            msgBox.style.color = 'green'
        }else{
            clickedVoteButton.classList.remove('btn-outline-secondary')
            clickedVoteButton.classList.add('btn-outline-warning')
        }
        msgBox.style.color = 'red';
        msgBox.innerHTML = '<h4>'+response+'</h4>';
        setTimeout(()=>{
            msgBox.style.color = '';
            msgBox.innerHTML = '';
        }, 3000)
    },
}