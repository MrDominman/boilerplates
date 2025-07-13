const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { 
    validateProject, 
    validateId, 
    sendErrorResponse, 
    sendSuccessResponse,
    AIRCRAFT_MODELS 
} = require('../middleware/validation');

// GET /api/projects - Get all projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.findAll();
        sendSuccessResponse(res, projects, 'Projects retrieved successfully');
    } catch (error) {
        console.error('Error fetching projects:', error);
        sendErrorResponse(res, 500, 'Failed to fetch projects');
    }
});

// GET /api/projects/aircraft-models - Get available aircraft models
router.get('/aircraft-models', (req, res) => {
    sendSuccessResponse(res, AIRCRAFT_MODELS, 'Aircraft models retrieved successfully');
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return sendErrorResponse(res, 404, 'Project not found');
        }
        
        sendSuccessResponse(res, project, 'Project retrieved successfully');
    } catch (error) {
        console.error('Error fetching project:', error);
        sendErrorResponse(res, 500, 'Failed to fetch project');
    }
});

// GET /api/projects/:id/summary - Get project summary with progress
router.get('/:id/summary', validateId, async (req, res) => {
    try {
        const summary = await Project.getSummary(req.params.id);
        
        if (!summary) {
            return sendErrorResponse(res, 404, 'Project not found');
        }
        
        sendSuccessResponse(res, summary, 'Project summary retrieved successfully');
    } catch (error) {
        console.error('Error fetching project summary:', error);
        sendErrorResponse(res, 500, 'Failed to fetch project summary');
    }
});

// POST /api/projects - Create new project
router.post('/', validateProject, async (req, res) => {
    try {
        const projectData = {
            name: req.body.name,
            aircraft_model: req.body.aircraft_model,
            description: req.body.description || null
        };
        
        const project = await Project.create(projectData);
        sendSuccessResponse(res, project, 'Project created successfully');
    } catch (error) {
        console.error('Error creating project:', error);
        sendErrorResponse(res, 500, 'Failed to create project');
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', validateId, validateProject, async (req, res) => {
    try {
        const projectData = {
            name: req.body.name,
            aircraft_model: req.body.aircraft_model,
            description: req.body.description || null
        };
        
        const project = await Project.update(req.params.id, projectData);
        
        if (!project) {
            return sendErrorResponse(res, 404, 'Project not found');
        }
        
        sendSuccessResponse(res, project, 'Project updated successfully');
    } catch (error) {
        console.error('Error updating project:', error);
        sendErrorResponse(res, 500, 'Failed to update project');
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deleted = await Project.delete(req.params.id);
        
        if (!deleted) {
            return sendErrorResponse(res, 404, 'Project not found');
        }
        
        sendSuccessResponse(res, null, 'Project deleted successfully');
    } catch (error) {
        console.error('Error deleting project:', error);
        sendErrorResponse(res, 500, 'Failed to delete project');
    }
});

module.exports = router;

