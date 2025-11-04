using Anamnese.Api;
using Anamnese.Api.Data;
using Anamnese.Api.DTOs;
using Anamnese.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Localization;
using System.Globalization;
using Microsoft.AspNetCore.Routing;
using Anamnese.Api.Services;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Anamnese API",
        Version = "v1",
        Description = "Endpoints de Anamnese, Usuários, Perfis e Gestão de Acessos"
    });
});
builder.Services.AddLocalization(options => options.ResourcesPath = "Resources");

// System.Text.Json: avoid serialization cycles when returning EF graphs
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var cs = builder.Configuration.GetConnectionString("Default")
             ?? "Host=HPSERVER;Port=5432;Database=MBGestorDB;Username=anamnese_app;";

    if (!cs.Contains("Password=", StringComparison.OrdinalIgnoreCase))
    {
        var pwd = builder.Configuration["DB_PASSWORD"];
        if (!string.IsNullOrWhiteSpace(pwd))
            cs = cs.TrimEnd(';') + $";Password={pwd};";
    }

    options.UseNpgsql(cs);
});

var app = builder.Build();

// Ensure database exists (MVP). For production, prefer EF Core migrations.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var useMigrations = app.Configuration.GetValue<bool>("UseMigrations");
    try
    {
        if (useMigrations)
            db.Database.Migrate();
        else
            db.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Database initialization failed. The app will still start.");
    }
}

// Swagger UI (enable in all envs for now)
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();

// Localization configuration
var supportedCultures = new[] { "pt-BR", "en-US" };
var localizationOptions = new RequestLocalizationOptions
{
    DefaultRequestCulture = new RequestCulture("pt-BR"),
    SupportedCultures = supportedCultures.Select(c => new CultureInfo(c)).ToList(),
    SupportedUICultures = supportedCultures.Select(c => new CultureInfo(c)).ToList(),
};
// Allow query string and header to set culture
localizationOptions.RequestCultureProviders.Insert(0, new QueryStringRequestCultureProvider());
app.UseRequestLocalization(localizationOptions);

var api = app.MapGroup("/api");

api.MapGet("/healthz", () => Results.Ok(new { status = "ok" }));

// Example i18n endpoint that returns all resource strings for current culture
api.MapGet("/i18n", (IStringLocalizer<SharedResources> localizer) =>
{
    var strings = localizer
        .GetAllStrings(includeParentCultures: true)
        .ToDictionary(s => s.Name, s => s.Value);
    return Results.Ok(strings);
}).WithName("GetTranslations");

// Database connectivity health
api.MapGet("/healthz/db", async (AppDbContext db) =>
{
    try
    {
        await db.Database.OpenConnectionAsync();
        await db.Database.CloseConnectionAsync();
        return Results.Ok(new { ok = true });
    }
    catch (Exception ex)
    {
        return Results.Problem(ex.Message, statusCode: 500);
    }
});

