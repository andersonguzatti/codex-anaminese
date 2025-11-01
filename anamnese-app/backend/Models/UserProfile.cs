using System.ComponentModel.DataAnnotations;

namespace Anamnese.Api.Models;

public class UserProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid UserId { get; set; }
    public User User { get; set; } = default!;

    [MaxLength(200)]
    public string? FullName { get; set; }

    [MaxLength(300)]
    public string? AvatarUrl { get; set; }

    [MaxLength(10)]
    public string? Locale { get; set; }

    [MaxLength(30)]
    public string? Phone { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

