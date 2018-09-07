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
        //create headers in table
        let header = dom.createRowContainer('headers');
        contentTable.appendChild(header);
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
                        btn.classList.add('btn')
                        btn.innerText = planet.residents.length +' resident(s)';
                        btn.dataset.data = planet.residents;
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
    createButtons: function(prevObject, nextObject){
        let buttons = document.createElement('div');
        buttons.classList.add('navigate');
        let prev = document.createElement('button');
        prev.classList.add('previousButton');
        prev.classList.add('btn');
        //prev.classList.add('btn-lg');
        prev.classList.add('btn-primary');
        prev.innerText = "previous";
        prev.classList.add('disabled');
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
        //next.classList.add('btn-lg');
        next.classList.add('btn-primary');
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

    createRowContainer: function(h=false) {
        let rowNames = dom.tableClasses.slice(0);
        if(h=='headers'){
            rowNames = dom.tableFullNames.slice(0);
            rowNames.push('Vote');
        };
        //create row div
        let row = document.createElement('div');
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
            btn.classList.add('btn')
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