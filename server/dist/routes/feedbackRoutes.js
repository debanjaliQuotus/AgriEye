"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleCheck_1 = require("../middleware/roleCheck");
const router = express_1.default.Router();
router.post('/', authMiddleware_1.authenticate, feedbackController_1.createFeedback);
router.get('/', authMiddleware_1.authenticate, roleCheck_1.isAdmin, feedbackController_1.getAllFeedbacks);
exports.default = router;
