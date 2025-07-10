# PowerShell script to setup data sources for ProjectHub Power Apps Code App
# Database: YOUR_SERVER_NAME.database.windows.net,YOUR_DATABASE_NAME

Write-Host "Setting up data sources for ProjectHub..." -ForegroundColor Green

# Connection IDs from pac connection list - REPLACE WITH YOUR ACTUAL CONNECTION IDs
$officeUsersConnectionId = "YOUR_OFFICE365_CONNECTION_ID"
$sqlConnectionId = "YOUR_SQL_CONNECTION_ID"
$databaseServer = "YOUR_SERVER_NAME.database.windows.net,YOUR_DATABASE_NAME"

Write-Host "Adding Office 365 Users data source..." -ForegroundColor Yellow
pac code add-data-source -a "shared_office365users" -c $officeUsersConnectionId

Write-Host "Adding SQL Server data sources..." -ForegroundColor Yellow

# Client stored procedures
Write-Host "Adding Client stored procedures..." -ForegroundColor Cyan
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_SearchClients" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetClientById" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_CreateClient" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_UpdateClient" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_DeleteClient" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetAllClients" -d $databaseServer

# Project stored procedures
Write-Host "Adding Project stored procedures..." -ForegroundColor Cyan
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_SearchProjects" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetProjectById" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_CreateProject" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_UpdateProject" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_DeleteProject" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetAllProjects" -d $databaseServer

# Task stored procedures
Write-Host "Adding Task stored procedures..." -ForegroundColor Cyan
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_SearchTasks" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetTaskById" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_CreateTask" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_UpdateTask" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_DeleteTask" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetAllTasks" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetTasksByProjectId" -d $databaseServer

# Dashboard stored procedures
Write-Host "Adding Dashboard stored procedures..." -ForegroundColor Cyan
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetDashboardStats" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetRecentActivity" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetProjectProgress" -d $databaseServer
pac code add-data-source -a "shared_sql" -c $sqlConnectionId -sp "projecthub.sp_GetUpcomingDeadlines" -d $databaseServer

Write-Host "Data sources setup complete!" -ForegroundColor Green
Write-Host "Generated files will be in:" -ForegroundColor Yellow
Write-Host "  - src/Models/ (TypeScript interfaces)" -ForegroundColor White
Write-Host "  - src/Services/ (Service classes)" -ForegroundColor White
Write-Host "  - .power/schemas/ (Schema definitions)" -ForegroundColor White
