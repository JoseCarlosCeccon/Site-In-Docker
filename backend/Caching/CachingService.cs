using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace WebApplication1.Caching
{
    public class CachingService : ICachingService
    {
        private readonly IDistributedCache _cache;
        private readonly DistributedCacheEntryOptions _options;

        public CachingService(IDistributedCache cache)
        {
            _cache = cache;
            _options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10), 
                SlidingExpiration = TimeSpan.FromMinutes(5) 
            };
        }

        public async Task SetAsync<T>(string key, T value)
        {
            var json = JsonConvert.SerializeObject(value);
            await _cache.SetStringAsync(key, json, _options);
        }

        public async Task<T?> GetAsync<T>(string key)
        {
            var json = await _cache.GetStringAsync(key);
            if (string.IsNullOrWhiteSpace(json))
            {
                return default;
            }
            
            return JsonConvert.DeserializeObject<T>(json);
        }

        public async Task RemoveAsync(string key)
        {
            await _cache.RemoveAsync(key);
        }
    }
}
