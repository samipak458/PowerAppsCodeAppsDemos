
-- Get Client by ID
CREATE   PROCEDURE projecthub.sp_GetClientById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        c.Id,
        c.Name,
        c.ContactPerson,
        c.Email,
        c.Phone,
        c.Company,
        c.Address,
        c.City,
        c.State,
        c.ZipCode,
        c.Country,
        c.Industry,
        c.Notes,
        c.Status,
        c.CreatedDate,
        c.LastModified,
        ISNULL(p.ProjectCount, 0) as ProjectCount
    FROM projecthub.Clients c
    LEFT JOIN (
        SELECT ClientId, COUNT(*) as ProjectCount
        FROM projecthub.Projects
        GROUP BY ClientId
    ) p ON c.Id = p.ClientId
    WHERE c.Id = @Id
END

GO

