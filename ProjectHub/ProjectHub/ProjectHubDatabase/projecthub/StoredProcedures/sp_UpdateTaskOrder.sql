
-- Update Task Order (direct)
CREATE   PROCEDURE projecthub.sp_UpdateTaskOrder
    @TaskId INT,
    @NewTaskOrder DECIMAL(18,6)
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE projecthub.Tasks
    SET TaskOrder = @NewTaskOrder,
        LastModified = GETUTCDATE()
    WHERE Id = @TaskId
    
    -- Return the updated task
    EXEC projecthub.sp_GetTaskById @TaskId
END

GO

