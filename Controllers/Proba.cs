using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ServiceStack.Redis;
using ServiceStack.Text;
using StackExchange.Redis;

namespace RedisApi.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class Proba : ControllerBase
    {
        readonly RedisClient redis = new RedisClient("localhost:6379");
        private static ConnectionMultiplexer _redis = ConnectionMultiplexer.Connect("localhost:6379");


        [Route("VratiSobe")]
        [HttpGet]
        public List<Room> VratiSobe()
        {
            List<Room> roomlist = new List<Room>();
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room v = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                roomlist.Add(v);
            }
            return roomlist;
        }

        [Route("Upis/{ime}/{broj}")]
        [HttpPost]
        public IActionResult Upis(string ime, string broj)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room v = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                if(v.Name==ime)
                {
                    return BadRequest();
                }
            }
            Room room = new Room(ime, broj);
            room.PlayList.Add("S3Dpfyc15qQ");
            redis.PushItemToList("rooms", room.ToJsonString());
            return Ok();
        }

        [Route("Izmeni/{ime}")]
        [HttpPut]
        public IActionResult Izmeni(string ime)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room v = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                if (v.Name == ime)
                {
                    if (Convert.ToInt32(v.Number)<10)
                    {
                        v.Number = (Convert.ToInt32(v.Number) + 1).ToString();
                        byte[] byteString = Encoding.ASCII.GetBytes(jsonRoomsString);
                        redis.LRem("rooms", 1, byteString);
                        redis.PushItemToList("rooms", v.ToJsonString());

                        return Ok();
                    }
                    return BadRequest();
                }
            }
            return BadRequest();
        }

        [Route("Obrisi/{ime}")]
        [HttpDelete]
        public void Obrisi(string ime)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room v = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                if (v.Name == ime)
                {
                    v.Number = (Convert.ToInt32(v.Number) - 1).ToString();
                    byte[] byteString = Encoding.ASCII.GetBytes(jsonRoomsString);

                    if (v.Number == "0")
                    {
                        redis.LRem("rooms", 1, byteString);
                        redis.Del(ime);
                    }
                    else
                    {
                        redis.LRem("rooms", 1, byteString);
                        redis.PushItemToList("rooms", v.ToJsonString());
                    }
                }
            }
        }

        [Route("ChatSub/{ime_sobe}")]
        [HttpGet]
        public string ChatSub(string ime_sobe)
        {
            var pubsub = _redis.GetSubscriber();

            pubsub.SubscribeAsync(ime_sobe, (channel, message) =>
            {
                redis.Set<string>(ime_sobe, message);
            });

            return redis.Get<string>(ime_sobe);
        }


        [Route("ChatPub/{ime_sobe}/{poruka}/{user}")]
        public void ChatPub(string ime_sobe,string poruka,string user)
        {
            var pubsub = _redis.GetSubscriber();
            pubsub.Publish(ime_sobe, user+poruka);
        }

        [Route("SetUser/{ime_sobe}")]
        [HttpGet]
        public User SetUser(string ime_sobe)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room v = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                if (v.Name == ime_sobe)
                {
                    User user = new User("User_" + v.Number.ToString() + ":", ime_sobe + "_User_" + v.Number.ToString() + ":");
                    return user;
                }
            }
            return null;
        }

        [Route("AddSong/{song}/{ime_sobe}")]
        [HttpPost]
        public void AddSong(string song,string ime_sobe)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room u = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
                if(u.Name==ime_sobe)
                {
                    byte[] byteString = Encoding.ASCII.GetBytes(jsonRoomsString);
                    redis.LRem("rooms", 1, byteString);
                    u.PlayList.Add(song);
                    redis.PushItemToList("rooms", u.ToJsonString());
                    break;
                }
            }     
        }

        [Route("GetSong/{ime_sobe}/{br_pesme}")]
        [HttpGet]
        public string GetSong(string ime_sobe,int br_pesme)
        {
            foreach (string jsonRoomsString in redis.GetRangeFromList("rooms", 0, 100))
            {
                Room room = (Room)JsonSerializer.DeserializeFromString(jsonRoomsString, typeof(Room));
               
                if (room.PlayList.Count != 0 && room.PlayList.Count > br_pesme)
                 return room.PlayList[br_pesme];
                    
                
            }
            return "Nema pesama";
        }
    }
}
