namespace Anamnese.Api.Models;

public class Anamnesis
{
    public Guid Id { get; set; }
    public Guid ClientId { get; set; }
    public Client? Client { get; set; }

    // Dados do procedimento
    public DateOnly? FormDate { get; set; }
    public string? AreaToBeRemoved { get; set; }

    // Histórico do cliente — perguntas Sim/Não e campos de detalhe
    public bool? HasAllergies { get; set; }
    public string? AllergiesDetails { get; set; }

    public bool? IsPregnant { get; set; }

    public bool? IsBreastFeeding { get; set; }
    public string? BreastFeedingDuration { get; set; }

    public bool? InCancerTreatment { get; set; }
    public bool? IsExOncologicPatient { get; set; }
    public string? ExOncologicStoppedWhen { get; set; }

    public bool? HasDiabetes { get; set; }
    public bool? DiabetesControlled { get; set; }

    public bool? HasHansenDisease { get; set; }
    public bool? HasEpilepsy { get; set; }
    public bool? HasHemophilia { get; set; }
    public bool? HasHepatitis { get; set; }

    public bool? HasHypertension { get; set; }
    public bool? BloodPressureControlled { get; set; }

    public bool? UsedIsotretinoinLast6Months { get; set; }

    public bool? HasGlaucoma { get; set; }
    public bool? HasHerpes { get; set; }
    public bool? HasHiv { get; set; }
    public bool? HasLupus { get; set; }
    public bool? HasPsoriasis { get; set; }
    public bool? HasVitiligo { get; set; }
    public bool? HasThrombosis { get; set; }
    public bool? HasPacemaker { get; set; }

    public bool? HasDermatitisAtArea { get; set; }
    public bool? HasRosacea { get; set; }
    public bool? HasCirculatoryProblems { get; set; }
    public bool? HasRespiratoryProblems { get; set; }
    public string? RespiratoryProblemsDetails { get; set; }
    public bool? HasHormonalProblems { get; set; }
    public string? HormonalProblemsDetails { get; set; }
    public bool? HasKeloidTendency { get; set; }
    public bool? UsesAcidCream { get; set; }
    public bool? UsedInjectableLast30DaysInArea { get; set; }
    public bool? IsSmoker { get; set; }
    public bool? UsesHormoneOrSteroidTherapy { get; set; }
    public bool? UsesRegularMedication { get; set; }
    public string? RegularMedicationDetails { get; set; }
    public bool? DrinksTwoLitersWaterDaily { get; set; }
    public string? WaterIntakeQuantity { get; set; }
    public bool? DoesPhysicalExercise { get; set; }
    public string? ExerciseFrequency { get; set; }
    public bool? UsesSunscreenDaily { get; set; }

    public string? Notes { get; set; }

    // Assinatura e local
    public string? SignatureDataUrl { get; set; }
    public DateTime? SignedAt { get; set; }
    public string? SignatureCity { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
