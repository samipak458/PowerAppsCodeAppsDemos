
-- Update Project
CREATE   PROCEDURE projecthub.sp_UpdateProject
    @Id INT,
    @Name NVARCHAR(255) = NULL,
    @Description NVARCHAR(MAX) = NULL,
    @ClientId INT = NULL,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL,
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @EstimatedHours DECIMAL(10,2) = NULL,
    @Budget DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE projecthub.Projects
    SET
        Name = CASE WHEN @Name IS NOT NULL AND LEN(TRIM(@Name)) > 0 THEN @Name ELSE Name END,
        Description = CASE WHEN @Description IS NOT NULL THEN @Description ELSE Description END,
        ClientId = CASE WHEN @ClientId IS NOT NULL AND @ClientId > 0 THEN @ClientId ELSE ClientId END,
        Status = CASE WHEN @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0 THEN @Status ELSE Status END,
        Priority = CASE WHEN @Priority IS NOT NULL AND LEN(TRIM(@Priority)) > 0 THEN @Priority ELSE Priority END,
        StartDate = CASE WHEN @StartDate IS NOT NULL THEN @StartDate ELSE StartDate END,
        EndDate = CASE WHEN @EndDate IS NOT NULL THEN @EndDate ELSE EndDate END,
        EstimatedHours = CASE WHEN @EstimatedHours IS NOT NULL THEN @EstimatedHours ELSE EstimatedHours END,
        Budget = CASE WHEN @Budget IS NOT NULL THEN @Budget ELSE Budget END,
        LastModified = GETUTCDATE()
    WHERE Id = @Id
    
    -- Return the updated project
    EXEC projecthub.sp_GetProjectById @Id
END

GO

