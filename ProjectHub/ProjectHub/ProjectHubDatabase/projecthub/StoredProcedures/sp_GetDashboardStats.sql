
-- =============================================
-- UTILITY PROCEDURES
-- =============================================

-- Get Dashboard Statistics
CREATE   PROCEDURE projecthub.sp_GetDashboardStats
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT
        (SELECT COUNT(*) FROM projecthub.Clients WHERE Status = 'Active') as ActiveClients,
        (SELECT COUNT(*) FROM projecthub.Projects WHERE Status = 'In Progress') as ActiveProjects,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE Status IN ('Not Started', 'In Progress')) as PendingTasks,
        (SELECT COUNT(*) FROM projecthub.Tasks WHERE Status = 'Completed') as CompletedTasks,
        (SELECT AVG(CAST(Progress as FLOAT)) FROM projecthub.Projects WHERE Status = 'In Progress') as AverageProjectProgress,
        (SELECT SUM(Budget) FROM projecthub.Projects WHERE Status NOT IN ('Cancelled', 'Completed')) as TotalActiveBudget
END

GO

