
-- Get Project by ID
CREATE   PROCEDURE projecthub.sp_GetProjectById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        p.Id,
        p.Name,
        p.Description,
        p.ClientId,
        c.Name as ClientName,
        p.Status,
        p.Priority,
        p.StartDate,
        p.EndDate,
        p.EstimatedHours,
        p.ActualHours,
        p.Budget,
        p.Progress,
        p.CreatedDate,
        p.LastModified,
        ISNULL(t.TaskCount, 0) as TaskCount,
        ISNULL(t.CompletedTaskCount, 0) as CompletedTaskCount
    FROM projecthub.Projects p
    INNER JOIN projecthub.Clients c ON p.ClientId = c.Id
    LEFT JOIN (
        SELECT ProjectId, 
               COUNT(*) as TaskCount,
               SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) as CompletedTaskCount
        FROM projecthub.Tasks
        GROUP BY ProjectId
    ) t ON p.Id = t.ProjectId
    WHERE p.Id = @Id
END

GO

