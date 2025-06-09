using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using WebApplication1.Caching;
using WebApplication1.Data;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:8080", "http://frontend")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<CervejariaDatabaseConfig>(
    builder.Configuration.GetSection("CervejariaDatabase"));
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var config = sp.GetRequiredService<IOptions<CervejariaDatabaseConfig>>().Value;
    return new MongoClient(config.ConnectionString);
});
builder.Services.AddScoped<CervejaService>();
builder.Services.AddStackExchangeRedisCache(options =>
{
    var config = builder.Configuration.GetSection("Redis");
    options.Configuration = config["Configuration"];
    options.InstanceName = config["InstanceName"];
});

builder.Services.AddScoped<ICachingService, CachingService>();

var app = builder.Build();

app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
