using System.ComponentModel.DataAnnotations;

namespace Anamnese.Api.Models;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string UserName { get; set; } = default!;

    [MaxLength(200), EmailAddress]
    public string? Email { get; set; }

    [MaxLength(200)]
    public string? PasswordHash { get; set; }

    public bool IsAdmin { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public UserProfile? Profile { get; set; }

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
