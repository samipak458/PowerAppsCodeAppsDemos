CREATE TABLE [projecthub].[Projects] (
    [Id]             INT             IDENTITY (1, 1) NOT NULL,
    [Name]           NVARCHAR (255)  NOT NULL,
    [Description]    NVARCHAR (MAX)  NULL,
    [ClientId]       INT             NOT NULL,
    [Status]         NVARCHAR (20)   DEFAULT ('Planning') NOT NULL,
    [Priority]       NVARCHAR (20)   DEFAULT ('Medium') NOT NULL,
    [StartDate]      DATETIME2 (7)   NULL,
    [EndDate]        DATETIME2 (7)   NULL,
    [EstimatedHours] DECIMAL (10, 2) NULL,
    [ActualHours]    DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Budget]         DECIMAL (18, 2) NULL,
    [Progress]       INT             DEFAULT ((0)) NOT NULL,
    [CreatedDate]    DATETIME2 (7)   DEFAULT (getutcdate()) NOT NULL,
    [LastModified]   DATETIME2 (7)   DEFAULT (getutcdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Projects_Priority] CHECK ([Priority]='Critical' OR [Priority]='High' OR [Priority]='Medium' OR [Priority]='Low'),
    CONSTRAINT [CK_Projects_Progress] CHECK ([Progress]>=(0) AND [Progress]<=(100)),
    CONSTRAINT [CK_Projects_Status] CHECK ([Status]='Cancelled' OR [Status]='Completed' OR [Status]='On Hold' OR [Status]='In Progress' OR [Status]='Planning'),
    CONSTRAINT [FK_Projects_ClientId] FOREIGN KEY ([ClientId]) REFERENCES [projecthub].[Clients] ([Id])
);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_Priority]
    ON [projecthub].[Projects]([Priority] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_StartDate]
    ON [projecthub].[Projects]([StartDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_Status]
    ON [projecthub].[Projects]([Status] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_CreatedDate]
    ON [projecthub].[Projects]([CreatedDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_ClientId]
    ON [projecthub].[Projects]([ClientId] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Projects_EndDate]
    ON [projecthub].[Projects]([EndDate] ASC);


GO

