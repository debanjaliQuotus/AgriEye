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
exports.getAllMotionEvents = exports.createMotionEvent = void 0;
const path_1 = __importDefault(require("path"));
const MotionEvent_1 = __importDefault(require("../models/MotionEvent"));
const vision_1 = require("@google-cloud/vision");
const keyPath = path_1.default.resolve(__dirname, "../visionapi/crucial-raceway-459108-k2-efcf8535a54d.json");
const createMotionEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { timestamp } = req.body;
        if (!req.file) {
            res.status(400).json({ message: "Photo file is required" });
            return;
        }
        let parsedTimestamp;
        if (timestamp) {
            parsedTimestamp = new Date(timestamp);
            if (isNaN(parsedTimestamp.getTime())) {
                res.status(400).json({
                    message: "Invalid timestamp format. Use ISO format (e.g., 2025-05-05T10:00:00.000Z)",
                });
                return;
            }
        }
        else {
            parsedTimestamp = new Date();
        }
        const client = new vision_1.ImageAnnotatorClient({
            keyFilename: keyPath,
        });
        if (!client.objectLocalization) {
            res.status(500).json({ message: 'Object localization method not available' });
            return;
        }
        const [result] = yield client.objectLocalization({
            image: { content: req.file.buffer }
        });
        if (!result.localizedObjectAnnotations) {
            res.status(500).json({ message: 'No object annotations found' });
            return;
        }
        const detectedObjects = result.localizedObjectAnnotations.map((object) => {
            var _a, _b, _c, _d, _e;
            return ({
                label: (_a = object.name) !== null && _a !== void 0 ? _a : '',
                confidence: (_b = object.score) !== null && _b !== void 0 ? _b : 0,
                boundingBox: (_e = (_d = (_c = object.boundingPoly) === null || _c === void 0 ? void 0 : _c.normalizedVertices) === null || _d === void 0 ? void 0 : _d.map((v) => {
                    var _a, _b;
                    return [
                        (_a = v.x) !== null && _a !== void 0 ? _a : 0,
                        (_b = v.y) !== null && _b !== void 0 ? _b : 0,
                    ];
                })) !== null && _e !== void 0 ? _e : [],
            });
        });
        const newEvent = new MotionEvent_1.default({
            timestamp: parsedTimestamp,
            photo: req.file.buffer,
            detectedObjects,
        });
        yield newEvent.save();
        res.status(201).json({
            message: "Motion event saved and object detection completed successfully",
            detectedObjects,
        });
    }
    catch (error) {
        console.error("Error saving motion event:", error);
        res.status(500).json({
            message: error instanceof Error ? error.message : "Internal server error"
        });
    }
});
exports.createMotionEvent = createMotionEvent;
const getAllMotionEvents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield MotionEvent_1.default.find().sort({ createdAt: -1 });
        const formattedEvents = events.map((event) => ({
            _id: event._id,
            timestamp: event.timestamp.toISOString(),
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            photo: event.photo,
            detectedObjects: event.detectedObjects,
        }));
        res.json(formattedEvents);
    }
    catch (error) {
        console.error("Error fetching motion events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllMotionEvents = getAllMotionEvents;
