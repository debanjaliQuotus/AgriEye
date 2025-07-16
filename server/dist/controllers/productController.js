"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictPrice = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// GET: All products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_1.default.find()
            .populate('farmerId', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(products);
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error fetching products'
        });
    }
});
exports.getProducts = getProducts;
// GET: Product by ID
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.default.findById(req.params.id)
            .populate('farmerId', 'name email');
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        res.status(200).json(product);
    }
    catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error fetching product'
        });
    }
});
exports.getProductById = getProductById;
// POST: Create a product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized: User not found in request'
            });
            return;
        }
        const files = req.files;
        const userId = req.user._id;
        const imagePaths = Array.isArray(files)
            ? files.map((file) => `/uploads/products/${file.filename}`)
            : [];
        const product = yield Product_1.default.create({
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            unit: req.body.unit,
            farmerId: userId,
            images: imagePaths,
            status: 'available'
        });
        res.status(201).json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('Product creation error:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error creating product'
        });
    }
});
exports.createProduct = createProduct;
// PUT: Update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        // Check authorization
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId || product.farmerId.toString() !== userId.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
            return;
        }
        // Handle image updates
        let updatedImages = [...product.images];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
            // If keepImages wasn't specified, replace all images
            const keepImages = req.body.keepImages ? JSON.parse(req.body.keepImages) : [];
            if (keepImages.length > 0) {
                updatedImages = [...keepImages, ...newImages];
            }
            else {
                // Delete old images
                for (const oldImage of product.images) {
                    const fullPath = path_1.default.join(__dirname, '../../uploads/products', path_1.default.basename(oldImage));
                    if (fs_1.default.existsSync(fullPath)) {
                        fs_1.default.unlinkSync(fullPath);
                    }
                }
                updatedImages = newImages;
            }
        }
        // Prepare update data
        const updateData = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
            price: Number(req.body.price),
            quantity: Number(req.body.quantity),
            unit: req.body.unit,
            images: updatedImages
        };
       
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).populate('farmerId', 'name email');
        if (!updatedProduct) {
            throw new Error('Product update failed');
        }
        res.status(200).json({
            success: true,
            data: updatedProduct
        });
    }
    catch (error) {
        console.error('Error updating product:', error);
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Error updating product'
        });
    }
});
exports.updateProduct = updateProduct;
// DELETE: Product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({
                success: false,
                message: 'Product not found'
            });
            return;
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId || product.farmerId.toString() !== userId.toString()) {
            res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
            return;
        }
        // Delete images from file system
        for (const imagePath of product.images) {
            const fullPath = path_1.default.join(__dirname, '../../uploads/products', path_1.default.basename(imagePath));
            if (fs_1.default.existsSync(fullPath)) {
                fs_1.default.unlinkSync(fullPath);
            }
        }
        yield Product_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error deleting product'
        });
    }
});
exports.deleteProduct = deleteProduct;
// GET: Predict price via SERP API
const predictPrice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Valid query parameter is required'
            });
            return;
        }
      
        const response = yield axios_1.default.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google_shopping',
                q,
                gl: 'in',
                hl: 'en',
                api_key: process.env.SERP_API_KEY,
                num: 5
            }
        });
        if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.shopping_results)) {
            throw new Error('Invalid response from SERP API');
        }
        const predictions = response.data.shopping_results
            .filter((item) => item.price && typeof item.price === 'string')
            .map((item) => ({
            title: item.title || 'Unknown Product',
            price: item.price.replace(/[^0-9,.]/g, ''),
            source: item.source || 'Unknown Source'
        }))
            .slice(0, 5);
        res.status(200).json({
            success: true,
            predictions,
            query: q
        });
    }
    catch (error) {
        console.error('Price prediction error:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            query: req.query.q,
            response: error instanceof Error && 'response' in error ? error.response : undefined
        });
        res.status(500).json({
            success: false,
            message: 'Failed to fetch price predictions',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.predictPrice = predictPrice;
