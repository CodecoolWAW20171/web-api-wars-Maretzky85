function init(){
    let mainDiv = document.getElementById('content');
    let loadingSign = document.getElementById('initialWaitBox')
    loadingSign.innerHTML = '<br>Please wait... <br><br>loading data';
    document.onreadystatechange = dom.init()
}
init()