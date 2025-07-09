
-- Reorder Task
CREATE   PROCEDURE [projecthub].[sp_ReorderTask]
    @TaskId INT,
    @NewPosition INT,
    @ParentTaskId INT = NULL,
    @ProjectId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @CurrentOrder DECIMAL(18,6)
    DECLARE @NewOrder DECIMAL(18,6)
    DECLARE @PrevOrder DECIMAL(18,6) = 0
    DECLARE @NextOrder DECIMAL(18,6) = 999999
    
    -- Get current task order
    SELECT @CurrentOrder = TaskOrder FROM projecthub.Tasks WHERE Id = @TaskId
    
    -- Get the order values around the new position
    ;WITH OrderedTasks AS (
        SELECT TaskOrder, ROW_NUMBER() OVER (ORDER BY TaskOrder) as RowNum
        FROM projecthub.Tasks
        WHERE ProjectId = @ProjectId 
        AND Id != @TaskId
    )
    SELECT 
        @PrevOrder = ISNULL((SELECT TaskOrder FROM OrderedTasks WHERE RowNum = @NewPosition - 1), 0),
        @NextOrder = ISNULL((SELECT TaskOrder FROM OrderedTasks WHERE RowNum = @NewPosition), 999999)
    
    -- Calculate new order (midpoint between prev and next)
    SET @NewOrder = (@PrevOrder + @NextOrder) / 2
    
    -- Update the task order
    UPDATE projecthub.Tasks
    SET TaskOrder = @NewOrder,
        ParentTaskId = @ParentTaskId,
        ProjectId = @ProjectId,
        LastModified = GETUTCDATE()
    WHERE Id = @TaskId
    
    -- Return the updated task
    EXEC projecthub.sp_GetTaskById @TaskId
END

GO

