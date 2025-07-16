"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/subsidyRoutes.ts
const express_1 = __importDefault(require("express"));
const subsidyController_1 = require("../controllers/subsidyController");
const authMiddleware_1 = require("../middleware/authMiddleware"); // Assuming you have an auth middleware
const router = express_1.default.Router();
// Auth middleware assumed to be applied globally or here
router.post("/apply", authMiddleware_1.authenticate, subsidyController_1.applySubsidy);
router.put("/:id/status", authMiddleware_1.authenticate, subsidyController_1.updateSubsidyStatus);
router.get("/my", authMiddleware_1.authenticate, subsidyController_1.getFarmerSubsidies);
router.get("/all", authMiddleware_1.authenticate, subsidyController_1.getAllSubsidies);
exports.default = router;
