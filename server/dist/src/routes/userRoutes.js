"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/register', userController_1.registerUser);
router.post('/login', userController_1.loginUser);
router.get('/validate', auth_1.authenticateToken, userController_1.validateToken);
router.get('/farmers', auth_1.authenticateToken, userController_1.getFarmers);
router.get('/phone-verification-status', auth_1.authenticateToken, userController_1.checkPhoneVerification);
exports.default = router;
