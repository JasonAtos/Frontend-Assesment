$(document).ready(() => {
    const tbody = document.getElementById("tbody");
    const list = document.createDocumentFragment();
    const url = 'https://restcountries.com/v3.1/all';

    let options = {
        numberPerPage:5, //Cantidad de datos por pagina
        goBar:true, //Barra donde puedes digitar el numero de la pagina al que quiere ir
        pageCounter:true, //Contador de paginas, en cual estas, de cuantas paginas
    };

    let filterOptions = {
        el:'#searchBox' //Caja de texto para filtrar, puede ser una clase o un ID
    };

    fetch(url)
    .then( response => response.json())
    .then(data => { 
        data.sort(
            (a,b) => 
            a.altSpellings[a.altSpellings.length-1].
            localeCompare(b.altSpellings[b.altSpellings.length-1])
        );

        data.map(country => {
            let {altSpellings, capital, region, languages, population, flags:{png}} = country;

            let tr = document.createElement("tr");
            let tdNombre = document.createElement("td");
            let tdCapital = document.createElement("td");
            let tdRegion = document.createElement("td");
            let tdLanguages = document.createElement("td");
            let tdPopulation = document.createElement("td");
            let tdImage = document.createElement("td");
            
            let nombreOficial = altSpellings[altSpellings.length-1];
            
            tdNombre.innerHTML = `${nombreOficial}.`
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
            tr.appendChild(tdImage)            

            // tr.onclick = () => handleClick(nombreOficial);            

            list.appendChild(tr);            
        });
        tbody.appendChild(list);

        document.querySelectorAll(".myTable").forEach(e => {                              
            e.addEventListener("click", (e) => {                
                let oficialName = e.path[1].innerText.split(".")[0]; 
                console.log(oficialName);
                handleClick(oficialName);
            })
        }); 

        paginate.init('.myTable',options,filterOptions);    
    });   

    const handleClick = (nombreOficial) => {     
        fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${nombreOficial}`)
        .then(response => response.json())
        .then(data => {
            let message = data.extract_html ? data.extract_html : data.detail;            
            bootbox.alert(message)
        });
    }

});