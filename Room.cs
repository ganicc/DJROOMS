using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ServiceStack.Text;

namespace RedisApi
{
    public class Room
    {
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Number { get; set; }
        [DataMember]
        public List<string> PlayList { get; set; }
        public Room(string name, string number)
        {
            this.Name = name;
            this.Number = number;
            this.PlayList = new List<string>();
        }

        public string ToJsonString()
        {
            return JsonSerializer.SerializeToString<Room>(this);
        }
    }
}
