using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Anamnese.Api.Models;

public class Client
{
    public Guid Id { get; set; }

    [Required, MaxLength(200)]
    public string FullName { get; set; } = default!;

    public DateOnly? BirthDate { get; set; }

    // Dados pessoais adicionais conforme ficha
    [MaxLength(20)]
    public string? Sex { get; set; }

    [MaxLength(40)]
    public string? MaritalStatus { get; set; }

    [MaxLength(200)]
    public string? AddressStreet { get; set; }

    [MaxLength(20)]
    public string? AddressNumber { get; set; }

    [MaxLength(100)]
    public string? Neighborhood { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    [MaxLength(20)]
    public string? PostalCode { get; set; }

    [MaxLength(200), EmailAddress]
    public string? Email { get; set; }

    [MaxLength(120)]
    public string? Profession { get; set; }

    [MaxLength(30)]
    public string? HomePhone { get; set; }

    [MaxLength(30)]
    public string? MobilePhone { get; set; }

    // Campo legado (mantido para compatibilidade de versões do frontend)
    [MaxLength(30)]
    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [JsonIgnore]
    public ICollection<Anamnesis> Anamneses { get; set; } = new List<Anamnesis>();
}
