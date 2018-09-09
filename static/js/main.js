function init(){
    let mainDiv = document.getElementById('content');
    let loadingSign = document.getElementById('initialWaitBox')
    loadingSign.innerHTML = '<br>Please wait... <br><br>loading data';
    document.onreadystatechange = dom.init()

    let regButton = document.getElementById('registration')
    regButton.addEventListener('click',() => {
        let modalWindow = document.getElementById('modalBody');
        modalWindow.innerHTML = '';
        dataManager.getData('/registration', dom.showJsonHtmlInModal);
    })
}
init()