import {Room} from "./Room.js" 


let divNazivSobe=document.createElement("div");
divNazivSobe.className="divNazivSobe";
document.body.appendChild(divNazivSobe);

fetch("https://localhost:44358/proba/vratisobe").then(p=>{
    p.json().then(data=>{
        data.forEach(element => {
            let pom=new Room(element.name,element.number);
            pom.CrtajSobu(divSobe);
        });
    });
});

let ImeSobe=document.createElement("input");
ImeSobe.className="input";
divNazivSobe.appendChild(ImeSobe);

let DugmeImeSobe=document.createElement("button");
DugmeImeSobe.innerHTML="Add Room";
DugmeImeSobe.className="submit";
divNazivSobe.appendChild(DugmeImeSobe);

let divSobe=document.createElement("div");
divSobe.className="divZaSobe";
document.body.appendChild(divSobe);

DugmeImeSobe.onclick=(ev)=>{

    fetch("https://localhost:44358/proba/upis/"+ImeSobe.value+"/"+"0",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
       }).then(p=>{
           if(p.status!=200)
           {
               alert("Room with that name alredy exist");
               ImeSobe.value="";
           }
           else
           {
            let Soba=new Room(ImeSobe.value,"0");
            Soba.CrtajSobu(divSobe);
            ImeSobe.value=""; 
           }
       });  
}


