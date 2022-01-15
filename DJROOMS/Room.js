import {User} from "./User.js" 
export class Room
{
    constructor(ime,broj)
    {
        this.ime=ime;
        this.broj=broj;
    }

    CrtajSobu(Sobe)
    {
       let Soba=document.createElement("div");
       Soba.className="divSoba";
       Sobe.appendChild(Soba);

       let ImeSobe=document.createElement("label");
       ImeSobe.innerHTML=this.ime;
       ImeSobe.className="labela";
       Soba.appendChild(ImeSobe);

       let BrMesta=document.createElement("label");
       BrMesta.className="labela";
       BrMesta.innerHTML=this.broj+"/10";
       Soba.appendChild(BrMesta);

       let UdjiDugme=document.createElement("button");
       UdjiDugme.className="join";
       UdjiDugme.innerHTML="Join";
       Soba.appendChild(UdjiDugme);

       UdjiDugme.onclick=(ev)=>{

           fetch("https://localhost:44358/proba/izmeni/"+this.ime,{
            method: 'PUT',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
           }).then(p=>{
               if(p.status==200)
               {
                sessionStorage.setItem("ime",this.ime);
                window.open('room.html');
                setTimeout(pauza, 200);
                function pauza() {
                window.close();
                } 
               }
               else
               {
                   alert("Room is full try refresing the page");
               }
           });

       }
    }
}