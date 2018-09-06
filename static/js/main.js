function init(){
    document.onreadystatechange = dataManager.getData("https://swapi.co/api/planets/", dom.showDataInTable)
}
init()