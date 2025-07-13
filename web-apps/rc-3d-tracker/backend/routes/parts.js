const express = require('express');
const router = express.Router();
const Part = require('../models/Part');
const { 
    validatePart, 
    validateId, 
    validateProjectId,
    validateBulkIds,
    sendErrorResponse, 
    sendSuccessResponse 
} = require('../middleware/validation');

// GET /api/projects/:projectId/parts - Get all parts for a project
router.get('/projects/:projectId/parts', validateProjectId, async (req, res) => {
    try {
        const { sort_by_time, ascending } = req.query;
        let parts;
        
        if (sort_by_time === 'true') {
            parts = await Part.findByProjectIdSortedByTime(
                req.params.projectId, 
                ascending !== 'false'
            );
        } else {
            parts = await Part.findByProjectId(req.params.projectId);
        }
        
        sendSuccessResponse(res, parts, 'Parts retrieved successfully');
    } catch (error) {
        console.error('Error fetching parts:', error);
        sendErrorResponse(res, 500, 'Failed to fetch parts');
    }
});

// GET /api/projects/:projectId/parts/stats - Get part statistics for a project
router.get('/projects/:projectId/parts/stats', validateProjectId, async (req, res) => {
    try {
        const stats = await Part.getStatsByProjectId(req.params.projectId);
        sendSuccessResponse(res, stats, 'Part statistics retrieved successfully');
    } catch (error) {
        console.error('Error fetching part statistics:', error);
        sendErrorResponse(res, 500, 'Failed to fetch part statistics');
    }
});

// GET /api/projects/:projectId/parts/remaining-time - Get remaining print time
router.get('/projects/:projectId/parts/remaining-time', validateProjectId, async (req, res) => {
    try {
        const remainingTime = await Part.getRemainingPrintTime(req.params.projectId);
        sendSuccessResponse(
            res, 
            { remaining_time: remainingTime }, 
            'Remaining print time retrieved successfully'
        );
    } catch (error) {
        console.error('Error fetching remaining print time:', error);
        sendErrorResponse(res, 500, 'Failed to fetch remaining print time');
    }
});

// GET /api/parts/:id - Get part by ID
router.get('/:id', validateId, async (req, res) => {
    try {
        const part = await Part.findById(req.params.id);
        
        if (!part) {
            return sendErrorResponse(res, 404, 'Part not found');
        }
        
        sendSuccessResponse(res, part, 'Part retrieved successfully');
    } catch (error) {
        console.error('Error fetching part:', error);
        sendErrorResponse(res, 500, 'Failed to fetch part');
    }
});

// POST /api/projects/:projectId/parts - Create new part
router.post('/projects/:projectId/parts', validateProjectId, validatePart, async (req, res) => {
    try {
        const partData = {
            project_id: req.params.projectId,
            name: req.body.name,
            estimated_print_time: req.body.estimated_print_time,
            estimated_weight: req.body.estimated_weight,
            printed: req.body.printed || false,
            notes: req.body.notes || null
        };
        
        const part = await Part.create(partData);
        sendSuccessResponse(res, part, 'Part created successfully');
    } catch (error) {
        console.error('Error creating part:', error);
        sendErrorResponse(res, 500, 'Failed to create part');
    }
});

// PUT /api/parts/:id - Update part
router.put('/:id', validateId, validatePart, async (req, res) => {
    try {
        const partData = {
            name: req.body.name,
            estimated_print_time: req.body.estimated_print_time,
            estimated_weight: req.body.estimated_weight,
            printed: req.body.printed,
            notes: req.body.notes || null
        };
        
        const part = await Part.update(req.params.id, partData);
        
        if (!part) {
            return sendErrorResponse(res, 404, 'Part not found');
        }
        
        sendSuccessResponse(res, part, 'Part updated successfully');
    } catch (error) {
        console.error('Error updating part:', error);
        sendErrorResponse(res, 500, 'Failed to update part');
    }
});

// PATCH /api/parts/:id/toggle-printed - Toggle printed status
router.patch('/:id/toggle-printed', validateId, async (req, res) => {
    try {
        const part = await Part.togglePrinted(req.params.id);
        
        if (!part) {
            return sendErrorResponse(res, 404, 'Part not found');
        }
        
        sendSuccessResponse(res, part, 'Part print status updated successfully');
    } catch (error) {
        console.error('Error toggling part print status:', error);
        sendErrorResponse(res, 500, 'Failed to update part print status');
    }
});

// DELETE /api/parts/:id - Delete part
router.delete('/:id', validateId, async (req, res) => {
    try {
        const deleted = await Part.delete(req.params.id);
        
        if (!deleted) {
            return sendErrorResponse(res, 404, 'Part not found');
        }
        
        sendSuccessResponse(res, null, 'Part deleted successfully');
    } catch (error) {
        console.error('Error deleting part:', error);
        sendErrorResponse(res, 500, 'Failed to delete part');
    }
});

// PATCH /api/parts/bulk-update-printed - Bulk update printed status
router.patch('/bulk-update-printed', validateBulkIds, async (req, res) => {
    try {
        const { ids, printed } = req.body;
        
        if (typeof printed !== 'boolean') {
            return sendErrorResponse(res, 400, 'Printed status must be a boolean value');
        }
        
        const updatedCount = await Part.bulkUpdatePrinted(ids, printed);
        
        sendSuccessResponse(
            res, 
            { updated_count: updatedCount }, 
            `${updatedCount} parts updated successfully`
        );
    } catch (error) {
        console.error('Error bulk updating parts:', error);
        sendErrorResponse(res, 500, 'Failed to bulk update parts');
    }
});

module.exports = router;

