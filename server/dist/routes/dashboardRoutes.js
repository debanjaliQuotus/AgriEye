"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const router = express_1.default.Router();
// Protect all dashboard routes with authentication and admin role check
router.use(authMiddleware_1.authenticate);
router.use((0, roleMiddleware_1.authorizeRoles)('admin'));
// Protected routes
router.get('/stats', dashboardController_1.getDashboardStats);
exports.default = router;
