using Anamnese.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Anamnese.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Anamnesis> Anamneses => Set<Anamnesis>();

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
    }
}
