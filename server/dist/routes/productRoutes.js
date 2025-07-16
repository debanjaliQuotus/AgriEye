"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const upload_1 = require("../middleware/upload");
const productController_1 = require("../controllers/productController");
const router = express_1.default.Router();
// Price prediction route
router.get('/predict-price', authMiddleware_1.authenticate, productController_1.predictPrice);
// Product CRUD routes
router.get('/', productController_1.getProducts);
router.post('/', authMiddleware_1.authenticate, upload_1.handleProductUpload, productController_1.createProduct);
router.get('/:id', productController_1.getProductById);
router.put('/:id', authMiddleware_1.authenticate, upload_1.handleProductUpload, productController_1.updateProduct);
router.delete('/:id', authMiddleware_1.authenticate, productController_1.deleteProduct);
exports.default = router;
