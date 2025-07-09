CREATE TABLE [projecthub].[Tasks] (
    [Id]             INT             IDENTITY (1, 1) NOT NULL,
    [Title]          NVARCHAR (255)  NOT NULL,
    [Description]    NVARCHAR (MAX)  NULL,
    [ProjectId]      INT             NOT NULL,
    [ParentTaskId]   INT             NULL,
    [PredecessorIds] NVARCHAR (MAX)  NULL,
    [AssignedTo]     NVARCHAR (255)  NULL,
    [Status]         NVARCHAR (20)   DEFAULT ('Not Started') NOT NULL,
    [Priority]       NVARCHAR (20)   DEFAULT ('Medium') NOT NULL,
    [StartDate]      DATETIME2 (7)   NULL,
    [EndDate]        DATETIME2 (7)   NULL,
    [DueDate]        DATETIME2 (7)   NULL,
    [EstimatedHours] DECIMAL (10, 2) NULL,
    [ActualHours]    DECIMAL (10, 2) DEFAULT ((0)) NULL,
    [Progress]       INT             DEFAULT ((0)) NOT NULL,
    [TaskOrder]      DECIMAL (18, 6) DEFAULT ((1000.0)) NOT NULL,
    [CreatedDate]    DATETIME2 (7)   DEFAULT (getutcdate()) NOT NULL,
    [LastModified]   DATETIME2 (7)   DEFAULT (getutcdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [CK_Tasks_Priority] CHECK ([Priority]='Critical' OR [Priority]='High' OR [Priority]='Medium' OR [Priority]='Low'),
    CONSTRAINT [CK_Tasks_Progress] CHECK ([Progress]>=(0) AND [Progress]<=(100)),
    CONSTRAINT [CK_Tasks_Status] CHECK ([Status]='Cancelled' OR [Status]='On Hold' OR [Status]='Completed' OR [Status]='In Progress' OR [Status]='Not Started'),
    CONSTRAINT [FK_Tasks_ParentTaskId] FOREIGN KEY ([ParentTaskId]) REFERENCES [projecthub].[Tasks] ([Id]),
    CONSTRAINT [FK_Tasks_ProjectId] FOREIGN KEY ([ProjectId]) REFERENCES [projecthub].[Projects] ([Id])
);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_CreatedDate]
    ON [projecthub].[Tasks]([CreatedDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_DueDate]
    ON [projecthub].[Tasks]([DueDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_Status]
    ON [projecthub].[Tasks]([Status] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_ProjectId]
    ON [projecthub].[Tasks]([ProjectId] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_TaskOrder]
    ON [projecthub].[Tasks]([ProjectId] ASC, [ParentTaskId] ASC, [TaskOrder] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_AssignedTo]
    ON [projecthub].[Tasks]([AssignedTo] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_StartDate]
    ON [projecthub].[Tasks]([StartDate] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_Priority]
    ON [projecthub].[Tasks]([Priority] ASC);


GO

CREATE NONCLUSTERED INDEX [IX_Tasks_ParentTaskId]
    ON [projecthub].[Tasks]([ParentTaskId] ASC);


GO

