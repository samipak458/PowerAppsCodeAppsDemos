
-- =============================================
-- CLIENT STORED PROCEDURES
-- =============================================

-- Search Clients with pagination and filtering
CREATE   PROCEDURE [projecthub].[sp_SearchClients]
    @PageNumber INT = 1,
    @PageSize INT = 25,
    @SortColumn NVARCHAR(50) = 'Name',
    @SortDirection NVARCHAR(4) = 'asc',
    @SearchTerm NVARCHAR(255) = NULL,
    @Status NVARCHAR(20) = NULL,
    @CompanyFilter NVARCHAR(255) = NULL,
    @TotalRecords INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Validate and sanitize inputs
    IF @PageNumber < 1 SET @PageNumber = 1
    IF @PageSize < 1 SET @PageSize = 25
    IF @PageSize > 100 SET @PageSize = 100
    
    -- Validate sort column to prevent injection
    IF @SortColumn NOT IN ('Id', 'Name', 'ContactPerson', 'Email', 'Company', 'Industry', 'Status', 'CreatedDate', 'LastModified')
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
        SET @WhereClause = @WhereClause + ' AND (Name LIKE ''%'' + @SearchTerm + ''%'' OR ContactPerson LIKE ''%'' + @SearchTerm + ''%'' OR Email LIKE ''%'' + @SearchTerm + ''%'' OR Company LIKE ''%'' + @SearchTerm + ''%'' OR Industry LIKE ''%'' + @SearchTerm + ''%'' OR Notes LIKE ''%'' + @SearchTerm + ''%'') '
    END
    
    -- Add status filter
    IF @Status IS NOT NULL AND LEN(TRIM(@Status)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND Status = @Status '
    END
    
    -- Add company filter
    IF @CompanyFilter IS NOT NULL AND LEN(TRIM(@CompanyFilter)) > 0
    BEGIN
        SET @WhereClause = @WhereClause + ' AND Company LIKE ''%'' + @CompanyFilter + ''%'' '
    END
    
    -- Get total count
    SET @CountSQL = 'SELECT @TotalRecords = COUNT(*) FROM projecthub.Clients ' + @WhereClause
    
    EXEC sp_executesql @CountSQL, 
        N'@SearchTerm NVARCHAR(255), @Status NVARCHAR(20), @CompanyFilter NVARCHAR(255), @TotalRecords INT OUTPUT',
        @SearchTerm = @SearchTerm,
        @Status = @Status,
        @CompanyFilter = @CompanyFilter,
        @TotalRecords = @TotalRecords OUTPUT
    
    -- Build main query with pagination
    SET @SQL = 'SELECT 
        c.Id,
        c.Name,
        c.ContactPerson,
        c.Email,
        c.Phone,
        c.Company,
        c.Address,
        c.City,
        c.State,
        c.ZipCode,
        c.Country,
        c.Industry,
        c.Notes,
        c.Status,
        c.CreatedDate,
        c.LastModified,
        ISNULL(p.ProjectCount, 0) as ProjectCount
    FROM projecthub.Clients c
    LEFT JOIN (
        SELECT ClientId, COUNT(*) as ProjectCount
        FROM projecthub.Projects
        GROUP BY ClientId
    ) p ON c.Id = p.ClientId'
    + @WhereClause
    + ' ORDER BY ' + @SortColumn + ' ' + @SortDirection
    + ' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY'
    
    DECLARE @Offset INT = (@PageNumber - 1) * @PageSize
    
    EXEC sp_executesql @SQL,
        N'@SearchTerm NVARCHAR(255), @Status NVARCHAR(20), @CompanyFilter NVARCHAR(255), @Offset INT, @PageSize INT',
        @SearchTerm = @SearchTerm,
        @Status = @Status,
        @CompanyFilter = @CompanyFilter,
        @Offset = @Offset,
        @PageSize = @PageSize
END

GO

