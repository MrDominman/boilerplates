const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { 
    validateComponent, 
    validateId, 
    validateProjectId,
    validateBulkIds,
    sendErrorResponse, 
    sendSuccessResponse 
} = require('../middleware/validation');

// GET /api/projects/:projectId/components - Get all components for a project
router.get('/projects/:projectId/components', validateProjectId, async (req, res) => {
    try {
        const components = await Component.findByProjectId(req.params.projectId);
        sendSuccessResponse(res, components, 'Components retrieved successfully');
    } catch (error) {
        console.error('Error fetching components:', error);
        sendErrorResponse(res, 500, 'Failed to fetch components');
    }
});

// GET /api/projects/:projectId/components/stats - Get component statistics for a project
router.get('/projects/:projectId/components/stats', validateProjectId, async (req, res) => {
    try {
        const stats = await Component.getStatsByProjectId(req.params.projectId);
        sendSuccessResponse(res, stats, 'Component statistics retrieved successfully');
    } catch (error) {
        console.error('Error fetching component statistics:', error);
        sendErrorResponse(res, 500, 'Failed to fetch component statistics');
    }
});

// GET /api/components/:id - Get component by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const component = await Component.findById(req.params.id);
        
        if (!component) {
            return sendErrorResponse(res, 404, 'Component not found');
        }
        
        sendSuccessResponse(res, component, 'Component retrieved successfully');
    } catch (error) {
        console.error('Error fetching component:', error);
        sendErrorResponse(res, 500, 'Failed to fetch component');
    }
});

// POST /api/projects/:projectId/components - Create new component
router.post('/projects/:projectId/components', validateProjectId, validateComponent, async (req, res) => {
    try {
        const componentData = {
            project_id: req.params.projectId,
            name: req.body.name,
            quantity: req.body.quantity,
            purchased: req.body.purchased || false,
            notes: req.body.notes || null
        };
        
        const component = await Component.create(componentData);
        sendSuccessResponse(res, component, 'Component created successfully');
    } catch (error) {
        console.error('Error creating component:', error);
        sendErrorResponse(res, 500, 'Failed to create component');
    }
});

// PUT /api/components/:id - Update component
router.put('/:id', validateId, validateComponent, async (req, res) => {
    try {
        const componentData = {
            name: req.body.name,
            quantity: req.body.quantity,
            purchased: req.body.purchased,
            notes: req.body.notes || null
        };
        
        const component = await Component.update(req.params.id, componentData);
        
        if (!component) {
            return sendErrorResponse(res, 404, 'Component not found');
        }
        
        sendSuccessResponse(res, component, 'Component updated successfully');
    } catch (error) {
        console.error('Error updating component:', error);
        sendErrorResponse(res, 500, 'Failed to update component');
    }
});

// PATCH /api/components/:id/toggle-purchased - Toggle purchased status
router.patch('/:id/toggle-purchased', validateId, async (req, res) => {
    try {
        const component = await Component.togglePurchased(req.params.id);
        
        if (!component) {
            return sendErrorResponse(res, 404, 'Component not found');
        }
        
        sendSuccessResponse(res, component, 'Component purchase status updated successfully');
    } catch (error) {
        console.error('Error toggling component purchase status:', error);
        sendErrorResponse(res, 500, 'Failed to update component purchase status');
    }
});

// DELETE /api/components/:id - Delete component
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deleted = await Component.delete(req.params.id);
        
        if (!deleted) {
            return sendErrorResponse(res, 404, 'Component not found');
        }
        
        sendSuccessResponse(res, null, 'Component deleted successfully');
    } catch (error) {
        console.error('Error deleting component:', error);
        sendErrorResponse(res, 500, 'Failed to delete component');
    }
});

// PATCH /api/components/bulk-update-purchased - Bulk update purchased status
router.patch('/bulk-update-purchased', validateBulkIds, async (req, res) => {
    try {
        const { ids, purchased } = req.body;
        
        if (typeof purchased !== 'boolean') {
            return sendErrorResponse(res, 400, 'Purchased status must be a boolean value');
        }
        
        const updatedCount = await Component.bulkUpdatePurchased(ids, purchased);
        
        sendSuccessResponse(
            res, 
            { updated_count: updatedCount }, 
            `${updatedCount} components updated successfully`
        );
    } catch (error) {
        console.error('Error bulk updating components:', error);
        sendErrorResponse(res, 500, 'Failed to bulk update components');
    }
});

module.exports = router;

