using System.ComponentModel.DataAnnotations;

namespace Anamnese.Api.Models;

public class Access
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(20)]
    public string HttpMethod { get; set; } = default!;

    [MaxLength(300)]
    public string RoutePattern { get; set; } = default!;

    [MaxLength(200)]
    public string? DisplayName { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<RoleAccess> RoleAccesses { get; set; } = new List<RoleAccess>();
}

