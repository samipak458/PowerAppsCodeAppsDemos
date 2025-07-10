
-- =============================================
-- PROJECT STORED PROCEDURES
-- =============================================

-- Search Projects with pagination and filtering
CREATE   PROCEDURE [projecthub].[sp_SearchProjects]
    @PageNumber INT = 1,
    @PageSize INT = 25,
    @SortColumn NVARCHAR(50) = 'Name',
    @SortDirection NVARCHAR(4) = 'asc',
    @SearchTerm NVARCHAR(255) = NULL,
    @ClientId INT = NULL,
    @Status NVARCHAR(20) = NULL,
    @Priority NVARCHAR(20) = NULL,
    @StartDateFrom DATETIME2 = NULL,
    @StartDateTo DATETIME2 = NULL,
    @TotalRecords INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate and sanitize inputs
    IF @PageNumber < 1 SET @PageNumber = 1
    IF @PageSize < 1 SET @PageSize = 25
    IF @PageSize > 100 SET @PageSize = 100
    
    -- Validate sort column to prevent injection
    IF @SortColumn NOT IN ('Id', 'Name', 'ClientName', 'Status', 'Priority', 'StartDate', 'EndDate', 'Budget', 'Progress', 'CreatedDate', 'LastModified')
        SET @SortColumn = 'Name'
    
    -- Validate sort direction
    IF @SortDirection NOT IN ('asc', 'desc')
        SET @SortDirection = 'asc'
    
    -- Build the WHERE clause dynamically but safely
    DECLARE @SQL NVARCHAR(MAX)
    DECLARE @CountSQL NVARCHAR(MAX)
    DECLARE @WhereClause NVARCHAR(MAX) = ' WHERE 1=1 '
    
    -- Add search term filter
    IF @SearchTerm IS NOT NULL AND LEN(TRIM(@SearchTerm)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND (p.Name LIKE ''%'' + @SearchTerm + ''%'' OR p.Description LIKE ''%'' + @SearchTerm + ''%'' OR c.Name LIKE ''%'' + @SearchTerm + ''%'') '
    END
    
    -- Add client filter
    IF @ClientId IS NOT NULL AND @ClientId > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND p.ClientId = @ClientId '
    END
    
    -- Add status filter
    IF @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND p.Status = @Status '
    END
    
    -- Add priority filter
    IF @Priority IS NOT NULL AND LEN(TRIM(@Priority)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND p.Priority = @Priority '
    END
    
    -- Add date range filters
    IF @StartDateFrom IS NOT NULL
    BEGIN
        SET @WhereClause = @WhereClause + ' AND p.StartDate >= @StartDateFrom '
    END
    
    IF @StartDateTo IS NOT NULL
    BEGIN
        SET @WhereClause = @WhereClause + ' AND p.StartDate <= @StartDateTo '
    END
    
    -- Get total count
    SET @CountSQL = 'SELECT @TotalRecords = COUNT(*) FROM projecthub.Projects p INNER JOIN projecthub.Clients c ON p.ClientId = c.Id ' + @WhereClause
    
    EXEC sp_executesql @CountSQL, 
        N'@SearchTerm NVARCHAR(255), @ClientId INT, @Status NVARCHAR(20), @Priority NVARCHAR(20), @StartDateFrom DATETIME2, @StartDateTo DATETIME2, @TotalRecords INT OUTPUT',
        @SearchTerm = @SearchTerm,
        @ClientId = @ClientId,
        @Status = @Status,
        @Priority = @Priority,
        @StartDateFrom = @StartDateFrom,
        @StartDateTo = @StartDateTo,
        @TotalRecords = @TotalRecords OUTPUT
    
    -- Build main query with pagination
    SET @SQL = 'SELECT 
        p.Id,
        p.Name,
        p.Description,
        p.ClientId,
        c.Name as ClientName,
        p.Status,
        p.Priority,
        p.StartDate,
        p.EndDate,
        p.EstimatedHours,
        p.ActualHours,
        p.Budget,
        p.Progress,
        p.CreatedDate,
        p.LastModified,
        ISNULL(t.TaskCount, 0) as TaskCount,
        ISNULL(t.CompletedTaskCount, 0) as CompletedTaskCount
    FROM projecthub.Projects p
    INNER JOIN projecthub.Clients c ON p.ClientId = c.Id
    LEFT JOIN (
        SELECT ProjectId, 
               COUNT(*) as TaskCount,
               SUM(CASE WHEN Status = ''Completed'' THEN 1 ELSE 0 END) as CompletedTaskCount
        FROM projecthub.Tasks
        GROUP BY ProjectId
    ) t ON p.Id = t.ProjectId'
    + @WhereClause
    + ' ORDER BY ' + CASE WHEN @SortColumn = 'ClientName' THEN 'c.Name' ELSE 'p.' + @SortColumn END + ' ' + @SortDirection
    + ' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY'
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize
    
    EXEC sp_executesql @SQL,
        N'@SearchTerm NVARCHAR(255), @ClientId INT, @Status NVARCHAR(20), @Priority NVARCHAR(20), @StartDateFrom DATETIME2, @StartDateTo DATETIME2, @Offset INT, @PageSize INT',
        @SearchTerm = @SearchTerm,
        @ClientId = @ClientId,
        @Status = @Status,
        @Priority = @Priority,
        @StartDateFrom = @StartDateFrom,
        @StartDateTo = @StartDateTo,
        @Offset = @Offset,
        @PageSize = @PageSize
END

GO

