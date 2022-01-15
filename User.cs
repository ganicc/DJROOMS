using ServiceStack.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace RedisApi
{
    public class User
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string RoomName { get; set; }

        public User(string name, string roomname)
        {
            this.Name = name;
            this.RoomName = roomname;
        }

        public string ToJsonString()
        {
            return JsonSerializer.SerializeToString<User>(this);
        }
    }
}
