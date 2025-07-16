"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cropController_1 = require("../controllers/cropController");
// Create an express router
const router = express_1.default.Router();
// Set up multer storage configuration (in-memory storage as an example)
const storage = multer_1.default.memoryStorage(); // File will be stored in memory, you can change this to diskStorage if needed
// Create an upload middleware
const upload = (0, multer_1.default)({ storage });
// Define the POST route for crop health detection
router.post('/detect', upload.single('image'), (req, res, next) => {
    (0, cropController_1.detectCropHealth)(req, res, next).catch(next);
});
exports.default = router;
