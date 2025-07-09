CREATE TABLE [projecthub].[Clients] (
    [Id]            INT            IDENTITY (1, 1) NOT NULL,
    [Name]          NVARCHAR (255) NOT NULL,
    [ContactPerson] NVARCHAR (255) NOT NULL,
    [Email]         NVARCHAR (255) NOT NULL,
    [Phone]         NVARCHAR (50)  NULL,
    [Company]       NVARCHAR (255) NULL,
    [Address]       NVARCHAR (500) NULL,
    [City]          NVARCHAR (100) NULL,
    [State]         NVARCHAR (50)  NULL,
    [ZipCode]       NVARCHAR (20)  NULL,
    [Country]       NVARCHAR (100) NULL,
    [Industry]      NVARCHAR (100) NULL,
    [Notes]         NVARCHAR (MAX) NULL,
    [Status]        NVARCHAR (20)  DEFAULT ('Active') NOT NULL,
    [CreatedDate]   DATETIME2 (7)  DEFAULT (getutcdate()) NOT NULL,
    [LastModified]  DATETIME2 (7)  DEFAULT (getutcdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Clients_Status] CHECK ([Status]='Prospect' OR [Status]='Inactive' OR [Status]='Active'),
    CONSTRAINT [UQ_Clients_Email] UNIQUE NONCLUSTERED ([Email] ASC)
);


GO

CREATE NONCLUSTERED INDEX [IX_Clients_Industry]
    ON [projecthub].[Clients]([Industry] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Clients_CreatedDate]
    ON [projecthub].[Clients]([CreatedDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Clients_Name]
    ON [projecthub].[Clients]([Name] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Clients_Company]
    ON [projecthub].[Clients]([Company] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Clients_Status]
    ON [projecthub].[Clients]([Status] ASC);


GO

