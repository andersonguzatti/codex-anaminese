using System.ComponentModel.DataAnnotations;

namespace Anamnese.Api.Models;

public class Role
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(100)]
    public string Name { get; set; } = default!;

    [MaxLength(250)]
    public string? Description { get; set; }

    public bool IsSystem { get; set; } = false;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    public ICollection<RoleAccess> RoleAccesses { get; set; } = new List<RoleAccess>();
}

