"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const motionEventRoutes_1 = __importDefault(require("./motionEventRoutes"));
const smsRoutes_1 = __importDefault(require("./smsRoutes"));
const router = express_1.default.Router();
router.use('/users', userRoutes_1.default);
router.use('/motion', motionEventRoutes_1.default);
router.use('/notification', smsRoutes_1.default);
exports.default = router;
