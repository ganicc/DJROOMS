export class User
{
    constructor(ime,ime_sobe)
    {
        this.ime_sobe=ime_sobe;
        this.ime=ime;
    }

    GetName()
    {
        return this.ime;
    }
    SetName(ime)
    {
        this.ime=ime;
    }


   AddSong(song)
    {
        fetch("https://localhost:44358/proba/addsong/"+song+"/"+this.ime_sobe,{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }); 
    } 

}