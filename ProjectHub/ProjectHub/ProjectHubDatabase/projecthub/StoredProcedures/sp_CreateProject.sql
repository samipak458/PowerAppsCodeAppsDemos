
-- Create Project
CREATE   PROCEDURE projecthub.sp_CreateProject
    @Name NVARCHAR(255),
    @Description NVARCHAR(MAX) = NULL,
    @ClientId INT,
    @Status NVARCHAR(20) = 'Planning',
    @Priority NVARCHAR(20) = 'Medium',
    @StartDate DATETIME2 = NULL,
    @EndDate DATETIME2 = NULL,
    @EstimatedHours DECIMAL(10,2) = NULL,
    @Budget DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NewId INT
    
    INSERT INTO projecthub.Projects (
        Name, Description, ClientId, Status, Priority, StartDate, EndDate,
        EstimatedHours, Budget, Progress, CreatedDate, LastModified
    )
    VALUES (
        @Name, @Description, @ClientId, @Status, @Priority, @StartDate, @EndDate,
        @EstimatedHours, @Budget, 0, GETUTCDATE(), GETUTCDATE()
    )
    
    SET @NewId = SCOPE_IDENTITY()
    
    -- Return the created project
    EXEC projecthub.sp_GetProjectById @NewId
END

GO

