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
exports.getAllFeedbacks = exports.createFeedback = void 0;
const Feedback_1 = __importDefault(require("../models/Feedback"));
const createFeedback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authenticated' });
            return;
        }
        const { message, phoneNumber, rating, category } = req.body;
        if (!message) {
            res.status(400).json({ message: 'Message is required' });
            return;
        }
        const feedback = new Feedback_1.default({
            userId: req.user._id,
            message,
            phoneNumber,
            rating,
            category,
            name: req.user.name,
            email: req.user.email,
        });
        yield feedback.save();
        res.status(201).json({ message: 'Feedback submitted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error submitting feedback' });
    }
});
exports.createFeedback = createFeedback;
const getAllFeedbacks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, category, sort = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (category) {
            query.category = category;
        }
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);
        const skip = (pageNumber - 1) * limitNumber;
        const sortOptions = {
            [sort]: order === 'asc' ? 1 : -1
        };
        const feedbacks = yield Feedback_1.default.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNumber);
        const total = yield Feedback_1.default.countDocuments(query);
        res.status(200).json({
            total,
            page: pageNumber,
            pages: Math.ceil(total / limitNumber),
            feedbacks,
        });
    }
    catch (error) {
        console.error('Error fetching feedbacks:', error);
        res.status(500).json({ message: 'Server error fetching feedbacks' });
    }
});
exports.getAllFeedbacks = getAllFeedbacks;
