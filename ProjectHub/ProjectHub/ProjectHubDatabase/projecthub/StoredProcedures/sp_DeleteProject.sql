
-- Delete Project
CREATE   PROCEDURE projecthub.sp_DeleteProject
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if project has tasks
    IF EXISTS (SELECT 1 FROM projecthub.Tasks WHERE ProjectId = @Id)
    BEGIN
        RAISERROR('Cannot delete project with existing tasks', 16, 1)
        RETURN
    END
    
    DELETE FROM projecthub.Projects WHERE Id = @Id
    
    SELECT @@ROWCOUNT as DeletedRows
END

GO

