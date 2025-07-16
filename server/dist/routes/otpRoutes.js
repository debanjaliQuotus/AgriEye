"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otpController_1 = require("../controllers/otpController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/send-otp', auth_1.authenticateToken, otpController_1.sendOtp);
router.post('/verify-otp', auth_1.authenticateToken, otpController_1.verifyOtp);
exports.default = router;
