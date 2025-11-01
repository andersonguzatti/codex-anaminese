using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anamnese.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AccessControlInit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Accesses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    HttpMethod = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RoutePattern = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    DisplayName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Accesses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    BirthDate = table.Column<DateOnly>(type: "date", nullable: true),
                    Sex = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    MaritalStatus = table.Column<string>(type: "character varying(40)", maxLength: 40, nullable: true),
                    AddressStreet = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    AddressNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Neighborhood = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PostalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Profession = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    HomePhone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    MobilePhone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    Phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: true),
                    IsSystem = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    IsAdmin = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Anamneses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ClientId = table.Column<Guid>(type: "uuid", nullable: false),
                    FormDate = table.Column<DateOnly>(type: "date", nullable: true),
                    AreaToBeRemoved = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    HasAllergies = table.Column<bool>(type: "boolean", nullable: true),
                    AllergiesDetails = table.Column<string>(type: "text", nullable: true),
                    IsPregnant = table.Column<bool>(type: "boolean", nullable: true),
                    IsBreastFeeding = table.Column<bool>(type: "boolean", nullable: true),
                    BreastFeedingDuration = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    InCancerTreatment = table.Column<bool>(type: "boolean", nullable: true),
                    IsExOncologicPatient = table.Column<bool>(type: "boolean", nullable: true),
                    ExOncologicStoppedWhen = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    HasDiabetes = table.Column<bool>(type: "boolean", nullable: true),
                    DiabetesControlled = table.Column<bool>(type: "boolean", nullable: true),
                    HasHansenDisease = table.Column<bool>(type: "boolean", nullable: true),
                    HasEpilepsy = table.Column<bool>(type: "boolean", nullable: true),
                    HasHemophilia = table.Column<bool>(type: "boolean", nullable: true),
                    HasHepatitis = table.Column<bool>(type: "boolean", nullable: true),
                    HasHypertension = table.Column<bool>(type: "boolean", nullable: true),
                    BloodPressureControlled = table.Column<bool>(type: "boolean", nullable: true),
                    UsedIsotretinoinLast6Months = table.Column<bool>(type: "boolean", nullable: true),
                    HasGlaucoma = table.Column<bool>(type: "boolean", nullable: true),
                    HasHerpes = table.Column<bool>(type: "boolean", nullable: true),
                    HasHiv = table.Column<bool>(type: "boolean", nullable: true),
                    HasLupus = table.Column<bool>(type: "boolean", nullable: true),
                    HasPsoriasis = table.Column<bool>(type: "boolean", nullable: true),
                    HasVitiligo = table.Column<bool>(type: "boolean", nullable: true),
                    HasThrombosis = table.Column<bool>(type: "boolean", nullable: true),
                    HasPacemaker = table.Column<bool>(type: "boolean", nullable: true),
                    HasDermatitisAtArea = table.Column<bool>(type: "boolean", nullable: true),
                    HasRosacea = table.Column<bool>(type: "boolean", nullable: true),
                    HasCirculatoryProblems = table.Column<bool>(type: "boolean", nullable: true),
                    HasRespiratoryProblems = table.Column<bool>(type: "boolean", nullable: true),
                    RespiratoryProblemsDetails = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    HasHormonalProblems = table.Column<bool>(type: "boolean", nullable: true),
                    HormonalProblemsDetails = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    HasKeloidTendency = table.Column<bool>(type: "boolean", nullable: true),
                    UsesAcidCream = table.Column<bool>(type: "boolean", nullable: true),
                    UsedInjectableLast30DaysInArea = table.Column<bool>(type: "boolean", nullable: true),
                    IsSmoker = table.Column<bool>(type: "boolean", nullable: true),
                    UsesHormoneOrSteroidTherapy = table.Column<bool>(type: "boolean", nullable: true),
                    UsesRegularMedication = table.Column<bool>(type: "boolean", nullable: true),
                    RegularMedicationDetails = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    DrinksTwoLitersWaterDaily = table.Column<bool>(type: "boolean", nullable: true),
                    WaterIntakeQuantity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    DoesPhysicalExercise = table.Column<bool>(type: "boolean", nullable: true),
                    ExerciseFrequency = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    UsesSunscreenDaily = table.Column<bool>(type: "boolean", nullable: true),
                    Notes = table.Column<string>(type: "text", nullable: true),
                    SignatureDataUrl = table.Column<string>(type: "text", nullable: true),
                    SignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    SignatureCity = table.Column<string>(type: "character varying(120)", maxLength: 120, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Anamneses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Anamneses_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RoleAccesses",
                columns: table => new
                {
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false),
                    AccessId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RoleAccesses", x => new { x.RoleId, x.AccessId });
                    table.ForeignKey(
                        name: "FK_RoleAccesses_Accesses_AccessId",
                        column: x => x.AccessId,
                        principalTable: "Accesses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RoleAccesses_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    AvatarUrl = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    Locale = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    Phone = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_UserRoles_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserRoles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Accesses_HttpMethod_RoutePattern",
                table: "Accesses",
                columns: new[] { "HttpMethod", "RoutePattern" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Anamneses_ClientId",
                table: "Anamneses",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_Email",
                table: "Clients",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_RoleAccesses_AccessId",
                table: "RoleAccesses",
                column: "AccessId");

            migrationBuilder.CreateIndex(
                name: "IX_Roles_Name",
                table: "Roles",
                column: "Name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserId",
                table: "UserProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_UserName",
                table: "Users",
                column: "UserName",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Anamneses");

            migrationBuilder.DropTable(
                name: "RoleAccesses");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "UserRoles");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "Accesses");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
