
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication1.Model
{
    public class Cerveja
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? id { get; set; }
        [BsonElement("marca")]
        public string marca { get; set; }
        [BsonElement("tipo")]
        public string tipo { get; set; }
        [BsonElement("teorAlcoolico")]
        public double teorAlcoolico { get; set; }
        [BsonElement("descricao")]
        public string descricao { get; set; }
        [BsonElement("origem")]
        public string origem { get; set; }

    }
}
