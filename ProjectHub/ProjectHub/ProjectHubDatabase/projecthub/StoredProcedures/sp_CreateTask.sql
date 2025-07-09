
-- Create Task
CREATE   PROCEDURE projecthub.sp_CreateTask
    @Title NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
    @ProjectId INT,
    @ParentTaskId INT = NULL,
    @PredecessorIds NVARCHAR(MAX) = NULL,
    @AssignedTo NVARCHAR(255) = NULL,
    @Status NVARCHAR(20) = 'Not Started',
    @Priority NVARCHAR(20) = 'Medium',
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @DueDate DATETIME2 = NULL,
    @EstimatedHours DECIMAL(10,2) = NULL,
    @Progress INT = 0,
    @TaskOrder DECIMAL(18,6) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewId INT
    DECLARE @NewTaskOrder DECIMAL(18,6)
    
    -- Calculate TaskOrder if not provided
    IF @TaskOrder IS NULL
    BEGIN
        SELECT @NewTaskOrder = ISNULL(MAX(TaskOrder), 0) + 1000
        FROM projecthub.Tasks
        WHERE ProjectId = @ProjectId AND ParentTaskId = @ParentTaskId
    END
    ELSE
    BEGIN
        SET @NewTaskOrder = @TaskOrder
    END
    
    INSERT INTO projecthub.Tasks (
        Title, Description, ProjectId, ParentTaskId, PredecessorIds, AssignedTo,
        Status, Priority, StartDate, EndDate, DueDate, EstimatedHours, Progress,
        TaskOrder, CreatedDate, LastModified
    )
    VALUES (
        @Title, @Description, @ProjectId, @ParentTaskId, @PredecessorIds, @AssignedTo,
        @Status, @Priority, @StartDate, @EndDate, @DueDate, @EstimatedHours, @Progress,
        @NewTaskOrder, GETUTCDATE(), GETUTCDATE()
    )
    
    SET @NewId = SCOPE_IDENTITY()
    
    -- Return the created task
    EXEC projecthub.sp_GetTaskById @NewId
END

GO