// Create intake (client + anamnesis + signature). If ClientId is provided, update existing client and link.
api.MapPost("/intakes", async (CreateIntakeRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Client.FullName))
        return Results.BadRequest(new { error = "FullName is required" });
    if (string.IsNullOrWhiteSpace(req.SignatureDataUrl))
        return Results.BadRequest(new { error = "Signature is required" });
    Client client;
    if (req.ClientId.HasValue)
    {
        var existing = await db.Clients.FirstOrDefaultAsync(c => c.Id == req.ClientId.Value);
        if (existing is null)
            return Results.NotFound(new { error = "Client not found" });
        client = existing;
        // Update existing client with provided data
        client.FullName = req.Client.FullName.Trim();
        client.BirthDate = req.Client.BirthDate;
        client.Sex = req.Client.Sex;
        client.MaritalStatus = req.Client.MaritalStatus;
        client.AddressStreet = req.Client.AddressStreet;
        client.AddressNumber = req.Client.AddressNumber;
        client.Neighborhood = req.Client.Neighborhood;
        client.City = req.Client.City;
        client.PostalCode = req.Client.PostalCode;
        client.Email = req.Client.Email;
        client.Profession = req.Client.Profession;
        client.HomePhone = req.Client.HomePhone;
        client.MobilePhone = req.Client.MobilePhone;
        client.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync();
    }
    else
    {
        client = new Client
        {
            Id = Guid.NewGuid(),
            FullName = req.Client.FullName.Trim(),
            BirthDate = req.Client.BirthDate,
            Sex = req.Client.Sex,
            MaritalStatus = req.Client.MaritalStatus,
            AddressStreet = req.Client.AddressStreet,
            AddressNumber = req.Client.AddressNumber,
            Neighborhood = req.Client.Neighborhood,
            City = req.Client.City,
            PostalCode = req.Client.PostalCode,
            Email = req.Client.Email,
            Profession = req.Client.Profession,
            HomePhone = req.Client.HomePhone,
            MobilePhone = req.Client.MobilePhone,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await db.Clients.AddAsync(client);
        await db.SaveChangesAsync();
    }

    var anamnesis = new Anamnesis
    {
        Id = Guid.NewGuid(),
        ClientId = client.Id,
        FormDate = req.Anamnesis.FormDate,
        AreaToBeRemoved = req.Anamnesis.AreaToBeRemoved,

        HasAllergies = req.Anamnesis.HasAllergies,
        AllergiesDetails = req.Anamnesis.AllergiesDetails,

        IsPregnant = req.Anamnesis.IsPregnant,
        IsBreastFeeding = req.Anamnesis.IsBreastFeeding,
        BreastFeedingDuration = req.Anamnesis.BreastFeedingDuration,

        InCancerTreatment = req.Anamnesis.InCancerTreatment,
        IsExOncologicPatient = req.Anamnesis.IsExOncologicPatient,
        ExOncologicStoppedWhen = req.Anamnesis.ExOncologicStoppedWhen,

        HasDiabetes = req.Anamnesis.HasDiabetes,
        DiabetesControlled = req.Anamnesis.DiabetesControlled,

        HasHansenDisease = req.Anamnesis.HasHansenDisease,
        HasEpilepsy = req.Anamnesis.HasEpilepsy,
        HasHemophilia = req.Anamnesis.HasHemophilia,
        HasHepatitis = req.Anamnesis.HasHepatitis,

        HasHypertension = req.Anamnesis.HasHypertension,
        BloodPressureControlled = req.Anamnesis.BloodPressureControlled,

        UsedIsotretinoinLast6Months = req.Anamnesis.UsedIsotretinoinLast6Months,
        HasGlaucoma = req.Anamnesis.HasGlaucoma,
        HasHerpes = req.Anamnesis.HasHerpes,
        HasHiv = req.Anamnesis.HasHiv,
        HasLupus = req.Anamnesis.HasLupus,
        HasPsoriasis = req.Anamnesis.HasPsoriasis,
        HasVitiligo = req.Anamnesis.HasVitiligo,
        HasThrombosis = req.Anamnesis.HasThrombosis,
        HasPacemaker = req.Anamnesis.HasPacemaker,

        HasDermatitisAtArea = req.Anamnesis.HasDermatitisAtArea,
        HasRosacea = req.Anamnesis.HasRosacea,
        HasCirculatoryProblems = req.Anamnesis.HasCirculatoryProblems,
        HasRespiratoryProblems = req.Anamnesis.HasRespiratoryProblems,
        RespiratoryProblemsDetails = req.Anamnesis.RespiratoryProblemsDetails,
        HasHormonalProblems = req.Anamnesis.HasHormonalProblems,
        HormonalProblemsDetails = req.Anamnesis.HormonalProblemsDetails,
        HasKeloidTendency = req.Anamnesis.HasKeloidTendency,
        UsesAcidCream = req.Anamnesis.UsesAcidCream,
        UsedInjectableLast30DaysInArea = req.Anamnesis.UsedInjectableLast30DaysInArea,
        IsSmoker = req.Anamnesis.IsSmoker,
        UsesHormoneOrSteroidTherapy = req.Anamnesis.UsesHormoneOrSteroidTherapy,
        UsesRegularMedication = req.Anamnesis.UsesRegularMedication,
        RegularMedicationDetails = req.Anamnesis.RegularMedicationDetails,
        DrinksTwoLitersWaterDaily = req.Anamnesis.DrinksTwoLitersWaterDaily,
        WaterIntakeQuantity = req.Anamnesis.WaterIntakeQuantity,
        DoesPhysicalExercise = req.Anamnesis.DoesPhysicalExercise,
        ExerciseFrequency = req.Anamnesis.ExerciseFrequency,
        UsesSunscreenDaily = req.Anamnesis.UsesSunscreenDaily,

        Notes = req.Anamnesis.Notes,
        SignatureDataUrl = req.SignatureDataUrl,
        SignedAt = DateTime.UtcNow,
        SignatureCity = req.Anamnesis.SignatureCity,
        CreatedAt = DateTime.UtcNow
    };

    await db.Anamneses.AddAsync(anamnesis);
    await db.SaveChangesAsync();

    return Results.Created($"/api/anamneses/{anamnesis.Id}", new CreateIntakeResponse(client.Id, anamnesis.Id));
}).WithName("CreateIntake");

