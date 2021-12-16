$(document).ready(() => {
    const tbody = document.getElementById("tbody");
    const list = document.createDocumentFragment();
    const url = 'https://restcountries.com/v3.1/all';
    let globalData = [];
    let preventRepeat = [];    

    $("#bordersTable").hide();

    fetch(url)
    .then( response => response.json())
    .then(data => {
        data = SortData(data);
        globalData = data;                
        data.map(country => {

            let {name:{common}, capital, region, languages, population, flags:{png}} = country;

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
            tdLanguages.innerHTML = `${
                languages && Object.keys(languages).map(key => languages[key])
            }`;
            tdPopulation.innerHTML = `${population}`;
            tdImage.innerHTML = `<img src = ${png} width='100px' />`;

            tr.appendChild(tdNombre);
            tr.appendChild(tdCapital);
            tr.appendChild(tdRegion);
            tr.appendChild(tdLanguages);
            tr.appendChild(tdPopulation);
            tr.appendChild(tdImage);         

            // tr.onclick = () => handleClick(nombreOficial);
            list.appendChild(tr);            
        });

        tbody.appendChild(list);

        document.querySelectorAll(".myTable").forEach(e => {                              
            e.addEventListener("click", (e) => {                
                let oficialName = e.path[1].innerText.split(".")[0];                
                handleAlert(oficialName);
            })
        }); 

        
        let options = {
            numberPerPage:5,
            goBar:true, 
            pageCounter:true, 
        };

        let filterOptions = {
            el:'#searchBox'
        };

        paginate.init('.myTable',options,filterOptions);    
    });   

    const handleAlert = (nombreOficial, includeMap = false) => {     
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${nombreOficial}`)
        .then(response => response.json())
        .then(data => {
            let message = data.extract_html ? data.extract_html : data.detail;
            if(includeMap){                
                const {latitude, longitude} = countries.filter(f=>f.country === nombreOficial)[0];                
                if(latitude && longitude)
                    initMap(latitude, longitude);
            }                  
            bootbox.alert(message)
        });
    }

    const SortData = (data) => {
        return data.sort(
            (a,b) => 
            a.altSpellings[a.altSpellings.length-1].
            localeCompare(b.altSpellings[b.altSpellings.length-1])
        );
    }

    $("#btnAdd").click(() => {
        $("#bordersTable").show();  
        let count = 0;
        const tableBordersBody = document.getElementById("tableBordersBody");      
        let actualcountries = [];
        let localList = document.createDocumentFragment();        

        document.querySelectorAll(".myTable tr").forEach(e => { 
            let oficialName = e.innerText.split(".")[0];            
            let countryFounded = globalData.filter(f=> f.name.common === oficialName);                       
            if(countryFounded.length > 0)
                actualcountries.push(countryFounded[0]);                                     
        });
        
        if(preventRepeat.length === 0)
            preventRepeat = actualcountries;        
        else  if(JSON.stringify(preventRepeat) === JSON.stringify(actualcountries)) return
        
        actualcountries.map(country => {                             
            let {name:{common}, borders} = country;

            if(borders != undefined){                                  
                borders.forEach(border => {                                                         
                    let url = `https://restcountries.com/v3.1/alpha/${border}`;
                    fetch(url)
                    .then(response => response.json())
                    .then(data => {                                                                          
                        let {official} = data[0].translations.spa;                                            
                        let tr = createTrBorder(common, countries.filter(f=>f.alpha3 === border)[0].country, official);       
                        localList.appendChild(tr);                                              
                        count++;
                        if(count==borders.length){                            
                            tableBordersBody.appendChild(localList);
                            addClickEvent();
                        }
                    });   
                });
            }            
            else{
                let tr = createTrBorder(common, "No Borders", "--");            
                localList.appendChild(tr);
            }
        });
    });

    const createTrBorder = (common, border, official) => {
        let tr = document.createElement("tr"); 
        let tdCountry = document.createElement("td");                 
        let tdBorders = document.createElement("td");
        let tdNameSpanish = document.createElement("td");    

        tdCountry.innerText = `${common}.`;
        tdBorders.innerText = `${border}`;
        tdNameSpanish.innerText = `${official}`;

        tr.appendChild(tdCountry);
        tr.appendChild(tdBorders); 
        tr.appendChild(tdNameSpanish);

        return tr;
    }    

    const addClickEvent = () => {
        document.querySelectorAll(".tableBordersBody").forEach(e => {
            e.addEventListener("click", (event) => {                
                let name = event.path[1].innerText.split("\t")[1];                                
                if(name == "No Borders") return                        
                handleAlert(name, true);
            });
        });        
    }
       
    function initMap(lat, lng){                
        let map = new google.maps.Map(document.getElementById('map'),{
          zoom: 10,
          center: {lat, lng}
        });
    }

});