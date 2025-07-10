
-- Get Project Progress Summary
CREATE   PROCEDURE projecthub.sp_GetProjectProgressSummary
    @ProjectId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT
        p.Id,
        p.Name,
        p.Status,
        p.Progress,
        p.Budget,
        p.EstimatedHours,
        p.ActualHours,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE ProjectId = p.Id) as TotalTasks,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE ProjectId = p.Id AND Status = 'Completed') as CompletedTasks,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE ProjectId = p.Id AND Status = 'In Progress') as InProgressTasks,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE ProjectId = p.Id AND Status = 'Not Started') as NotStartedTasks,
        (SELECT SUM(EstimatedHours) FROM projecthub.Tasks WHERE ProjectId = p.Id) as TotalEstimatedHours,
        (SELECT SUM(ActualHours) FROM projecthub.Tasks WHERE ProjectId = p.Id) as TotalActualHours
    FROM projecthub.Projects p
    WHERE p.Id = @ProjectId
END

GO

