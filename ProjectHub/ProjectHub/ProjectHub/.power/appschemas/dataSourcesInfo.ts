/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "office365users": {
    "tableId": "",
    "version": "",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "UpdateMyProfile": {
        "path": "/{connectionId}/codeless/v1.0/me",
        "method": "PATCH",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          }
        ],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyProfile_V2": {
        "path": "/{connectionId}/codeless/v1.0/me",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "UpdateMyPhoto": {
        "path": "/{connectionId}/codeless/v1.0/me/photo/$value",
        "method": "PUT",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "body",
            "in": "body",
            "required": true,
            "type": "object",
            "default": null
          },
          {
            "name": "Content-Type",
            "in": "header",
            "required": true,
            "type": "string",
            "default": "image/jpeg"
          }
        ],
        "responseInfo": {
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyTrendingDocuments": {
        "path": "/{connectionId}/codeless/beta/me/insights/trending",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "extractSensitivityLabel",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "false"
          },
          {
            "name": "fetchSensitivityLabelMetadata",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "false"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "RelevantPeople": {
        "path": "/{connectionId}/users/{userId}/relevantpeople",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "MyProfile": {
        "path": "/{connectionId}/users/me",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserProfile": {
        "path": "/{connectionId}/users/{userId}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserPhotoMetadata": {
        "path": "/{connectionId}/users/photo",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserPhoto": {
        "path": "/{connectionId}/users/photo/value",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "query",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "Manager": {
        "path": "/{connectionId}/users/{userId}/manager",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "DirectReports": {
        "path": "/{connectionId}/users/{userId}/directReports",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "userId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "array",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "SearchUser": {
        "path": "/{connectionId}/users",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "searchTerm",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": 0
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "array",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "SearchUserV2": {
        "path": "/{connectionId}/v2/users",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "searchTerm",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "isSearchTermRequired",
            "in": "query",
            "required": false,
            "type": "boolean",
            "default": true
          },
          {
            "name": "skipToken",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "202": {
            "type": "void",
            "format": null
          },
          "200": {
            "type": "object",
            "format": null
          },
          "400": {
            "type": "void",
            "format": null
          },
          "401": {
            "type": "void",
            "format": null
          },
          "403": {
            "type": "void",
            "format": null
          },
          "500": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "TestConnection": {
        "path": "/{connectionId}/testconnection",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "void",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      },
      "UserProfile_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "Manager_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/manager",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "DirectReports_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/directReports",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$select",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "$top",
            "in": "query",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "UserPhoto_V2": {
        "path": "/{connectionId}/codeless/v1.0/users/{id}/photo/$value",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "string",
            "format": "binary"
          }
        }
      },
      "TrendingDocuments": {
        "path": "/{connectionId}/codeless/beta/users/{id}/insights/trending",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "id",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "$filter",
            "in": "query",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "extractSensitivityLabel",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "false"
          },
          {
            "name": "fetchSensitivityLabelMetadata",
            "in": "query",
            "required": false,
            "type": "string",
            "default": "false"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          }
        }
      },
      "HttpRequest": {
        "path": "/{connectionId}/codeless/httprequest",
        "method": "POST",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Uri",
            "in": "header",
            "required": true,
            "type": "string",
            "default": null
          },
          {
            "name": "Method",
            "in": "header",
            "required": true,
            "type": "string",
            "default": "GET"
          },
          {
            "name": "Body",
            "in": "body",
            "required": false,
            "type": "object",
            "default": null
          },
          {
            "name": "ContentType",
            "in": "header",
            "required": false,
            "type": "string",
            "default": "application/json"
          },
          {
            "name": "CustomHeader1",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader2",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader3",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader4",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "CustomHeader5",
            "in": "header",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {
          "200": {
            "type": "object",
            "format": null
          },
          "default": {
            "type": "void",
            "format": null
          }
        }
      }
    }
  },
  "sqldb-codeapps-dev": {
    "tableId": "",
    "version": "v2",
    "primaryKey": "",
    "dataSourceType": "Connector",
    "apis": {
      "/projecthub.sp_CreateClient": {
        "path": "/projecthub.sp_CreateClient",
        "method": "POST",
        "parameters": [
          {
            "name": "Address",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "City",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Company",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "ContactPerson",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Country",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Email",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Industry",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Name",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Notes",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Phone",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "State",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "ZipCode",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_CreateProject": {
        "path": "/projecthub.sp_CreateProject",
        "method": "POST",
        "parameters": [
          {
            "name": "Budget",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "ClientId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Description",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EndDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EstimatedHours",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "Name",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "StartDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_CreateTask": {
        "path": "/projecthub.sp_CreateTask",
        "method": "POST",
        "parameters": [
          {
            "name": "AssignedTo",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Description",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "DueDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EndDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EstimatedHours",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "ParentTaskId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PredecessorIds",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Progress",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "ProjectId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "StartDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "TaskOrder",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "Title",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_DeleteClient": {
        "path": "/projecthub.sp_DeleteClient",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_DeleteProject": {
        "path": "/projecthub.sp_DeleteProject",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_DeleteTask": {
        "path": "/projecthub.sp_DeleteTask",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_GetAllClients": {
        "path": "/projecthub.sp_GetAllClients",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetAllProjects": {
        "path": "/projecthub.sp_GetAllProjects",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetAllTasks": {
        "path": "/projecthub.sp_GetAllTasks",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetClientById": {
        "path": "/projecthub.sp_GetClientById",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_GetDashboardStats": {
        "path": "/projecthub.sp_GetDashboardStats",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetProjectById": {
        "path": "/projecthub.sp_GetProjectById",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_GetProjectProgress": {
        "path": "/projecthub.sp_GetProjectProgress",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetRecentActivity": {
        "path": "/projecthub.sp_GetRecentActivity",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetTaskById": {
        "path": "/projecthub.sp_GetTaskById",
        "method": "POST",
        "parameters": [
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_GetTasksByProjectId": {
        "path": "/projecthub.sp_GetTasksByProjectId",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_GetUpcomingDeadlines": {
        "path": "/projecthub.sp_GetUpcomingDeadlines",
        "method": "POST",
        "parameters": [],
        "responseInfo": {}
      },
      "/projecthub.sp_ReorderTask": {
        "path": "/projecthub.sp_ReorderTask",
        "method": "POST",
        "parameters": [
          {
            "name": "NewPosition",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "ParentTaskId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "ProjectId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "TaskId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_SearchClients": {
        "path": "/projecthub.sp_SearchClients",
        "method": "POST",
        "parameters": [
          {
            "name": "CompanyFilter",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "PageNumber",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PageSize",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "SearchTerm",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortColumn",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortDirection",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "TotalRecords",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_SearchProjects": {
        "path": "/projecthub.sp_SearchProjects",
        "method": "POST",
        "parameters": [
          {
            "name": "ClientId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PageNumber",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PageSize",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SearchTerm",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortColumn",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortDirection",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "StartDateFrom",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "StartDateTo",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "TotalRecords",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_SearchTasks": {
        "path": "/projecthub.sp_SearchTasks",
        "method": "POST",
        "parameters": [
          {
            "name": "AssignedTo",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "DueDateFrom",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "DueDateTo",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "IncludeCompleted",
            "in": "body",
            "required": false,
            "type": "boolean",
            "default": null
          },
          {
            "name": "PageNumber",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PageSize",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "ProjectId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "SearchTerm",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortColumn",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "SortDirection",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "TotalRecords",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_UpdateClient": {
        "path": "/projecthub.sp_UpdateClient",
        "method": "POST",
        "parameters": [
          {
            "name": "Address",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "City",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Company",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "ContactPerson",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Country",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Email",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Industry",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Name",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Notes",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Phone",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "State",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "ZipCode",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_UpdateProject": {
        "path": "/projecthub.sp_UpdateProject",
        "method": "POST",
        "parameters": [
          {
            "name": "Budget",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "ClientId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Description",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EndDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EstimatedHours",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "Name",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "StartDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      },
      "/projecthub.sp_UpdateTask": {
        "path": "/projecthub.sp_UpdateTask",
        "method": "POST",
        "parameters": [
          {
            "name": "ActualHours",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "AssignedTo",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Description",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "DueDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EndDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "EstimatedHours",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "Id",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "ParentTaskId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "PredecessorIds",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Priority",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Progress",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "ProjectId",
            "in": "body",
            "required": false,
            "type": "integer",
            "default": null
          },
          {
            "name": "StartDate",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "Status",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          },
          {
            "name": "TaskOrder",
            "in": "body",
            "required": false,
            "type": "number",
            "default": null
          },
          {
            "name": "Title",
            "in": "body",
            "required": false,
            "type": "string",
            "default": null
          }
        ],
        "responseInfo": {}
      }
    }
  }
};