// Search clients by name (substring)
api.MapGet("/clients", async (string? q, int? take, AppDbContext db) =>
{
    var query = db.Clients.AsQueryable();
    if (!string.IsNullOrWhiteSpace(q))
    {
        var ql = q.Trim().ToLower();
        query = query.Where(c => c.FullName.ToLower().Contains(ql));
    }
    int t = Math.Clamp(take ?? 10, 1, 100);
    var list = await query
        .OrderBy(c => c.FullName)
        .Take(t)
        .Select(c => new
        {
            id = c.Id,
            fullName = c.FullName,
            birthDate = c.BirthDate,
            sex = c.Sex,
            maritalStatus = c.MaritalStatus,
            addressStreet = c.AddressStreet,
            addressNumber = c.AddressNumber,
            neighborhood = c.Neighborhood,
            city = c.City,
            postalCode = c.PostalCode,
            email = c.Email,
            profession = c.Profession,
            homePhone = c.HomePhone,
            mobilePhone = c.MobilePhone,
            lastAnamnesisAt = db.Anamneses
                .Where(a => a.ClientId == c.Id)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => a.CreatedAt)
                .FirstOrDefault()
        })
        .ToListAsync();
    return Results.Ok(list);
}).WithName("SearchClients");

api.MapGet("/clients/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var client = await db.Clients.FindAsync(id);
    return client is null ? Results.NotFound() : Results.Ok(client);
});

api.MapGet("/anamneses/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var anam = await db.Anamneses.Include(a => a.Client).FirstOrDefaultAsync(a => a.Id == id);
    return anam is null ? Results.NotFound() : Results.Ok(anam);
});

// List anamneses with optional client name filter
api.MapGet("/anamneses", async (
    string? q,
    int? skip,
    int? take,
    AppDbContext db) =>
{
    var query = db.Anamneses
        .Include(a => a.Client)
        .AsQueryable();

    if (!string.IsNullOrWhiteSpace(q))
    {
        var qLower = q.Trim().ToLower();
        query = query.Where(a => a.Client != null && a.Client.FullName.ToLower().Contains(qLower));
    }

    query = query.OrderByDescending(a => a.CreatedAt);

    int s = Math.Max(0, skip ?? 0);
    int t = Math.Clamp(take ?? 50, 1, 100);

    var items = await query.Skip(s).Take(t)
        .Select(a => new
        {
            id = a.Id,
            clientId = a.ClientId,
            clientName = a.Client != null ? a.Client.FullName : "",
            formDate = a.FormDate,
            createdAt = a.CreatedAt
        })
        .ToListAsync();

    return Results.Ok(items);
}).WithName("ListAnamneses");

// Simple current user helper (dev header based)
static async Task<Anamnese.Api.Models.User?> GetCurrentUser(HttpContext ctx, Anamnese.Api.Data.AppDbContext db)
{
    if (ctx.Request.Headers.TryGetValue("X-User-Id", out var h) && Guid.TryParse(h.ToString(), out var id))
    {
        return await db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.Id == id);
    }
    // fallback to admin
    return await db.Users.Include(u => u.Profile).FirstOrDefaultAsync(u => u.UserName == "admin");
}

// Me endpoint
api.MapGet("/users/me", async (HttpContext ctx, AppDbContext db) =>
{
    var me = await GetCurrentUser(ctx, db);
    if (me is null) return Results.NotFound();
    return Results.Ok(new
    {
        id = me.Id,
        userName = me.UserName,
        email = me.Email,
        isAdmin = me.IsAdmin,
        profile = new { fullName = me.Profile?.FullName, avatarUrl = me.Profile?.AvatarUrl, locale = me.Profile?.Locale }
    });
});

// Profile endpoints
api.MapGet("/profile", async (HttpContext ctx, AppDbContext db) =>
{
    var me = await GetCurrentUser(ctx, db);
    if (me is null) return Results.Unauthorized();
    var p = me.Profile;
    return Results.Ok(new { fullName = p?.FullName, avatarUrl = p?.AvatarUrl, locale = p?.Locale, email = me.Email });
});

api.MapPut("/profile", async (HttpContext ctx, AppDbContext db, Anamnese.Api.Models.UserProfile input) =>
{
    var me = await GetCurrentUser(ctx, db);
    if (me is null) return Results.Unauthorized();
    var prof = await db.UserProfiles.FirstOrDefaultAsync(x => x.UserId == me.Id);
    if (prof is null)
    {
        prof = new Anamnese.Api.Models.UserProfile { UserId = me.Id };
        db.UserProfiles.Add(prof);
    }
    prof.FullName = input.FullName;
    prof.AvatarUrl = input.AvatarUrl;
    prof.Locale = input.Locale;
    prof.UpdatedAt = DateTime.UtcNow;
    await db.SaveChangesAsync();
    return Results.Ok();
});

