
-- Create Client
CREATE   PROCEDURE projecthub.sp_CreateClient
    @Name NVARCHAR(255),
    @ContactPerson NVARCHAR(255),
    @Email NVARCHAR(255),
    @Phone NVARCHAR(50) = NULL,
    @Company NVARCHAR(255) = NULL,
    @Address NVARCHAR(500) = NULL,
    @City NVARCHAR(100) = NULL,
    @State NVARCHAR(50) = NULL,
    @ZipCode NVARCHAR(20) = NULL,
    @Country NVARCHAR(100) = NULL,
    @Industry NVARCHAR(100) = NULL,
    @Notes NVARCHAR(MAX) = NULL,
    @Status NVARCHAR(20) = 'Active'
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewId INT
    
    INSERT INTO projecthub.Clients (
        Name, ContactPerson, Email, Phone, Company, Address, City, State, 
        ZipCode, Country, Industry, Notes, Status, CreatedDate, LastModified
    )
    VALUES (
        @Name, @ContactPerson, @Email, @Phone, @Company, @Address, @City, @State,
        @ZipCode, @Country, @Industry, @Notes, @Status, GETUTCDATE(), GETUTCDATE()
    )
    
    SET @NewId = SCOPE_IDENTITY()
    
    -- Return the created client
    EXEC projecthub.sp_GetClientById @NewId
END

GO

