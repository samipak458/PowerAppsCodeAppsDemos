
-- Get All Clients (for dropdowns)
CREATE   PROCEDURE projecthub.sp_GetAllClients
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT Id, Name, ContactPerson, Email, Status
    FROM projecthub.Clients
    WHERE Status = 'Active'
    ORDER BY Name
END

GO

