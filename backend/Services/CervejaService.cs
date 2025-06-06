using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using WebApplication1.Data;
using WebApplication1.Model;

namespace WebApplication1.Services
{
    public class CervejaService
    {
        private readonly IMongoCollection<Cerveja> _cervejas;

        public CervejaService(IOptions<CervejariaDatabaseConfig> config, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(config.Value.DatabaseName);
            _cervejas = database.GetCollection<Cerveja>(config.Value.CervejaCollectionName);
        }

        public async Task<List<Cerveja>> GetAll()
        {
            return await _cervejas.Find(cerveja => true).ToListAsync();
        }

        public async Task<Cerveja?> GetById(string id)
        {
            return await _cervejas.Find(cerveja => cerveja.id == id).FirstOrDefaultAsync();
        }
        
        public async Task<List<Cerveja>> GetByMarcaContains(string marca)
        {
            var filter = Builders<Cerveja>.Filter.Regex(c => c.marca, new BsonRegularExpression(marca, "i"));
            return await _cervejas.Find(filter).ToListAsync();
        }

        public async Task<Cerveja> Create(Cerveja cerveja)
        {
            await _cervejas.InsertOneAsync(cerveja);
            return cerveja;
        }

        public async Task Delete(string id)
        {
            await _cervejas.DeleteOneAsync(cerveja => cerveja.id == id);
        }
    }
}
