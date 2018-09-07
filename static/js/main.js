function init(){
    let mainDiv = document.getElementById('content');
    let loadingSign = document.createElement('h2');
    loadingSign.innerHTML = 'Loading Data...';
    mainDiv.appendChild(loadingSign);
    document.onreadystatechange = dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable)
}
init()