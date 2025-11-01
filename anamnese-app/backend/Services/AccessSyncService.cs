using Anamnese.Api.Data;
using Anamnese.Api.Models;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Anamnese.Api.Services;

public static class AccessSyncService
{
    public static async Task SyncAsync(WebApplication app)
    {
        await SyncAsync(app.Services);
    }

    public static async Task SyncAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var epSource = scope.ServiceProvider.GetRequiredService<EndpointDataSource>();

        var endpoints = epSource.Endpoints
            .OfType<RouteEndpoint>()
            .Where(e => !string.IsNullOrEmpty(e.RoutePattern.RawText))
            .ToList();

        var existing = await db.Accesses.ToListAsync();
        var existingMap = existing.ToDictionary(a => (a.HttpMethod.ToUpperInvariant(), a.RoutePattern));

        var foundKeys = new HashSet<(string, string)>();

        foreach (var ep in endpoints)
        {
            var pattern = ep.RoutePattern.RawText ?? string.Empty;
            var methodMeta = ep.Metadata.OfType<Microsoft.AspNetCore.Routing.HttpMethodMetadata>().FirstOrDefault();
            var methods = methodMeta?.HttpMethods ?? new[] { "GET" };
            foreach (var method in methods)
            {
                var key = (method.ToUpperInvariant(), pattern);
                foundKeys.Add(key);
                if (!existingMap.TryGetValue(key, out var access))
                {
                    access = new Access
                    {
                        HttpMethod = method.ToUpperInvariant(),
                        RoutePattern = pattern,
                        DisplayName = ep.DisplayName,
                        IsActive = true
                    };
                    db.Accesses.Add(access);
                }
                else
                {
                    access.IsActive = true;
                    access.DisplayName = ep.DisplayName;
                }
            }
        }

        // Mark removed accesses as inactive
        foreach (var a in db.Accesses)
        {
            if (!foundKeys.Contains((a.HttpMethod.ToUpperInvariant(), a.RoutePattern)))
                a.IsActive = false;
        }

        // Ensure Admin role and default admin user exist
        var adminRole = await db.Roles.FirstOrDefaultAsync(r => r.Name == "Admin");
        if (adminRole is null)
        {
            adminRole = new Role { Name = "Admin", Description = "System administrator", IsSystem = true };
            db.Roles.Add(adminRole);
        }

        var adminUser = await db.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(u => u.UserName == "admin");
        if (adminUser is null)
        {
            adminUser = new User
            {
                UserName = "admin",
                Email = "admin@example.com",
                IsAdmin = true,
                Profile = new UserProfile { FullName = "Administrador", Locale = "pt-BR" }
            };
            db.Users.Add(adminUser);
        }
        adminUser.IsAdmin = true;
        if (string.IsNullOrWhiteSpace(adminUser.PasswordHash))
        {
            adminUser.PasswordHash = Sha256("admin");
        }

        // A sample non-admin user
        if (!await db.Users.AnyAsync(u => u.UserName == "julia"))
        {
            db.Users.Add(new User
            {
                UserName = "julia",
                Email = "julia@example.com",
                IsAdmin = false,
                Profile = new UserProfile { FullName = "Júlia Silva", Locale = "pt-BR" }
            });
        }

        if (!await db.UserRoles.AnyAsync(ur => ur.UserId == adminUser.Id && ur.RoleId == adminRole.Id))
        {
            db.UserRoles.Add(new UserRole { UserId = adminUser.Id, RoleId = adminRole.Id });
        }

        await db.SaveChangesAsync();

        // Grant Admin role all active accesses
        var activeAccessIds = await db.Accesses.Where(a => a.IsActive).Select(a => a.Id).ToListAsync();
        var existingRoleAccess = await db.RoleAccesses.Where(ra => ra.RoleId == adminRole.Id).Select(ra => ra.AccessId).ToListAsync();
        var missing = activeAccessIds.Except(existingRoleAccess).ToList();
        foreach (var accId in missing)
            db.RoleAccesses.Add(new RoleAccess { RoleId = adminRole.Id, AccessId = accId });

        await db.SaveChangesAsync();
    }

    private static string Sha256(string input)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }
}
