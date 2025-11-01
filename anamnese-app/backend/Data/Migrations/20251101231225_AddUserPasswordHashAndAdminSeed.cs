using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Anamnese.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserPasswordHashAndAdminSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "character varying(200)",
                maxLength: 200,
                nullable: true);

            // Ensure admin user exists with default password 'admin' (SHA256)
            var hash = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918";
            migrationBuilder.Sql(@"DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM ""Users"" WHERE ""UserName"" = 'admin') THEN
        INSERT INTO ""Users"" (""Id"",""UserName"",""Email"",""PasswordHash"",""IsAdmin"",""IsActive"",""CreatedAt"",""UpdatedAt"")
        VALUES ('11111111-1111-1111-1111-111111111111','admin','admin@example.com','" + hash + @"', TRUE, TRUE, NOW(), NOW());
    ELSE
        UPDATE ""Users"" SET ""PasswordHash"" = COALESCE(""PasswordHash"", '" + hash + @"'), ""IsAdmin"" = TRUE, ""IsActive"" = TRUE WHERE ""UserName"" = 'admin';
    END IF;
END$$;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordHash",
                table: "Users");
        }
    }
}
