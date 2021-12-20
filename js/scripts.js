$(document).ready(() => {
    const container = document.getElementById("container");
    let elementsExist = false;    
    const reg = new RegExp("^[0-9]*$");
    let body = document.getElementsByTagName("body")[0];
    let idInput = 0;
    let result = document.getElementById("result");
    result.hidden = true;

    $("#mainButton").click(() =>
    {    
        if(elementsExist) return
        
        elementsExist = true;
        let btn1 = document.createElement("button");
        btn1.innerHTML = "1. Change background color randomly at double click";
        btn1.className = "btn btn-warning";
        btn1.id = "btn1";        
        btn1.addEventListener("dblclick", handleClickBtn1);

        let btn2 = document.createElement("button");
        btn2.innerHTML = "2. Create input for numbers only";
        btn2.className = "btn btn-success";
        btn2.onclick = handleClickBtn2;
        
        container.appendChild(btn1);
        container.appendChild(btn2);
    });


    const handleClickBtn1 = () => {
        let randomColor = Math.floor(Math.random()*16777215).toString(16); 
        body.style.backgroundColor = `#${randomColor}`;        
    }

    const handleClickBtn2 = () => {        
        const br = document.createElement("br");
        let input = document.createElement("input"); 
        input.className = "form-control-sm";
        input.placeholder = "Numbers only"
        idInput++;
        input.id = `input${idInput}`;        
        input.onkeydown = (e) => numbersOnly(e);
        input.onblur = blurEvent;  
        container.appendChild(br);      
        container.appendChild(input);    
    } 

    const numbersOnly = ({key}) => {           
        if(reg.test(key)===false && key !== "Backspace") return false;
    }

    const blurEvent = () => {
        let sumaTotal = 0;
        for(let i = 1; i<=idInput; i++){
            let inputValue = $(`#input${i}`).val();
            if(inputValue)            
                sumaTotal += parseInt(inputValue);
        }
        if(result.hidden)
            result.hidden = false;                    
        result.innerText = `Total: ${sumaTotal}`;              
    }
    
});