
-- Get Task by ID
CREATE   PROCEDURE projecthub.sp_GetTaskById
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        t.Id,
        t.Title,
        t.Description,
        t.ProjectId,
        p.Name as ProjectName,
        t.ParentTaskId,
        t.PredecessorIds,
        t.AssignedTo,
        t.Status,
        t.Priority,
        t.StartDate,
        t.EndDate,
        t.DueDate,
        t.EstimatedHours,
        t.ActualHours,
        t.Progress,
        t.TaskOrder,
        t.CreatedDate,
        t.LastModified,
        CASE WHEN EXISTS (SELECT 1 FROM projecthub.Tasks child WHERE child.ParentTaskId = t.Id) THEN 1 ELSE 0 END as HasChildren,
        0 as Level
    FROM projecthub.Tasks t
    INNER JOIN projecthub.Projects p ON t.ProjectId = p.Id
    WHERE t.Id = @Id
END

GO

