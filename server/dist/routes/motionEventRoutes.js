"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const motionEventController_1 = require("../controllers/motionEventController");
const router = express_1.default.Router();
// Set up multer to read image as Buffer
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// Routes
router.post('/', upload.single('photo'), motionEventController_1.createMotionEvent);
router.get('/', motionEventController_1.getAllMotionEvents);
exports.default = router;
