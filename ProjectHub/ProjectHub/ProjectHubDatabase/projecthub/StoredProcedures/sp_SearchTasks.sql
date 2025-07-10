
-- =============================================
-- TASK STORED PROCEDURES
-- =============================================

-- Search Tasks with pagination and filtering
CREATE   PROCEDURE [projecthub].[sp_SearchTasks]
    @PageNumber INT = 1,
    @PageSize INT = 25,
    @SortColumn NVARCHAR(50) = 'TaskOrder',
    @SortDirection NVARCHAR(4) = 'asc',
    @SearchTerm NVARCHAR(255) = NULL,
    @ProjectId INT = NULL,
    @AssignedTo NVARCHAR(255) = NULL,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL,
    @DueDateFrom DATETIME2 = NULL,
    @DueDateTo DATETIME2 = NULL,
    @IncludeCompleted BIT = 1,
    @TotalRecords INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate and sanitize inputs
    IF @PageNumber < 1 SET @PageNumber = 1
    IF @PageSize < 1 SET @PageSize = 25
    IF @PageSize > 100 SET @PageSize = 100
    
    -- Validate sort column to prevent injection
    IF @SortColumn NOT IN ('Id', 'Title', 'ProjectName', 'AssignedTo', 'Status', 'Priority', 'StartDate', 'EndDate', 'DueDate', 'Progress', 'TaskOrder', 'CreatedDate', 'LastModified')
        SET @SortColumn = 'TaskOrder'
    
    -- Validate sort direction
    IF @SortDirection NOT IN ('asc', 'desc')
        SET @SortDirection = 'asc'
    
    -- Build the WHERE clause dynamically but safely
    DECLARE @SQL NVARCHAR(MAX)
    DECLARE @CountSQL NVARCHAR(MAX)
    DECLARE @WhereClause NVARCHAR(MAX) = ' WHERE 1=1 '
    
    -- Add search term filter with wildcards
    IF @SearchTerm IS NOT NULL AND LEN(TRIM(@SearchTerm)) > 0
    BEGIN
        SET @SearchTerm = '%' + @SearchTerm + '%'
        SET @WhereClause = @WhereClause + ' AND (t.Title LIKE @SearchTerm OR t.Description LIKE @SearchTerm OR p.Name LIKE @SearchTerm OR t.AssignedTo LIKE @SearchTerm) '
    END
    
    -- Add project filter
    IF @ProjectId IS NOT NULL AND @ProjectId > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.ProjectId = @ProjectId '
    END
    
    -- Add assigned to filter with wildcards
    IF @AssignedTo IS NOT NULL AND LEN(TRIM(@AssignedTo)) > 0
    BEGIN
        SET @AssignedTo = '%' + @AssignedTo + '%'
        SET @WhereClause = @WhereClause + ' AND t.AssignedTo LIKE @AssignedTo '
    END
    
    -- Add status filter
    IF @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.Status = @Status '
    END
    
    -- Add priority filter
    IF @Priority IS NOT NULL AND LEN(TRIM(@Priority)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.Priority = @Priority '
    END
    
    -- Add date range filters
    IF @DueDateFrom IS NOT NULL
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.DueDate >= @DueDateFrom '
    END
    
    IF @DueDateTo IS NOT NULL
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.DueDate <= @DueDateTo '
    END
    
    -- Add completed filter
    IF @IncludeCompleted = 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND t.Status != ''Completed'' '
    END
    
    -- Get total count
    SET @CountSQL = 'SELECT @TotalRecords = COUNT(*) FROM projecthub.Tasks t INNER JOIN projecthub.Projects p ON t.ProjectId = p.Id ' + @WhereClause
    
    EXEC sp_executesql @CountSQL, 
        N'@SearchTerm NVARCHAR(255), @ProjectId INT, @AssignedTo NVARCHAR(255), @Status NVARCHAR(20), @Priority NVARCHAR(20), @DueDateFrom DATETIME2, @DueDateTo DATETIME2, @TotalRecords INT OUTPUT',
        @SearchTerm = @SearchTerm,
        @ProjectId = @ProjectId,
        @AssignedTo = @AssignedTo,
        @Status = @Status,
        @Priority = @Priority,
        @DueDateFrom = @DueDateFrom,
        @DueDateTo = @DueDateTo,
        @TotalRecords = @TotalRecords OUTPUT
    
    -- Build main query with pagination
    SET @SQL = 'SELECT 
        t.Id,
        t.Title,
        t.Description,
        t.ProjectId,
        p.Name as ProjectName,
        t.ParentTaskId,
        t.PredecessorIds,
        t.AssignedTo,
        t.Status,
        t.Priority,
        t.StartDate,
        t.EndDate,
        t.DueDate,
        t.EstimatedHours,
        t.ActualHours,
        t.Progress,
        t.TaskOrder,
        t.CreatedDate,
        t.LastModified,
        CASE WHEN EXISTS (SELECT 1 FROM projecthub.Tasks child WHERE child.ParentTaskId = t.Id) THEN 1 ELSE 0 END as HasChildren,
        0 as Level -- Will be calculated in application layer
    FROM projecthub.Tasks t
    INNER JOIN projecthub.Projects p ON t.ProjectId = p.Id'
    + @WhereClause
    + ' ORDER BY ' + CASE WHEN @SortColumn = 'ProjectName' THEN 'p.Name' ELSE 't.' + @SortColumn END + ' ' + @SortDirection
    + ' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY'
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize
    
    EXEC sp_executesql @SQL,
        N'@SearchTerm NVARCHAR(255), @ProjectId INT, @AssignedTo NVARCHAR(255), @Status NVARCHAR(20), @Priority NVARCHAR(20), @DueDateFrom DATETIME2, @DueDateTo DATETIME2, @Offset INT, @PageSize INT',
        @SearchTerm = @SearchTerm,
        @ProjectId = @ProjectId,
        @AssignedTo = @AssignedTo,
        @Status = @Status,
        @Priority = @Priority,
        @DueDateFrom = @DueDateFrom,
        @DueDateTo = @DueDateTo,
        @Offset = @Offset,
        @PageSize = @PageSize
END

GO

