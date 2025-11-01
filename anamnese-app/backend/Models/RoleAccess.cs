namespace Anamnese.Api.Models;

public class RoleAccess
{
    public Guid RoleId { get; set; }
    public Role Role { get; set; } = default!;

    public Guid AccessId { get; set; }
    public Access Access { get; set; } = default!;
}

