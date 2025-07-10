
-- Delete Task
CREATE   PROCEDURE projecthub.sp_DeleteTask
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if task has child tasks
    IF EXISTS (SELECT 1 FROM projecthub.Tasks WHERE ParentTaskId = @Id)
    BEGIN
        RAISERROR('Cannot delete task with child tasks', 16, 1)
        RETURN
    END
    
    -- Check if task is referenced as a predecessor
    IF EXISTS (SELECT 1 FROM projecthub.Tasks WHERE PredecessorIds LIKE '%,' + CAST(@Id AS VARCHAR(10)) + ',%' OR PredecessorIds LIKE CAST(@Id AS VARCHAR(10)) + ',%' OR PredecessorIds LIKE '%,' + CAST(@Id AS VARCHAR(10)) OR PredecessorIds = CAST(@Id AS VARCHAR(10)))
    BEGIN
        RAISERROR('Cannot delete task that is referenced as a predecessor by other tasks', 16, 1)
        RETURN
    END
    
    DELETE FROM projecthub.Tasks WHERE Id = @Id
    
    SELECT @@ROWCOUNT as DeletedRows
END

GO

