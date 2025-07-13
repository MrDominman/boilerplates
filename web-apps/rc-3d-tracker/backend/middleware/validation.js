const { body, param, validationResult } = require('express-validator');

// Validation middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Project validation rules
const validateProject = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Project name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Project name must be between 1 and 255 characters'),
    
    body('aircraft_model')
        .trim()
        .notEmpty()
        .withMessage('Aircraft model is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('Aircraft model must be between 1 and 100 characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Description must not exceed 1000 characters'),
    
    handleValidationErrors
];

// Component validation rules
const validateComponent = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Component name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Component name must be between 1 and 255 characters'),
    
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    
    body('purchased')
        .optional()
        .isBoolean()
        .withMessage('Purchased must be a boolean value'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    
    handleValidationErrors
];

// Part validation rules
const validatePart = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Part name is required')
        .isLength({ min: 1, max: 255 })
        .withMessage('Part name must be between 1 and 255 characters'),
    
    body('estimated_print_time')
        .isFloat({ min: 0 })
        .withMessage('Estimated print time must be a non-negative number'),
    
    body('estimated_weight')
        .isFloat({ min: 0 })
        .withMessage('Estimated weight must be a non-negative number'),
    
    body('printed')
        .optional()
        .isBoolean()
        .withMessage('Printed must be a boolean value'),
    
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    
    handleValidationErrors
];

// ID parameter validation
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID must be a positive integer'),
    
    handleValidationErrors
];

// Project ID parameter validation
const validateProjectId = [
    param('projectId')
        .isInt({ min: 1 })
        .withMessage('Project ID must be a positive integer'),
    
    handleValidationErrors
];

// Bulk operations validation
const validateBulkIds = [
    body('ids')
        .isArray({ min: 1 })
        .withMessage('IDs must be a non-empty array')
        .custom((ids) => {
            if (!ids.every(id => Number.isInteger(id) && id > 0)) {
                throw new Error('All IDs must be positive integers');
            }
            return true;
        }),
    
    handleValidationErrors
];

// Common aircraft models for validation
const AIRCRAFT_MODELS = [
    'F-35', 'F-16', 'F-18', 'F-22', 'A-10', 'B-2', 'B-52',
    'A330-300', 'A380', 'Boeing 737', 'Boeing 747', 'Boeing 777', 'Boeing 787',
    'Cessna 172', 'Piper Cherokee', 'Beechcraft Bonanza',
    'P-51 Mustang', 'Spitfire', 'Corsair', 'Zero', 'Bf-109',
    'Custom', 'Other'
];

// Validate aircraft model against common models (optional strict validation)
const validateAircraftModel = [
    body('aircraft_model')
        .trim()
        .notEmpty()
        .withMessage('Aircraft model is required')
        .custom((value) => {
            // Allow any aircraft model, but suggest common ones
            return true;
        }),
    
    handleValidationErrors
];

// Error response helper
const sendErrorResponse = (res, statusCode, message, errors = null) => {
    const response = {
        success: false,
        message
    };
    
    if (errors) {
        response.errors = errors;
    }
    
    return res.status(statusCode).json(response);
};

// Success response helper
const sendSuccessResponse = (res, data, message = 'Success') => {
    return res.json({
        success: true,
        message,
        data
    });
};

module.exports = {
    validateProject,
    validateComponent,
    validatePart,
    validateId,
    validateProjectId,
    validateBulkIds,
    validateAircraftModel,
    handleValidationErrors,
    sendErrorResponse,
    sendSuccessResponse,
    AIRCRAFT_MODELS
};