// Admin group with a simple filter
var admin = api.MapGroup("/admin");
admin.AddEndpointFilter(async (invocationContext, next) =>
{
    var ctx = invocationContext.HttpContext;
    var db = ctx.RequestServices.GetRequiredService<AppDbContext>();
    var me = await GetCurrentUser(ctx, db);
    if (me is null || !me.IsAdmin)
        return Results.StatusCode(403);
    return await next(invocationContext);
});

admin.MapGet("/roles", async (AppDbContext db) =>
{
    var roles = await db.Roles
        .Select(r => new
        {
            id = r.Id,
            name = r.Name,
            description = r.Description,
            users = r.UserRoles.Count,
            accesses = r.RoleAccesses.Count
        })
        .ToListAsync();
    return Results.Ok(roles);
});

admin.MapGet("/users", async (AppDbContext db) =>
{
    var users = await db.Users
        .Select(u => new { id = u.Id, userName = u.UserName, email = u.Email, isAdmin = u.IsAdmin })
        .ToListAsync();
    return Results.Ok(users);
});

admin.MapPost("/roles", async (AppDbContext db, RoleCreateRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Name)) return Results.BadRequest(new { error = "Name is required" });
    var role = new Role { Name = req.Name.Trim(), Description = req.Description };
    db.Roles.Add(role);
    await db.SaveChangesAsync();
    return Results.Created($"/api/admin/roles/{role.Id}", role);
});

admin.MapGet("/accesses", async (AppDbContext db) =>
{
    var list = await db.Accesses.OrderBy(a => a.RoutePattern).Select(a => new
    {
        id = a.Id,
        method = a.HttpMethod,
        route = a.RoutePattern,
        active = a.IsActive,
        name = a.DisplayName
    }).ToListAsync();
    return Results.Ok(list);
});

admin.MapGet("/roles/{roleId:guid}/users", async (Guid roleId, AppDbContext db) =>
{
    var users = await db.UserRoles.Where(ur => ur.RoleId == roleId)
        .Select(ur => new { id = ur.User.Id, userName = ur.User.UserName, email = ur.User.Email })
        .ToListAsync();
    return Results.Ok(users);
});

admin.MapPost("/roles/{roleId:guid}/users/{userId:guid}", async (Guid roleId, Guid userId, AppDbContext db) =>
{
    var exists = await db.UserRoles.AnyAsync(ur => ur.RoleId == roleId && ur.UserId == userId);
    if (!exists) db.UserRoles.Add(new UserRole { RoleId = roleId, UserId = userId });
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapDelete("/roles/{roleId:guid}/users/{userId:guid}", async (Guid roleId, Guid userId, AppDbContext db) =>
{
    var rel = await db.UserRoles.FirstOrDefaultAsync(ur => ur.RoleId == roleId && ur.UserId == userId);
    if (rel is not null) db.UserRoles.Remove(rel);
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapGet("/roles/{roleId:guid}/accesses", async (Guid roleId, AppDbContext db) =>
{
    var list = await db.RoleAccesses.Where(ra => ra.RoleId == roleId)
        .Select(ra => new { id = ra.Access.Id, method = ra.Access.HttpMethod, route = ra.Access.RoutePattern, active = ra.Access.IsActive })
        .ToListAsync();
    return Results.Ok(list);
});

admin.MapPost("/roles/{roleId:guid}/accesses/{accessId:guid}", async (Guid roleId, Guid accessId, AppDbContext db) =>
{
    var exists = await db.RoleAccesses.AnyAsync(ra => ra.RoleId == roleId && ra.AccessId == accessId);
    if (!exists) db.RoleAccesses.Add(new RoleAccess { RoleId = roleId, AccessId = accessId });
    await db.SaveChangesAsync();
    return Results.Ok();
});

admin.MapDelete("/roles/{roleId:guid}/accesses/{accessId:guid}", async (Guid roleId, Guid accessId, AppDbContext db) =>
{
    var rel = await db.RoleAccesses.FirstOrDefaultAsync(ra => ra.RoleId == roleId && ra.AccessId == accessId);
    if (rel is not null) db.RoleAccesses.Remove(rel);
    await db.SaveChangesAsync();
    return Results.Ok();
});

// Sync accesses and seed admin
await AccessSyncService.SyncAsync(app);

// Manual resync endpoint (admin only)
admin.MapPost("/accesses/resync", async (HttpContext ctx) =>
{
    await AccessSyncService.SyncAsync(ctx.RequestServices);
    return Results.Ok(new { ok = true });
});

app.Run();

public record RoleCreateRequest(string Name, string? Description);
