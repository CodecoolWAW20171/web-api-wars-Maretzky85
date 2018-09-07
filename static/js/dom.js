let dom = {
    tableClasses: ['name', 'diameter', 'climate', 'terrain', 'surface_water', 'population', 'residents'],
    tableFullNames: ['Name', 'Diameter', 'Climate', 'Terrain', 'Surface Water Percentage', 'Population', 'Residents'],
    showDataInTable: function (ObjectData) {
        //clear present content 
        let contentTable = document.getElementById('content');
        contentTable.innerHTML = '';
        //create headers in table
        let header = dom.createRowContainer('headers');
        contentTable.appendChild(header)
        
        let planets = ObjectData.results;
        //for each entry create a row filled with data
        planets.forEach(planet => {
            planet = dataManager.planetDataFormatter(JSON.stringify(planet));
            //select target row
            let row = dom.createRowContainer();
            //enter data for each column
            dom.tableClasses.forEach(colName => {
                //for each column name(selected by class name in target row)
                let targetCol = row.querySelector('.'+colName);
                //if target column is residents display button, or text info
                if(colName == 'residents'){
                    if(planet.residents.length > 0){
                        let btn = document.createElement('button')
                        btn.innerText = planet.residents.length +' resident(s)';
                        targetCol.appendChild(btn);}
                    else{
                        targetCol.innerText = 'No known residents'
                    }
                //other data display normal
                }else{
                targetCol.innerText = planet[colName];
                contentTable.appendChild(row);}
            });
        })
    },
    createRowContainer: function(h=false) {
        let rowNames = dom.tableClasses;
        if(h=='headers'){
            rowNames = dom.tableFullNames;
            rowNames.push('Vote');
        };
        //create row div
        const row = document.createElement('div');
        //class to div
        row.classList.add('row');
        //add individual class to col and append to main row
        rowNames.forEach(name => {
            let col = document.createElement('div');
            col.classList.add('col');
            if(h=='headers'){
                col.innerText = name;
            }else {
                col.classList.add(name);
            }
            row.appendChild(col);
        });
        if(h==false){
            let vote = document.createElement('div');
            let btn = document.createElement('button')
            vote.classList.add('vote');
            vote.classList.add('col');
            btn.innerText = 'Vote';
            vote.appendChild(btn);
            //vote.innerText = 'vote';
            row.appendChild(vote);
        }
        return row
    },
    
}