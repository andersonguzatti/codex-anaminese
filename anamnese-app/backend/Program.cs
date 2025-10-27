using Anamnese.Api.Data;
using Anamnese.Api.DTOs;
using Anamnese.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
});

builder.Services.AddDbContext<AppDbContext>(options =>
{
    var cs = builder.Configuration.GetConnectionString("Default")
             ?? "Host=hpserver;Port=5432;Database=mbGestordb;Username=postgres;Password=2308;";
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

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

var api = app.MapGroup("/api");

api.MapGet("/healthz", () => Results.Ok(new { status = "ok" }));

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

// Create intake (client + anamnesis + signature)
api.MapPost("/intakes", async (CreateIntakeRequest req, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(req.Client.FullName))
        return Results.BadRequest(new { error = "FullName is required" });
    if (string.IsNullOrWhiteSpace(req.SignatureDataUrl))
        return Results.BadRequest(new { error = "Signature is required" });

    var client = new Client
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

app.Run();
