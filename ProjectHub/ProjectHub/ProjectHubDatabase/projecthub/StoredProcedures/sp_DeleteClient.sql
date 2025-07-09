
-- Delete Client
CREATE   PROCEDURE projecthub.sp_DeleteClient
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Check if client has projects
    IF EXISTS (SELECT 1 FROM projecthub.Projects WHERE ClientId = @Id)
    BEGIN
        RAISERROR('Cannot delete client with existing projects', 16, 1)
        RETURN
    END
    
    DELETE FROM projecthub.Clients WHERE Id = @Id
    
    SELECT @@ROWCOUNT as DeletedRows
END

GO

