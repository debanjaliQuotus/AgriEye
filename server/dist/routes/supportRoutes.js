"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/supportRoutes.ts
const express_1 = __importDefault(require("express"));
const supportController_1 = require("../controllers/supportController");
const router = express_1.default.Router();
// Anyone can send a support message; no auth middleware here
router.post('/', supportController_1.sendSupportMessage);
exports.default = router;
