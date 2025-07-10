
-- Update Task
CREATE   PROCEDURE projecthub.sp_UpdateTask
    @Id INT,
    @Title NVARCHAR(255) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @ProjectId INT = NULL,
    @ParentTaskId INT = NULL,
    @PredecessorIds NVARCHAR(MAX) = NULL,
    @AssignedTo NVARCHAR(255) = NULL,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @DueDate DATETIME2 = NULL,
    @EstimatedHours DECIMAL(10,2) = NULL,
    @ActualHours DECIMAL(10,2) = NULL,
    @Progress INT = NULL,
    @TaskOrder DECIMAL(18,6) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE projecthub.Tasks
    SET
        Title = CASE WHEN @Title IS NOT NULL AND LEN(TRIM(@Title)) > 0 THEN @Title ELSE Title END,
        Description = CASE WHEN @Description IS NOT NULL THEN @Description ELSE Description END,
        ProjectId = CASE WHEN @ProjectId IS NOT NULL AND @ProjectId > 0 THEN @ProjectId ELSE ProjectId END,
        ParentTaskId = CASE WHEN @ParentTaskId IS NOT NULL THEN @ParentTaskId ELSE ParentTaskId END,
        PredecessorIds = CASE WHEN @PredecessorIds IS NOT NULL THEN @PredecessorIds ELSE PredecessorIds END,
        AssignedTo = CASE WHEN @AssignedTo IS NOT NULL THEN @AssignedTo ELSE AssignedTo END,
        Status = CASE WHEN @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0 THEN @Status ELSE Status END,
        Priority = CASE WHEN @Priority IS NOT NULL AND LEN(TRIM(@Priority)) > 0 THEN @Priority ELSE Priority END,
        StartDate = CASE WHEN @StartDate IS NOT NULL THEN @StartDate ELSE StartDate END,
        EndDate = CASE WHEN @EndDate IS NOT NULL THEN @EndDate ELSE EndDate END,
        DueDate = CASE WHEN @DueDate IS NOT NULL THEN @DueDate ELSE DueDate END,
        EstimatedHours = CASE WHEN @EstimatedHours IS NOT NULL THEN @EstimatedHours ELSE EstimatedHours END,
        ActualHours = CASE WHEN @ActualHours IS NOT NULL THEN @ActualHours ELSE ActualHours END,
        Progress = CASE WHEN @Progress IS NOT NULL THEN @Progress ELSE Progress END,
        TaskOrder = CASE WHEN @TaskOrder IS NOT NULL THEN @TaskOrder ELSE TaskOrder END,
        LastModified = GETUTCDATE()
    WHERE Id = @Id
    
    -- Return the updated task
    EXEC projecthub.sp_GetTaskById @Id
END

GO

