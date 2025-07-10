
-- Update Client
CREATE   PROCEDURE projecthub.sp_UpdateClient
    @Id INT,
    @Name NVARCHAR(255) = NULL,
    @ContactPerson NVARCHAR(255) = NULL,
    @Email NVARCHAR(255) = NULL,
    @Phone NVARCHAR(50) = NULL,
    @Company NVARCHAR(255) = NULL,
    @Address NVARCHAR(500) = NULL,
    @City NVARCHAR(100) = NULL,
    @State NVARCHAR(50) = NULL,
    @ZipCode NVARCHAR(20) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Industry NVARCHAR(100) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE projecthub.Clients
    SET
        Name = CASE WHEN @Name IS NOT NULL AND LEN(TRIM(@Name)) > 0 THEN @Name ELSE Name END,
        ContactPerson = CASE WHEN @ContactPerson IS NOT NULL AND LEN(TRIM(@ContactPerson)) > 0 THEN @ContactPerson ELSE ContactPerson END,
        Email = CASE WHEN @Email IS NOT NULL AND LEN(TRIM(@Email)) > 0 THEN @Email ELSE Email END,
        Phone = CASE WHEN @Phone IS NOT NULL THEN @Phone ELSE Phone END,
        Company = CASE WHEN @Company IS NOT NULL THEN @Company ELSE Company END,
        Address = CASE WHEN @Address IS NOT NULL THEN @Address ELSE Address END,
        City = CASE WHEN @City IS NOT NULL THEN @City ELSE City END,
        State = CASE WHEN @State IS NOT NULL THEN @State ELSE State END,
        ZipCode = CASE WHEN @ZipCode IS NOT NULL THEN @ZipCode ELSE ZipCode END,
        Country = CASE WHEN @Country IS NOT NULL THEN @Country ELSE Country END,
        Industry = CASE WHEN @Industry IS NOT NULL THEN @Industry ELSE Industry END,
        Notes = CASE WHEN @Notes IS NOT NULL THEN @Notes ELSE Notes END,
        Status = CASE WHEN @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0 THEN @Status ELSE Status END,
        LastModified = GETUTCDATE()
    WHERE Id = @Id
    
    -- Return the updated client
    EXEC projecthub.sp_GetClientById @Id
END

GO

