"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ekycController_1 = require("../controllers/ekycController");
const auth_1 = require("../middleware/auth");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
// Verify eKYC route
router.post('/verify', auth_1.authenticateToken, upload_1.handleEkycUpload, ekycController_1.verifyEkyc);
// Get eKYC status route
router.get('/status', auth_1.authenticateToken, ekycController_1.getEkycStatus);
exports.default = router;
