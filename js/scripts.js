$(document).ready(() => {    
    let tbody = document.getElementById("tbody");
    let tr = [];
    const url = 'https://restcountries.com/v3.1/all';        
    let modal = document.getElementById("myModal");   
    let noData = document.getElementById("noData");
    noData.style.display = "none";
    let editable = document.getElementById("editable");
    editable.style.backgroundColor = "#ff0000";
    let favcolor = document.getElementById("favcolor");
    let span = document.getElementsByClassName("close")[0];    
    let searchInput = document.querySelector("#customSearch");
    let selectInput = document.querySelector("#customSelect");
    let globalData = [];
    let inputSearch = "";
    let selectedColumn = "-1"; 
    

    fetch(url)
    .then( response => response.json())
    .then(data => {
        getTableColumns();
        if(!data) noData.style.display = "block";
        data = sortAsc(data);
        globalData = data;
        displayData(data);
 
    });
    
    const displayData = (data) => {            
        const list = document.createDocumentFragment();

        data.map(country => {
            let {name:{common}, capital, region, population, flags:{png}} = country;

            let tr = document.createElement("tr");
            let tdNombre = document.createElement("td");
            let tdCapital = document.createElement("td");
            let tdRegion = document.createElement("td");
            let tdLanguages = document.createElement("td");
            let tdPopulation = document.createElement("td");
            let tdImage = document.createElement("td");
            
            tdNombre.innerHTML = `${common}.`
            tdCapital.innerHTML = `${capital}`;
            tdRegion.innerHTML = `${region}`;
            tdLanguages.innerHTML = "<a href='#'>View languajes</a>";
            tdPopulation.innerHTML = `${population}`;
            tdImage.innerHTML = `<img src = ${png} width='100px' />`;

            tr.appendChild(tdNombre);
            tr.appendChild(tdCapital);
            tr.appendChild(tdRegion);
            tr.appendChild(tdLanguages);
            tr.appendChild(tdPopulation);
            tr.appendChild(tdImage)            

            // tr.onclick = () => handleClick(nombreOficial);            

            list.appendChild(tr);            
        });    
                       
        tbody.appendChild(list);                               

        document.querySelectorAll(".myTable").forEach(e => {                              
            e.addEventListener("click", (e) => {                
                let oficialName = e.path[1].innerText.split(".")[0];                 
                if(oficialName === "View languajes")
                    languajesModal(e, data);                                   
                else              
                    handleClick(oficialName);
            })
        }); 
                
        tr = tbody.getElementsByTagName("tr");        
    };

    const handleClick = (nombreOficial) => {     
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${nombreOficial}`)
        .then(response => response.json())
        .then(data => {
            let message = data.extract_html ? data.extract_html : data.detail;            
            bootbox.alert(message)
        });
    }

    const languajesModal = (e, data) => {        
        let countryName = e.path[2].innerText.split(".")[0];
        let {languages} = data.filter(f=>f.name.common == countryName)[0];                                                        
        const relleno = document.getElementById("modalRelleno");
        relleno.innerHTML = "";                    
        let ul = document.createElement("ul");
        if(languages === undefined)
            languages = {"No":"There's no languages"}
        let languagesArray = [];     
        Object.values(languages).map(value => languagesArray.push(value));
        languagesArray.sort((a,b) => a.localeCompare(b));
        languagesArray.forEach(language => {
            let li = document.createElement("li");
            li.innerText = language
            ul.appendChild(li); 
        });        
        relleno.appendChild(ul);
        modal.style.display = "block";
    }

    const sortAsc = (data) => {        
        return data.sort(
            (a,b) => a.name.common.localeCompare(b.name.common)
        );
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }

    searchInput.addEventListener('keyup', (e) => {            
        inputSearch = $("#customSearch").val().toLowerCase();        
        if(inputSearch.length < 3) return  
        let countContries = 0;        
        for(let i = 0; i<tr.length; i++){
            let td = selectedColumn == -1 ? 
            tr[i] : tr[i].getElementsByTagName("td")[selectedColumn];
                       
            if(td){
                let txtValue = td.textContent || td.innerText;
                let countriesFounded = txtValue.toLowerCase().indexOf(inputSearch);
                if(countriesFounded > -1){
                    tr[i].style.display = "";
                    countContries++;                    
                }                                                    
                else  {
                   tr[i].style.display = "none";                   
                   countContries--;
                }                  
                                                                  
            }            
        }   
        
        noData.style.display = countContries === -250
        ? "block" : "none";
    });

    selectInput.addEventListener('change',(e) => {
        selectedColumn = $( "#customSelect option:selected" ).val();        
    });

    favcolor.addEventListener('change', (e) => {
        let selectecColor = $("#favcolor").val();
        editable.style.backgroundColor = selectecColor;        
    })
    
    const getTableColumns = () => {        
        const {children} = document.getElementsByClassName("table-dark")[0];        
        const {cells} = children[0];        
        for(let i = 0; i<cells.length; i++){            
            console.log(cells[i].innerText);         
        }
    }

});