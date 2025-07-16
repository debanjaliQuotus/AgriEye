"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const loanController_1 = require("../controllers/loanController");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const roleCheck_1 = require("../middleware/roleCheck");
const router = express_1.default.Router();
// Validators
const loanValidator = [
    (0, express_validator_1.body)('amount')
        .isNumeric().withMessage('Amount must be a number')
        .isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('purpose')
        .isIn(['seeds', 'equipment', 'irrigation', 'land', 'other'])
        .withMessage('Invalid purpose value'),
    (0, express_validator_1.body)('term')
        .isIn(['3months', '6months', '1year', '2years', '5years'])
        .withMessage('Invalid term value'),
    (0, express_validator_1.body)('collateral')
        .notEmpty().withMessage('Collateral is required')
        .isString().withMessage('Collateral must be text'),
    (0, express_validator_1.body)('cropType')
        .notEmpty().withMessage('Crop type is required')
        .isString().withMessage('Crop type must be text'),
    (0, express_validator_1.body)('landSize')
        .optional()
        .isFloat({ min: 0 }).withMessage('Land size must be a positive number'),
    (0, express_validator_1.body)('farmDetails')
        .optional()
        .isString().withMessage('Farm details must be text')
];
const statusValidator = [
    (0, express_validator_1.body)('status')
        .isIn(['pending', 'approved', 'rejected', 'completed'])
        .withMessage('Invalid status value'),
];
// Middleware to check if user is farmer
const isFarmer = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'farmer') {
        res.status(403).json({ message: 'Access denied. Farmer only.' });
        return;
    }
    next();
};
// Routes
router.post('/', auth_1.authenticateToken, isFarmer, loanValidator, loanController_1.createLoan);
router.get('/', auth_1.authenticateToken, roleCheck_1.isAdmin, loanController_1.getAllLoans);
router.get('/farmer', auth_1.authenticateToken, isFarmer, loanController_1.getFarmerLoans);
router.get('/stats', auth_1.authenticateToken, roleCheck_1.isAdmin, loanController_1.getLoanStats);
router.get('/:id', auth_1.authenticateToken, loanController_1.getLoanById);
router.put('/:id/status', auth_1.authenticateToken, roleCheck_1.isAdmin, statusValidator, loanController_1.updateLoanStatus);
exports.default = router;
