using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using WebApplication1.Caching;
using WebApplication1.Model;
using WebApplication1.Services;
using Newtonsoft.Json;

namespace WebApplication1.Controllers
{
    [ApiController]
    [Route("api/v1/cerveja")]
    public class CervejaController : ControllerBase
    {
        private readonly CervejaService _cervejaService;
        private readonly ICachingService _cache;
        private readonly ILogger<CervejaController> _logger;

        public CervejaController(CervejaService cervejaService, ICachingService cache, ILogger<CervejaController> logger)
        {
            _cervejaService = cervejaService;
            _cache = cache;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cacheKey = "Cerveja:All";
            var cervejas = await _cache.GetAsync<List<Cerveja>>(cacheKey);
            if (cervejas != null)
            {
                _logger.LogInformation("(GetAll) Returning cervejas from cache.");
                return Ok(cervejas);
            }

            List<Cerveja> listCervejas = await _cervejaService.GetAll();
            await _cache.SetAsync(cacheKey, listCervejas);
            _logger.LogInformation("(GetAll) Cervejas not found in cache, fetching from database and adding to cache.");

            return Ok(listCervejas);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var cacheKey = $"Cerveja:{id}";
            var cervejaCache = await _cache.GetAsync<Cerveja>(cacheKey);

            if(cervejaCache != null)
            {
                _logger.LogInformation($"(GetById) Returning cerveja with id {id} from cache.");
                return Ok(cervejaCache);
            }

            Cerveja? cerveja;
            cerveja = await _cervejaService.GetById(id);

            if (cerveja == null)
            {
                return NotFound();
            }
            await _cache.SetAsync(cacheKey, cerveja);
            _logger.LogInformation($"(GetById) Cerveja with id {id} not found in cache, fetching from database and adding to cache.");
            return Ok(cerveja);
        }

        [HttpGet("marca")]
        public async Task<IActionResult> GetByMarcaContains([FromQuery] string marca)
        {
            var cacheKey = $"Cerveja:All";
            var allCervejasCache = await _cache.GetAsync<List<Cerveja>>(cacheKey);
            if(allCervejasCache != null)
            {
                _logger.LogInformation($"(GetByMarcaContains) Returning cervejas with marca containing '{marca}' from cache.");
                return Ok(allCervejasCache.Where(c => c.marca.Contains(marca, StringComparison.OrdinalIgnoreCase)).ToList());
            }

            var cervejas = await _cervejaService.GetByMarcaContains(marca);
            _logger.LogInformation($"(GetByMarcaContains) Cervejas with marca containing '{marca}' not found in cache, fetching " +
                $"from database.");
            return Ok(cervejas);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Cerveja cerveja)
        {
            if (cerveja == null)
            {
                return BadRequest("Cerveja cannot be null");
            }

            var created = await _cervejaService.Create(cerveja);

            await _cache.RemoveAsync("Cerveja:All");
            await _cache.SetAsync($"Cerveja:{created.id}", created);
            _logger.LogInformation($"(Create) Cerveja with id {created.id} created and added to cache.");

            var id = created.id;
            return CreatedAtAction(nameof(GetById), new { id }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var cerveja = await _cervejaService.GetById(id);
            if (cerveja == null)
            {
                return NotFound();
            }
            await _cervejaService.Delete(id); 
            await _cache.RemoveAsync($"Cerveja:{id}");
            await _cache.RemoveAsync("Cerveja:All");
            _logger.LogInformation($"(Delete) Cerveja with id {id} deleted and removed from cache.");

            return NoContent(); 
        }
    }
}
