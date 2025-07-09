
-- Get Task Dependencies
CREATE   PROCEDURE projecthub.sp_GetTaskDependencies
    @TaskId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get the task's dependencies
    DECLARE @PredecessorIds NVARCHAR(MAX)
    SELECT @PredecessorIds = PredecessorIds FROM projecthub.Tasks WHERE Id = @TaskId
    
    -- Parse comma-separated IDs and return dependency details
    IF @PredecessorIds IS NOT NULL AND LEN(@PredecessorIds) > 0
    BEGIN
        DECLARE @SQL NVARCHAR(MAX)
        SET @SQL = 'SELECT Id, Title, Status, Progress, DueDate
                   FROM projecthub.Tasks 
                   WHERE Id IN (' + @PredecessorIds + ')
                   ORDER BY Id'
        
        EXEC sp_executesql @SQL
    END
    ELSE
    BEGIN
        -- Return empty result set with same structure
        SELECT Id, Title, Status, Progress, DueDate
        FROM projecthub.Tasks 
        WHERE 1 = 0
    END
END

GO

