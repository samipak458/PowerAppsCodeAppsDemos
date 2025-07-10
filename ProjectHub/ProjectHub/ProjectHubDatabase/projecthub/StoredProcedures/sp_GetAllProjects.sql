
-- Get All Projects (for dropdowns)
CREATE   PROCEDURE projecthub.sp_GetAllProjects
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT p.Id, p.Name, c.Name as ClientName, p.Status
    FROM projecthub.Projects p
    INNER JOIN projecthub.Clients c ON p.ClientId = c.Id
    WHERE p.Status NOT IN ('Completed', 'Cancelled')
    ORDER BY p.Name
END

GO

