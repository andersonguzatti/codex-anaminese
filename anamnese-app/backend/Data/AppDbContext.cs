using Anamnese.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Anamnese.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Anamnesis> Anamneses => Set<Anamnesis>();
    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Access> Accesses => Set<Access>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<RoleAccess> RoleAccesses => Set<RoleAccess>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Client>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.FullName).HasMaxLength(200).IsRequired();
            b.Property(x => x.BirthDate).HasColumnType("date");
            b.Property(x => x.Sex).HasMaxLength(20);
            b.Property(x => x.MaritalStatus).HasMaxLength(40);
            b.Property(x => x.AddressStreet).HasMaxLength(200);
            b.Property(x => x.AddressNumber).HasMaxLength(20);
            b.Property(x => x.Neighborhood).HasMaxLength(100);
            b.Property(x => x.City).HasMaxLength(100);
            b.Property(x => x.PostalCode).HasMaxLength(20);
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.Profession).HasMaxLength(120);
            b.Property(x => x.HomePhone).HasMaxLength(30);
            b.Property(x => x.MobilePhone).HasMaxLength(30);
            b.Property(x => x.Phone).HasMaxLength(30);
            b.HasIndex(x => x.Email);
            b.Property(x => x.CreatedAt);
            b.Property(x => x.UpdatedAt);
        });

        modelBuilder.Entity<Anamnesis>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.Client)
                .WithMany(c => c.Anamneses)
                .HasForeignKey(x => x.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            b.Property(x => x.FormDate).HasColumnType("date");
            b.Property(x => x.AreaToBeRemoved).HasMaxLength(200);
            b.Property(x => x.AllergiesDetails).HasColumnType("text");
            b.Property(x => x.BreastFeedingDuration).HasMaxLength(100);
            b.Property(x => x.ExOncologicStoppedWhen).HasMaxLength(150);
            b.Property(x => x.RespiratoryProblemsDetails).HasMaxLength(200);
            b.Property(x => x.HormonalProblemsDetails).HasMaxLength(200);
            b.Property(x => x.RegularMedicationDetails).HasMaxLength(300);
            b.Property(x => x.WaterIntakeQuantity).HasMaxLength(100);
            b.Property(x => x.ExerciseFrequency).HasMaxLength(120);
            b.Property(x => x.SignatureCity).HasMaxLength(120);
            b.Property(x => x.SignatureDataUrl).HasColumnType("text");
            b.Property(x => x.Notes).HasColumnType("text");
            b.Property(x => x.CreatedAt);
        });

        modelBuilder.Entity<User>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.UserName).HasMaxLength(100).IsRequired();
            b.Property(x => x.Email).HasMaxLength(200);
            b.Property(x => x.PasswordHash).HasMaxLength(200);
            b.HasIndex(x => x.UserName).IsUnique();
        });

        modelBuilder.Entity<UserProfile>(b =>
        {
            b.HasKey(x => x.Id);
            b.HasOne(x => x.User)
                .WithOne(u => u.Profile)
                .HasForeignKey<UserProfile>(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            b.HasIndex(x => x.UserId).IsUnique();
        });

        modelBuilder.Entity<Role>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).HasMaxLength(100).IsRequired();
            b.HasIndex(x => x.Name).IsUnique();
        });

        modelBuilder.Entity<Access>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.HttpMethod).HasMaxLength(20).IsRequired();
            b.Property(x => x.RoutePattern).HasMaxLength(300).IsRequired();
            b.HasIndex(x => new { x.HttpMethod, x.RoutePattern }).IsUnique();
        });

        modelBuilder.Entity<UserRole>(b =>
        {
            b.HasKey(x => new { x.UserId, x.RoleId });
            b.HasOne(x => x.User).WithMany(u => u.UserRoles).HasForeignKey(x => x.UserId);
            b.HasOne(x => x.Role).WithMany(r => r.UserRoles).HasForeignKey(x => x.RoleId);
        });

        modelBuilder.Entity<RoleAccess>(b =>
        {
            b.HasKey(x => new { x.RoleId, x.AccessId });
            b.HasOne(x => x.Role).WithMany(r => r.RoleAccesses).HasForeignKey(x => x.RoleId);
            b.HasOne(x => x.Access).WithMany(a => a.RoleAccesses).HasForeignKey(x => x.AccessId);
        });
    }
}
