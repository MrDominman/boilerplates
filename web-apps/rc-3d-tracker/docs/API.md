# RC 3D Tracker API Documentation

## Overview

The RC 3D Tracker API provides RESTful endpoints for managing 3D printing projects, components, and parts. All endpoints return JSON responses with a consistent structure.

## Base URL

```
http://localhost:5000/api
```

## Response Format

All API responses follow this structure:

```json
{
  "success": boolean,
  "message": string,
  "data": any,
  "errors": array (optional)
}
```

## Authentication

Currently, no authentication is required. This may be added in future versions.

## Endpoints

### Projects

#### GET /projects
Get all projects.

**Response:**
```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "F-35 Lightning II Scale Model",
      "aircraft_model": "F-35",
      "description": "1/6 scale F-35 with working EDF",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### GET /projects/:id
Get a specific project by ID.

#### GET /projects/:id/summary
Get project summary with progress statistics.

**Response:**
```json
{
  "success": true,
  "message": "Project summary retrieved successfully",
  "data": {
    "project": { /* project object */ },
    "components": {
      "total": 5,
      "purchased": 2,
      "progress": 40
    },
    "parts": {
      "total": 6,
      "printed": 3,
      "progress": 50,
      "total_print_time": 42.0,
      "total_weight": 1410
    }
  }
}
```

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "Project Name",
  "aircraft_model": "F-35",
  "description": "Optional description"
}
```

#### PUT /projects/:id
Update an existing project.

#### DELETE /projects/:id
Delete a project and all associated components and parts.

#### GET /projects/aircraft-models
Get list of available aircraft models.

### Components

#### GET /projects/:projectId/components
Get all components for a project.

#### GET /projects/:projectId/components/stats
Get component statistics for a project.

**Response:**
```json
{
  "success": true,
  "message": "Component statistics retrieved successfully",
  "data": {
    "total": 5,
    "purchased": 2,
    "total_quantity": 8,
    "purchased_quantity": 3,
    "progress": 40,
    "quantity_progress": 37
  }
}
```

#### GET /components/:id
Get a specific component by ID.

#### POST /projects/:projectId/components
Create a new component.

**Request Body:**
```json
{
  "name": "XFly 90mm EDF Unit",
  "quantity": 1,
  "purchased": false,
  "notes": "Optional notes"
}
```

#### PUT /components/:id
Update an existing component.

#### PATCH /components/:id/toggle-purchased
Toggle the purchased status of a component.

#### DELETE /components/:id
Delete a component.

#### PATCH /components/bulk-update-purchased
Bulk update purchased status for multiple components.

**Request Body:**
```json
{
  "ids": [1, 2, 3],
  "purchased": true
}
```

### Parts

#### GET /projects/:projectId/parts
Get all parts for a project.

**Query Parameters:**
- `sort_by_time`: boolean - Sort by print time
- `ascending`: boolean - Sort order (default: true)

#### GET /projects/:projectId/parts/stats
Get part statistics for a project.

**Response:**
```json
{
  "success": true,
  "message": "Part statistics retrieved successfully",
  "data": {
    "total": 6,
    "printed": 3,
    "total_print_time": 42.0,
    "total_weight": 1410,
    "printed_time": 24.5,
    "printed_weight": 850,
    "progress": 50,
    "time_progress": 58,
    "weight_progress": 60
  }
}
```

#### GET /projects/:projectId/parts/remaining-time
Get remaining print time for unprinted parts.

#### GET /parts/:id
Get a specific part by ID.

#### POST /projects/:projectId/parts
Create a new part.

**Request Body:**
```json
{
  "name": "Wing_Left.stl",
  "estimated_print_time": 8.0,
  "estimated_weight": 280,
  "printed": false,
  "notes": "Optional notes"
}
```

#### PUT /parts/:id
Update an existing part.

#### PATCH /parts/:id/toggle-printed
Toggle the printed status of a part.

#### DELETE /parts/:id
Delete a part.

#### PATCH /parts/bulk-update-printed
Bulk update printed status for multiple parts.

**Request Body:**
```json
{
  "ids": [1, 2, 3],
  "printed": true
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Validation Rules

### Projects
- `name`: Required, 1-255 characters
- `aircraft_model`: Required, 1-100 characters
- `description`: Optional, max 1000 characters

### Components
- `name`: Required, 1-255 characters
- `quantity`: Required, positive integer
- `purchased`: Optional, boolean
- `notes`: Optional, max 500 characters

### Parts
- `name`: Required, 1-255 characters
- `estimated_print_time`: Required, non-negative number (hours)
- `estimated_weight`: Required, non-negative number (grams)
- `printed`: Optional, boolean
- `notes`: Optional, max 500 characters

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

## Health Check

#### GET /health
Check API health status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

