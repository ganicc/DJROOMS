import {Room} from "./Room.js" 
import {User} from "./User.js" 


let ime_sobe=sessionStorage.getItem('ime');

let predhodna_rec="";
let user=new User("null",ime_sobe);

let DivVideoPlayList=document.createElement("div");
DivVideoPlayList.className="divVideoPlayList";
document.body.appendChild(DivVideoPlayList);


let DivVideo=document.createElement("div");
DivVideo.className="divVideo";
DivVideoPlayList.appendChild(DivVideo);

let DivPlayList=document.createElement("div");
DivPlayList.className="divPlayList";
DivVideoPlayList.appendChild(DivPlayList);

let DivChat=document.createElement("div");
DivChat.className="divChat";
document.body.appendChild(DivChat);

let ChatInput=document.createElement("input");
ChatInput.className="chatInput";
DivChat.appendChild(ChatInput);

let SendButton=document.createElement("button");
SendButton.innerHTML="Send";
SendButton.className="sendbutton";
DivChat.appendChild(SendButton);

let MessageDiv=document.createElement("div");
MessageDiv.className="messageDiv";
DivChat.appendChild(MessageDiv);


let UrlInput=document.createElement("input");
UrlInput.className="urlinput";
DivPlayList.appendChild(UrlInput);

let AddSong=document.createElement("button");
AddSong.className="addsong";
AddSong.innerHTML="Add Song";
DivPlayList.appendChild(AddSong);

let DivZaUrl=document.createElement("div");
DivZaUrl.className="divzaurl";
DivPlayList.appendChild(DivZaUrl);

let provera_dali_ima_pesme=true;


let player;

AddSong.onclick=(ev)=>{
  console.log(provera_dali_ima_pesme);
  user.AddSong(UrlInput.value.slice(32));
  alert("Song is added");

  let UrlLabel=document.createElement("label");
  UrlLabel.innerHTML=UrlInput.value;
  UrlLabel.className="urllabel";
  DivZaUrl.appendChild(UrlLabel);

  if(provera_dali_ima_pesme==false)
  {
    let pom=UrlInput.value.slice(32);
    UrlInput.value="";
    provera_dali_ima_pesme=true;
    player.loadVideoById({videoId:pom});
    player.target.playVideo();
  }
  UrlInput.value="";

}


fetch("https://localhost:44358/proba/setuser/"+ime_sobe).then(p=>{
            p.json().then(data=>{
                  user.SetName(data.name);
            });
        });


SendButton.onclick=(ev)=>{
  let Poruka=document.createElement("label");
  Poruka.className="poruka";
  Poruka.style.color="#ab20fd";
  Poruka.innerHTML=user.GetName() + ChatInput.value;
  MessageDiv.appendChild(Poruka); 
  predhodna_rec=user.GetName() + ChatInput.value;
  fetch("https://localhost:44358/proba/chatpub/"+ime_sobe+"/"+ChatInput.value+"/"+user.GetName(),{
    method:'POST'
  });
  ChatInput.value="";
}


setInterval(function() {fetch("https://localhost:44358/proba/chatsub/"+ime_sobe).then(function(body){
  return body.text(); 
}).then(function(data) {
  if(predhodna_rec!=data)
  {
  let Poruka2=document.createElement("label");
  Poruka2.className="poruka";
  Poruka2.innerHTML=data;
  MessageDiv.appendChild(Poruka2);
  predhodna_rec=data;
  }
});}, 2000); 

DivVideo.id="player";
const tag = document.createElement("script");
tag.id = "iframe-demo";
tag.src = "https://www.youtube.com/iframe_api";
const [firstScriptTag] = document.getElementsByTagName("script");
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let i=0;


window.onYouTubeIframeAPIReady = () => {

  fetch("https://localhost:44358/proba/getsong/"+ime_sobe+"/"+i).then(function (body) {
    return body.text();
 }).then(function(data) {
    i++;
    player = new window.YT.Player("player", {
    videoId:data,
     events: {
        onReady: window.onPlayerReady,
        onStateChange: window.onPlayerStateChange
     }
  });
 });
};


window.onPlayerReady = (event) => {
   event.target.playVideo();
};

window.onPlayerStateChange = (event) => {
   if (event.data === 0) {
    fetch("https://localhost:44358/proba/getsong/"+ime_sobe+"/"+i).then(function (body) {
      return body.text();
   }).then(function(data) {

    if(data=="Nema pesama")
    provera_dali_ima_pesme=false;
    else
    {
    player.loadVideoById({videoId:data});
    player.target.playVideo();
    }
   });
   i++;
   }
};


window.addEventListener('beforeunload', function (e) {         
  
  e.preventDefault(); 
  fetch("https://localhost:44358/proba/obrisi/"+ime_sobe,{
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
     }); 

     e.returnValue=''; 
}); 