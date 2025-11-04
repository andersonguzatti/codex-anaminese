namespace Anamnese.Api.DTOs;

public record ClientInput(
    string FullName,
    DateOnly? BirthDate,
    string? Sex,
    string? MaritalStatus,
    string? AddressStreet,
    string? AddressNumber,
    string? Neighborhood,
    string? City,
    string? PostalCode,
    string? Email,
    string? Profession,
    string? HomePhone,
    string? MobilePhone
);

public record AnamnesisInput(
    DateOnly? FormDate,
    string? AreaToBeRemoved,

    bool? HasAllergies,
    string? AllergiesDetails,

    bool? IsPregnant,

    bool? IsBreastFeeding,
    string? BreastFeedingDuration,

    bool? InCancerTreatment,
    bool? IsExOncologicPatient,
    string? ExOncologicStoppedWhen,

    bool? HasDiabetes,
    bool? DiabetesControlled,

    bool? HasHansenDisease,
    bool? HasEpilepsy,
    bool? HasHemophilia,
    bool? HasHepatitis,

    bool? HasHypertension,
    bool? BloodPressureControlled,

    bool? UsedIsotretinoinLast6Months,

    bool? HasGlaucoma,
    bool? HasHerpes,
    bool? HasHiv,
    bool? HasLupus,
    bool? HasPsoriasis,
    bool? HasVitiligo,
    bool? HasThrombosis,
    bool? HasPacemaker,

    bool? HasDermatitisAtArea,
    bool? HasRosacea,
    bool? HasCirculatoryProblems,
    bool? HasRespiratoryProblems,
    string? RespiratoryProblemsDetails,
    bool? HasHormonalProblems,
    string? HormonalProblemsDetails,
    bool? HasKeloidTendency,
    bool? UsesAcidCream,
    bool? UsedInjectableLast30DaysInArea,
    bool? IsSmoker,
    bool? UsesHormoneOrSteroidTherapy,
    bool? UsesRegularMedication,
    string? RegularMedicationDetails,
    bool? DrinksTwoLitersWaterDaily,
    string? WaterIntakeQuantity,
    bool? DoesPhysicalExercise,
    string? ExerciseFrequency,
    bool? UsesSunscreenDaily,

    string? Notes,
    string? SignatureCity
);

public record CreateIntakeRequest(
    ClientInput Client,
    AnamnesisInput Anamnesis,
    string SignatureDataUrl,
    Guid? ClientId
);

public record CreateIntakeResponse(
    Guid ClientId,
    Guid AnamnesisId
);
