let dom = {
    tableClasses: ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'],
    tableFullNames: ['Name', 'Diameter', 'Climate', 'Terrain', 'Surface Water Percentage', 'Population', 'Residents'],
    showDataInTable: function (ObjectData) {
        //clear present content 
        let contentTable = document.getElementById('content');
        contentTable.innerHTML = '';
        //create prev/next buttons
        let buttonsDiv = dom.createButtons(ObjectData.previous, ObjectData.next);
        contentTable.appendChild(buttonsDiv);
        //create table element
        let table = document.createElement('table');
        table.classList.add('table')
        //create headers in table
        let header = dom.createPlanetTableHeader();
        table.appendChild(header);
        //contentTable.appendChild(table);
        let planets = ObjectData.results;
        //for each entry create a row filled with data
        planets.forEach(planet => {
            planet = dataManager.planetDataFormatter(JSON.stringify(planet));
            //select target row
            let row = dom.createPlanetTableRow();
            //enter data for each column
            dom.tableClasses.forEach(colName => {
                //for each column name(selected by class name in target row)
                let targetCol = row.querySelector('.'+colName);
                //if target column is residents display button, or text info
                if(colName == 'residents'){
                    if(planet.residents.length > 0){
                        let btn = document.createElement('button');
                        btn.classList.add('btn');
                        btn.dataset.data = JSON.stringify(planet.residents);
                        btn.innerText = planet.residents.length +' resident(s)';
                        btn.addEventListener('click', function(e){
                            console.log(JSON.parse(btn.dataset.data))
                        })
                        targetCol.appendChild(btn);}
                    else{
                        targetCol.innerText = 'No known residents'
                    }
                //other data display normal
                }else{
                targetCol.innerText = planet[colName];
                table.appendChild(row);}
            });contentTable.appendChild(table);
        })
    },
    createButtons: function(prevObject, nextObject){
        let buttons = document.createElement('div');
        let prev = document.createElement('button');
        prev.classList.add('previousButton');
        prev.classList.add('btn');
        prev.classList.add('disabled');
        prev.innerText = "Previous";
        prev.dataset.link = prevObject;
        if(prevObject != null){
        prev.classList.remove('disabled');
        prev.addEventListener('click', function(e){
            dataManager.getData(this.dataset.link, dom.showDataInTable);
        });
        };
        buttons.appendChild(prev);

        let next = document.createElement('button');
        next.classList.add('nextButton');
        next.classList.add('btn');
        next.classList.add('disabled');
        next.innerText = "Next";
        next.dataset.link = nextObject;
        if(nextObject != null){
            next.classList.remove('disabled');
            next.addEventListener('click', function(e){
                dataManager.getData(this.dataset.link, dom.showDataInTable);
            });
        };
        buttons.appendChild(next)
        return buttons
    },
    createPlanetTableHeader: function(){
        let header = document.createElement('thead');
        let headerRow = document.createElement('tr')
        let colNames = dom.tableFullNames.slice(0);
        //colNames.push('Vote');
        colNames.forEach(name => {
            let col = document.createElement('th');
            col.innerText = name;
            headerRow.appendChild(col);
        });
        header.appendChild(headerRow);
        return header
    },
    createPlanetTableRow: function() {
        let colNames = dom.tableClasses.slice(0);
        let row = document.createElement('tr');
        colNames.forEach(name => {
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
        }
}